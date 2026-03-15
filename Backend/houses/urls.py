from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HouseViewSet, houses_by_city

router = DefaultRouter()
router.register(r'', HouseViewSet, basename='house')

urlpatterns = [
    path('by-city/', houses_by_city, name='houses-by-city'),
    path('', include(router.urls)),
]
