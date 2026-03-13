from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import House
from .serializers import HouseSerializer
from core.utils import StandardResultsSetPagination, haversine

class HouseViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = House.objects.all().order_by('-created_at')
    serializer_class = HouseSerializer
    pagination_class = StandardResultsSetPagination
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filtering
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

    @action(detail=False, methods=['get'])
    def radius_search(self, request):
        lat = request.query_params.get('latitude')
        lon = request.query_params.get('longitude')
        radius = request.query_params.get('radius') # In km

        if not all([lat, lon, radius]):
            return Response({"error": "Please provide latitude, longitude, and radius"}, status=400)

        try:
            lat = float(lat)
            lon = float(lon)
            radius = float(radius)
        except ValueError:
            return Response({"error": "Invalid coordinates or radius"}, status=400)

        # Get all houses that have coordinates
        houses = self.get_queryset().exclude(latitude__isnull=True).exclude(longitude__isnull=True)
        
        nearby_houses = []
        for house in houses:
            distance = haversine(lat, lon, float(house.latitude), float(house.longitude))
            if distance <= radius:
                nearby_houses.append((house, distance))
                
        # Sort by distance
        nearby_houses.sort(key=lambda x: x[1])
        
        # Paginate results
        houses_list = [h[0] for h in nearby_houses]
        page = self.paginate_queryset(houses_list)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            # Optionally add distance to response, for simplicity returning serialized houses
            return self.get_paginated_response(serializer.data)
            
        serializer = self.get_serializer(houses_list, many=True)
        return Response(serializer.data)
