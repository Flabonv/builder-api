"""
Serializers for traildig APIs
"""
from django.db import models

from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from core.models import (
    TrailDig,
    Tag,
)


class TagSerializer(serializers.ModelSerializer):
    """Serializer for tag."""
    amount_work_done_minutes = serializers.SerializerMethodField()
    # amount_work_done_per_year = serializers.SerializerMethodField()

    class Meta:
        model = Tag
        fields = ['id', 'name', 'amount_work_done_minutes']
        # , 'amount_work_done_per_year']
        read_only_fields = ['id']

    def get_amount_work_done_minutes(self, obj):
        return TrailDig.objects.filter(tags=obj).aggregate(
            total=models.Sum('time_minutes'))['total'] or 0

    # def get_amount_work_done_per_year(self, obj):
    #    current_year = timezone.now().year
    #    return TrailDig.objects.filter(tags=obj,
    #        created__year=current_year).aggregate(
    #        total=models.Sum('time_minutes'))['total'] or 0


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
            'date_time'
        ]
        read_only_fields = ['id']

    def _get_tags(self, tags, traildig):
        """Handle getting tags."""
        auth_user = self.context['request'].user
        for tag in tags:
            try:
                tag_obj = Tag.objects.get(
                    user=auth_user,
                    **tag,
                )
                traildig.tags.add(tag_obj)
            except Tag.DoesNotExist:
                raise ValidationError(f"Tag {tag['name']} does not exist.")

    def create(self, validated_data):
        """Create a traildig"""
        tags = validated_data.pop('tags', [])
        traildig = TrailDig.objects.create(**validated_data)
        self._get_tags(tags, traildig)

        return traildig

    def update(self, instance, validated_data):
        """Update a traildig"""
        tags = validated_data.pop('tags', None)
        if tags is not None:
            instance.tags.clear()
            self._get_tags(tags, instance)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance

    def validate(self, data):
        """Custom validations."""
        tags = data.get('tags', [])
        for tag in tags:
            try:
                Tag.objects.get(name=tag['name'])
            except Tag.DoesNotExist:
                raise ValidationError(f"Tag {tag['name']} does not exist.")

        return data

    def validate_date_time(self, value):
        """Ensure the datetime is naive."""
        if value.tzinfo is not None:
            raise serializers.ValidationError(
                "Datetime must be naive (without timezone)."
                )
        return value


class TrailDigDetailSerializer(TrailDigSerializer):
    """Serializer for trail dig detail view."""

    class Meta(TrailDigSerializer.Meta):
        fields = TrailDigSerializer.Meta.fields + ['description']
