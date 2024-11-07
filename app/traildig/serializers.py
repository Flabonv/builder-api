"""
Serializers for traildig APIs
"""
from rest_framework import serializers

from core.models import (
    TrailDig,
    Tag,
)


class TagSerializer(serializers.ModelSerializer):
    """Serializer for tag."""

    class Meta:
        model = Tag
        fields = ['id', 'name']
        read_only_fields = ['id']


class TrailDigSerializer(serializers.ModelSerializer):
    """Serializer for trail digs."""
    tags = TagSerializer(many=True, required=False)

    class Meta:
        model = TrailDig
        fields = [
            'id',
            'title',
            'time_minutes',
            'number_people',
            'link',
            'tags',
        ]
        read_only_fields = ['id']

    def _get_or_create_tags(self, tags, traildig):
        """Handle getting or creating tags as needed."""
        auth_user = self.context['request'].user
        for tag in tags:
            tag_obj, created = Tag.objects.get_or_create(
                user=auth_user,
                **tag,
            )
            traildig.tags.add(tag_obj)

    def create(self, validated_data):
        """Create a traildig"""
        tags = validated_data.pop('tags', [])
        traildig = TrailDig.objects.create(**validated_data)
        self._get_or_create_tags(tags, traildig)

        return traildig

    def update(self, instance, validated_data):
        """Update a traildig"""
        tags = validated_data.pop('tags', None)
        if tags is not None:
            instance.tags.clear()
            self._get_or_create_tags(tags, instance)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance


class TrailDigDetailSerializer(TrailDigSerializer):
    """Serializer for trail dig detail view."""

    class Meta(TrailDigSerializer.Meta):
        fields = TrailDigSerializer.Meta.fields + ['description']
