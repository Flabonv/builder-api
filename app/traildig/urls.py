"""
URL mappings for the traildig app.
"""
from django.urls import (
    path,
    include,
)

from rest_framework.routers import DefaultRouter

from traildig import views

router = DefaultRouter()
router.register('traildigs', views.TrailDigViewSet)

app_name = 'traildig'

urlpatterns = [
    path('', include(router.urls)),
]
