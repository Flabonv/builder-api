"""
Tests for traildig APIs.
"""
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APIClient

from core.models import TrailDig

from traildig.serializers import (
        TrailDigSerializer,
        TrailDigDetailSerializer,
)


TRAILDIGS_URL = reverse('traildig:traildig-list')


def detail_url(traildig_id):
    """Create and return trail dig detail URL."""
    return reverse('traildig:traildig-detail', args=[traildig_id])


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


def create_user(**params):
    """Create and return a new user."""
    return get_user_model().objects.create_user(**params)


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
        self.user = create_user(
            email='user@example.com',
            password='testpass23')
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
        other_user = create_user(email='other@example.com', password='test123')
        create_traildig(user=other_user)
        create_traildig(user=self.user)

        res = self.client.get(TRAILDIGS_URL)

        traildigs = TrailDig.objects.filter(user=self.user)
        serializer = TrailDigSerializer(traildigs, many=True)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_get_traildig_detail(self):
        """Test get dig detail."""
        traildig = create_traildig(user=self.user)

        url = detail_url(traildig.id)
        res = self.client.get(url)

        serializer = TrailDigDetailSerializer(traildig)
        self.assertEqual(res.data, serializer.data)

    def test_create_reciep(self):
        """Test creating a trail dig."""
        payload = {
            'title': 'Sample dig',
            'time_minutes': 120,
            'number_people': 5,
        }
        res = self.client.post(TRAILDIGS_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        traildig = TrailDig.objects.get(id=res.data['id'])
        for k, v in payload.items():
            self.assertEqual(getattr(traildig, k), v)
        self.assertEqual(traildig.user, self.user)

    def test_partial_update(self):
        """test partial update of a trail dig"""
        original_link = "http://example.com/traildig.pdf"
        traildig = create_traildig(
            user=self.user,
            title='Sample dig title',
            link=original_link,
        )

        payload = {'title': 'New dig title'}
        url = detail_url(traildig.id)
        res = self.client.patch(url, payload)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        traildig.refresh_from_db()
        self.assertEqual(traildig.title, payload['title'])
        self.assertEqual(traildig.link, original_link)
        self.assertEqual(traildig.user, self.user)

    def test_full_update(self):
        """Test full update of dig"""
        traildig = create_traildig(
            user=self.user,
            title='Sample title',
            link='http://example.com/traildig.pdf',
            description='Sample dig description'
        )
        payload = {
            'title': 'New dig title',
            'link': 'http://example.com/new_traildig.pdf',
            'description': 'New dig description',
            'time_minutes': 120,
            'number_people': 10,
        }
        url = detail_url(traildig.id)
        res = self.client.put(url, payload)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        traildig.refresh_from_db()
        for k, v in payload.items():
            self.assertEqual(getattr(traildig, k), v)
        self.assertEqual(traildig.user, self.user)

    def test_updating_user_creates_error(self):
        """Test updating a user creates an error."""
        new_user = create_user(email='user2@example.com', password='test123')
        traildig = create_traildig(user=self.user)

        payload = {'user': new_user.id}
        url = detail_url(traildig.id)
        self.client.patch(url, payload)

        traildig.refresh_from_db()
        self.assertEqual(traildig.user, self.user)

    def test_delete_traildif(self):
        """Test deleting a dig is successfull."""
        traildig = create_traildig(user=self.user)

        url = detail_url(traildig.id)
        res = self.client.delete(url)

        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(TrailDig.objects.filter(id=traildig.id).exists())

    def test_delete_other_users_traildig_error(self):
        """Test trying to delete other user digs gives error."""
        new_user = create_user(email='user2@example.com', password='test123')
        traildig = create_traildig(user=new_user)

        url = detail_url(traildig.id)
        res = self.client.delete(url)

        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)
        self.assertTrue(TrailDig.objects.filter(id=traildig.id).exists())
