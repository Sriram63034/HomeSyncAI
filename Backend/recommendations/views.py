from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from houses.serializers import HouseSerializer
from .services import get_recommendations_for_user

class RecommendationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            # Get raw recommendations
            raw_recs = get_recommendations_for_user(request.user)
            
            # Serialize the house details
            results = []
            for rec in raw_recs:
                house_data = HouseSerializer(rec['house']).data
                results.append({
                    "house_details": house_data,
                    "image_url": house_data.get('image_url'),
                    "match_score": rec['match_score'],
                    "match_breakdown": rec['match_breakdown']
                })
                
            return Response(results, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
