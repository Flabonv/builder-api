"""
Views fro the trail dig APIs.
"""
from rest_framework import (
        viewsets,
        mixins,
)
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

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
        return self.queryset.filter(user=self.request.user).order_by('-id')

    def get_serializer_class(self):
        """Return the serializer class for request."""
        if self.action == 'list':
            return serializers.TrailDigSerializer

        return self.serializer_class

    def perform_create(self, serializer):
        """Crate a new trail dig."""
        serializer.save(user=self.request.user)


class TagViewSet(mixins.DestroyModelMixin,
                 mixins.UpdateModelMixin,
                 mixins.ListModelMixin,
                 viewsets.GenericViewSet):
    """Manage tags in the database."""
    serializer_class = serializers.TagSerializer
    queryset = Tag.objects.all()
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Retrieve tag for authencated user."""
        return self.queryset.filter(user=self.request.user).order_by('-name')
