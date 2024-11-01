"""
Views fro the trail dig APIs.
"""
from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from core.models import TrailDig
from traildig import serializers


class TrailDigViewSet(viewsets.ModelViewSet):
    """View for manage trail dig APIs."""
    serializer_class = serializers.TrailDigSerializer
    queryset = TrailDig.objects.all()
    authentification_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Retrieve trail digs for authencated user."""
        return self.queryset.filter(user=self.request.user).order_by('-id')
