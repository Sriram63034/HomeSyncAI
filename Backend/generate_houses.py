import os
import django
import random

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'homesync_backend.settings')
django.setup()

from houses.models import House

def main():

    cities = {
        "Bengaluru": [("Koramangala", 12.9352, 77.6245), ("Whitefield", 12.9698, 77.7499)],
        "Mumbai": [("Andheri", 19.1136, 72.8697), ("Bandra", 19.0596, 72.8295)],
        "Delhi": [("Saket", 28.5245, 77.2066), ("Dwarka", 28.5921, 77.0460)],
        "Hyderabad": [("Banjara Hills", 17.4126, 78.4482), ("Gachibowli", 17.4401, 78.3489)],
        "Chennai": [("Anna Nagar", 13.0843, 80.2705), ("T Nagar", 13.0418, 80.2341)],
        "Pune": [("Baner", 18.5590, 73.7868), ("Hinjewadi", 18.5913, 73.7389)]
    }

    titles = [
        "Luxury Villa",
        "Modern Apartment",
        "Premium Penthouse",
        "Elegant Family Home"
    ]

    property_types = [
        "Apartment",
        "Villa",
        "Independent House",
        "Studio Apartment"
    ]

    amenities_list = [
        "Parking", "Gym", "Swimming Pool", "Garden",
        "Security", "Lift", "Power Backup"
    ]

    descriptions = [
        "Beautiful modern home located in a prime area.",
        "Spacious property with natural lighting.",
        "Luxury property with premium amenities.",
        "Perfect family home in a peaceful neighborhood."
    ]

    images = [
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
        "https://images.unsplash.com/photo-1595243643203-06ba168495ea",
        "https://images.unsplash.com/photo-1613977257363-707ba9348227"
    ]

    for i in range(500):   # you can change to 1500 later
        city = random.choice(list(cities.keys()))
        area, lat, lon = random.choice(cities[city])

        House.objects.create(
            title=random.choice(titles) + " in " + area,
            city=city,
            area=area,
            price=random.randint(4000000, 30000000),
            bedrooms=random.randint(1, 5),
            bathrooms=random.randint(1, 4),
            square_feet=random.randint(600, 4000),
            latitude=lat + random.uniform(-0.02, 0.02),
            longitude=lon + random.uniform(-0.02, 0.02),
            property_type=random.choice(property_types),
            amenities=random.sample(amenities_list, random.randint(2, 4)),
            description=random.choice(descriptions),
            image_url=random.choice(images)
        )

    print("✅ Data added successfully!")

if __name__ == "__main__":
    main()