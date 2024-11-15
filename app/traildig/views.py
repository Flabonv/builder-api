"""
Views fro the trail dig APIs.
"""
from rest_framework import (
        viewsets,
        mixins,
        status
)
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import (
    IsAuthenticated,
    IsAdminUser,
)

from core.models import (
        TrailDig,
        Tag
)
from traildig import serializers


class TrailDigViewSet(viewsets.ModelViewSet):
    """View for manage trail dig APIs."""
    serializer_class = serializers.TrailDigDetailSerializer
    queryset = TrailDig.objects.all()
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Retrieve trail digs for authencated user."""
        return self.queryset.order_by('-id')

    def get_serializer_class(self):
        """Return the serializer class for request."""
        if self.action == 'list':
            return serializers.TrailDigSerializer

        return self.serializer_class

    def perform_create(self, serializer):
        """Crate a new trail dig."""
        serializer.save(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.user != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        return super().destroy(request, *args, **kwargs)


class BaseTrailDigAttrViewSet(mixins.DestroyModelMixin,
                              mixins.UpdateModelMixin,
                              mixins.ListModelMixin,
                              viewsets.GenericViewSet):
    """Base trail dig attribute view set."""
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Retrieve tag for authencated user."""
        return self.queryset.order_by('-name')

    def get_permissions(self):
        """Assign permissions based on action"""
        if self.action in ['list', 'retrieve']:
            self.permission_classes = [IsAuthenticated]
        else:
            self.permission_classes = [IsAdminUser]

        return super().get_permissions()


class TagViewSet(BaseTrailDigAttrViewSet):
    """Manage tags in the database."""
    serializer_class = serializers.TagSerializer
    queryset = Tag.objects.all()
