"""
Serializers for traildig APIs
"""
from rest_framework import serializers

from core.models import TrailDig


class TrailDigSerializer(serializers.ModelSerializer):
    """Serializer for trail digs."""

    class Meta:
        model = TrailDig
        fields = ['id', 'title', 'time_minutes', 'number_people', 'link']
        read_only_fields = ['id']
