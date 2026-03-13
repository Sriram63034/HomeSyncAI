from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # The default implementation uses self.username_field which is 'email'
        # but the frontend might be sending it as 'username' or 'email'
        # We ensure it works with 'email' as requested
        username = attrs.get("email")
        password = attrs.get("password")

        if username and password:
            user = User.objects.filter(email=username).first()
            if user and user.check_password(password):
                attrs['email'] = username
                return super().validate(attrs)
        
        raise serializers.ValidationError("Incorrect email or password")

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['full_name'] = user.full_name
        return token

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'full_name')


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('id', 'full_name', 'email', 'password', 'confirm_password')

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("User already exists")
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        # Use create_user which handles password setting and saving
        user = User.objects.create_user(**validated_data)
        return user
