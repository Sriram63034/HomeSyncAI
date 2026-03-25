from django.http import JsonResponse, HttpResponse
from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import F

from .models import House
from .serializers import HouseSerializer
from core.utils import StandardResultsSetPagination

# ✅ Import script correctly
from . import generate_houses


# 🔥 RUN SCRIPT (to insert data into PostgreSQL)
def run_script(request):
    generate_houses.main()
    return HttpResponse("✅ Data inserted successfully!")


# 🔥 GET ALL CITIES (PUBLIC)
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def get_cities(request):
    cities_data = House.objects.exclude(
        latitude__isnull=True
    ).exclude(
        longitude__isnull=True
    ).values('city').distinct().annotate(
        lat=F('latitude'),
        lng=F('longitude')
    )

    unique_cities = {}

    for entry in cities_data:
        city_name = entry['city'].strip()
        if city_name and city_name not in unique_cities:
            unique_cities[city_name] = {
                "city": city_name,
                "lat": float(entry['lat']),
                "lng": float(entry['lng'])
            }

    return Response(list(unique_cities.values()))


# 🔥 GET HOUSES BY CITY (PUBLIC)
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def houses_by_city(request):
    city = request.GET.get("city")

    if not city:
        return JsonResponse({"error": "City is required"}, status=400)

    houses = House.objects.filter(city__iexact=city)
    return JsonResponse(list(houses.values()), safe=False)


# 🔥 MAIN API (PUBLIC)
class HouseViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = House.objects.all().order_by('-created_at')
    serializer_class = HouseSerializer
    pagination_class = StandardResultsSetPagination
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()

        city = self.request.query_params.get('city')
        if city:
            queryset = queryset.filter(city__icontains=city)

        min_price = self.request.query_params.get('min_price')
        if min_price:
            queryset = queryset.filter(price__gte=min_price)

        max_price = self.request.query_params.get('max_price')
        if max_price:
            queryset = queryset.filter(price__lte=max_price)

        bedrooms = self.request.query_params.get('bedrooms')
        if bedrooms:
            queryset = queryset.filter(bedrooms=bedrooms)

        property_type = self.request.query_params.get('property_type')
        if property_type:
            queryset = queryset.filter(property_type__iexact=property_type)

        return queryset