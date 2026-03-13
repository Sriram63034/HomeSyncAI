from django.urls import path
from .views import SavedHouseListCreateView, SaveHouseView, CompareHousesView

urlpatterns = [
    path('', SavedHouseListCreateView.as_view(), name='saved-list'),
    path('add/', SaveHouseView.as_view(), name='save-house'),
    path('compare/', CompareHousesView.as_view(), name='compare-houses'),
]
