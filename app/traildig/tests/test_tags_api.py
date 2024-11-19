"""
Tests for the tags API.
"""
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APIClient

from core.models import (
    TrailDig,
    Tag,
)

from traildig.serializers import TagSerializer


TAGS_URL = reverse('traildig:tag-list')


def detail_url(tag_id):
    """Create and return tag detail URL."""
    return reverse('traildig:tag-detail', args=[tag_id])


def create_user(email='user@example.com', password='testpass123'):
    """Create and return a new user"""
    return get_user_model().objects.create_user(email=email, password=password)


def create_traildig(user, **params):
    """Create and return a sample dig."""
    defaults = {
        'title': 'Sample dig title',
        'time_minutes': 22,
        'number_people': 10,
        'description': 'Sample description',
        'link': 'http://example.com/traildig.pdf',
        'date_time': '2024-10-25 10:00:00'
    }
    defaults.update(params)

    traildig = TrailDig.objects.create(user=user, **defaults)
    return traildig


class PublicTagsApiTests(TestCase):
    """Test unauthenticated api resquests."""

    def setUp(self):
        self.client = APIClient()

    def test_auth_required(self):
        """Test auth is required retrieving tags."""
        res = self.client.get(TAGS_URL)

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class PrivateTagsApiTests(TestCase):
    """Test authenticated api requests"""

    def setUp(self):
        self.user = create_user()
        self.client = APIClient()
        self.client.force_authenticate(self.user)

    def test_retrieve_tag(self):
        """Test retrieving a list of tags."""
        Tag.objects.create(user=self.user, name='Vegan')
        Tag.objects.create(user=self.user, name='Dessert')

        res = self.client.get(TAGS_URL)

        tags = Tag.objects.all().order_by('-name')
        serializer = TagSerializer(tags, many=True)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_unfiltered_tag_list_contains_all_tags(self):
        """Test tag list contains all tags."""
        other_user = create_user(email='other@example.com')
        Tag.objects.create(user=other_user, name='MTL')
        Tag.objects.create(user=self.user, name='VBN')

        res = self.client.get(TAGS_URL)

        tags = Tag.objects.all().order_by('-name')
        serializer = TagSerializer(tags, many=True)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_update_tag_fails(self):
        """Test updating a tag fails"""
        tag = Tag.objects.create(user=self.user, name='After Dinner')

        payload = {'name': 'Dessert'}
        url = detail_url(tag.id)
        res = self.client.patch(url, payload)

        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        tag.refresh_from_db()
        self.assertEqual(tag.name, 'After Dinner')

    def test_delete_tag_fails(self):
        """test deleting a tag"""
        tag = Tag.objects.create(user=self.user, name='Breakfast')

        url = detail_url(tag.id)
        res = self.client.delete(url)

        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        tags = Tag.objects.filter(user=self.user)
        self.assertTrue(tags.exists())

    def test_traildigs_hours_computed_for_biketrail(self):
        """Test the computing of trail dig hours per biketrail."""
        tag = Tag.objects.create(user=self.user, name='Chomeuse')
        dig1 = create_traildig(user=self.user)
        dig1.tags.add(tag)
        dig2 = create_traildig(user=self.user, date_time='2025-01-25 11:00:00')
        dig2.tags.add(tag)

        res = self.client.get(TAGS_URL)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        tag_data = res.data[0]
        self.assertEqual(tag_data['amount_work_done_minutes'],
                         dig1.time_minutes + dig2.time_minutes)
        # self.assertEqual(
        #     tag_data['amount_work_done_per_year'],
        #     dig1.time_minutes,
        # )
