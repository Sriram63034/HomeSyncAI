from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from houses.models import House
from houses.serializers import HouseSerializer
from django.db.models import Q, F
from django.db.models.functions import ACos, Cos, Sin, Radians
from .services import get_recommendations_for_user

class RecommendationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            city = request.query_params.get('city')
            
            if not city:
                return Response({"error": "City parameter is required"}, status=status.HTTP_400_BAD_REQUEST)

            # Simple city-based filtering
            houses = House.objects.filter(city__iexact=city)

            # Fallback: if no houses in city, return all houses (up to 10)
            if not houses.exists():
                houses = House.objects.all()[:10]

            results = []
            for house in houses:
                results.append({
                    "title": house.title,
                    "city": house.city,
                    "price": str(house.price),
                    "bedrooms": house.bedrooms,
                    "latitude": house.latitude,
                    "longitude": house.longitude,
                    "image_url": house.image_url,
                    "id": house.id
                })
                
            return Response(results, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        try:
            city = request.data.get("city")
            if not city:
                return Response({"error": "City is required"}, status=status.HTTP_400_BAD_REQUEST)
            
            # City alias mapping for common mismatches
            CITY_MAPPING = {
                "bangalore": "Bengaluru",
                "bombay": "Mumbai",
                "madras": "Chennai",
                "calcutta": "Kolkata"
            }
            
            normalized_city = CITY_MAPPING.get(city.lower(), city)
                
            # Filter houses strictly by city or area (more flexible)
            houses = House.objects.filter(
                Q(city__icontains=normalized_city) | 
                Q(city__icontains=city) |
                Q(area__icontains=normalized_city)
            )
            
            # Fallback: if still no results, try just the first word (e.g., "Navi Mumbai" -> "Mumbai")
            if not houses.exists() and " " in city:
                first_word = city.split(" ")[0]
                houses = House.objects.filter(city__icontains=first_word)
            
            # Return serialized houses
            results = []
            for house in houses:
                house_data = HouseSerializer(house).data
                results.append({
                    "house_details": house_data,
                    "image_url": house_data.get('image_url'),
                    "match_score": 100, # Base score for city match
                    "match_breakdown": {"location": 100}
                })
            
            return Response(results, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
