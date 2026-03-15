from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HouseViewSet, houses_by_city, get_cities

router = DefaultRouter()
router.register(r'', HouseViewSet, basename='house')

urlpatterns = [
    path('cities/', get_cities, name='cities-list'),
    path('by-city/', houses_by_city, name='houses-by-city'),
    path('', include(router.urls)),
]
