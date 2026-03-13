from rest_framework import serializers
from .models import SavedHouse
from houses.serializers import HouseSerializer

class SavedHouseSerializer(serializers.ModelSerializer):
    house_details = HouseSerializer(source='house', read_only=True)

    class Meta:
        model = SavedHouse
        fields = ['id', 'user', 'house', 'house_details', 'created_at']
        read_only_fields = ['user', 'created_at']
