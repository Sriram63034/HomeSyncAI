from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import SavedHouse
from .serializers import SavedHouseSerializer
from houses.models import House
from houses.serializers import HouseSerializer

class SavedHouseListCreateView(generics.ListCreateAPIView):
    serializer_class = SavedHouseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SavedHouse.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class SaveHouseView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, house_id):
        house = get_object_or_404(House, id=house_id)
        saved_house, created = SavedHouse.objects.get_or_create(user=request.user, house=house)
        if created:
            return Response({"status": "House saved successfully", "id": saved_house.id}, status=status.HTTP_201_CREATED)
        return Response({"status": "House already saved"}, status=status.HTTP_200_OK)
        
    def delete(self, request, house_id):
        house = get_object_or_404(House, id=house_id)
        SavedHouse.objects.filter(user=request.user, house=house).delete()
        return Response({"status": "House unsaved successfully"}, status=status.HTTP_204_NO_CONTENT)

class CompareHousesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        house_ids = request.data.get('house_ids', [])
        if not isinstance(house_ids, list) or len(house_ids) == 0:
            return Response({"error": "Please provide a list of house_ids"}, status=status.HTTP_400_BAD_REQUEST)

        houses = House.objects.filter(id__in=house_ids)
        serializer = HouseSerializer(houses, many=True)
        # Note: Match score for comparison could be dynamically added here based on user preferences 
        # For simple comparison, returning house details is sufficient as per requirements.
        return Response(serializer.data, status=status.HTTP_200_OK)
