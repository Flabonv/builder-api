"""
Tests for traildig APIs.
"""
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APIClient

from core.models import TrailDig

from traildig.serializers import TrailDigSerializer


TRAILDIGS_URL = reverse('traildig:traildig-list')


def create_traildig(user, **params):
    """Create and return a sample dig."""
    defaults = {
        'title': 'Sample dig title',
        'time_minutes': 22,
        'number_people': 10,
        'description': 'Sample description',
        'link': 'http://example.com/traildig.pdf',
    }
    defaults.update(params)

    traildig = TrailDig.objects.create(user=user, **defaults)
    return traildig


class PublicTrailDigAPITests(TestCase):
    """Test unauthenticated API Requests"""

    def setUp(self):
        self.client = APIClient()

    def test_auth_required(self):
        """Test auth is required to call API."""
        res = self.client.get(TRAILDIGS_URL)

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class PrivateTrailDigAPITests(TestCase):
    """Test authenticated API requests"""
    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            'user@example.com',
            'testpass23',
        )
        self.client.force_authenticate(self.user)

    def test_retrieve_traildigs(self):
        """Test retrieving a list of digs."""
        create_traildig(user=self.user)
        create_traildig(user=self.user)

        res = self.client.get(TRAILDIGS_URL)

        traildigs = TrailDig.objects.all().order_by('-id')
        serializer = TrailDigSerializer(traildigs, many=True)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_traildig_list_limited_to_user(self):
        """Test dig list is limited to authenticated user"""
        other_user = get_user_model().objects.create_user(
            'other@example.com',
            'password123',
        )
        create_traildig(user=other_user)
        create_traildig(user=self.user)

        res = self.client.get(TRAILDIGS_URL)

        traildigs = TrailDig.objects.filter(user=self.user)
        serializer = TrailDigSerializer(traildigs, many=True)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)
