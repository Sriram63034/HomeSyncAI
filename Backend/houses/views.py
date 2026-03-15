from django.http import JsonResponse
from rest_framework import viewsets, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from .models import House
from .serializers import HouseSerializer
from core.utils import StandardResultsSetPagination

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def houses_by_city(request):
    city = request.GET.get("city")
    if not city:
        return JsonResponse({"error": "City is required"}, status=400)
    houses = House.objects.filter(city__iexact=city)
    return JsonResponse(list(houses.values()), safe=False)

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

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filtering
        city = self.request.query_params.get('city')
        if city:
            queryset = queryset.filter(city__icontains=city)
            
        return queryset
