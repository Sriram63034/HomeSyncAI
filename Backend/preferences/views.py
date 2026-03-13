from rest_framework import generics, permissions
from .models import UserPreference
from .serializers import UserPreferenceSerializer

class UserPreferenceView(generics.RetrieveUpdateAPIView):
    serializer_class = UserPreferenceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        obj, created = UserPreference.objects.get_or_create(user=self.request.user)
        return obj
        
    def perform_update(self, serializer):
        serializer.save(user=self.request.user)
        
    def post(self, request, *args, **kwargs):
        # Alias POST to PUT since get_object will create it if lacking
        return self.update(request, *args, **kwargs)
