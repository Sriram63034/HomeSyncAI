import csv
import random
from django.core.management.base import BaseCommand
from houses.models import House

IMAGES = [
    'https://images.unsplash.com/photo-1613490493576-7f4c9c2794fb?w=800&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    'https://images.unsplash.com/photo-1600607686527-6fb886090705?w=800&q=80',
    'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&q=80',
    'https://images.unsplash.com/photo-1570129477492-45c003efa28f?w=800&q=80',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80'
]

class Command(BaseCommand):
    help = 'Imports houses from Kaggle dataset or generates mock data with images'

    def add_arguments(self, parser):
        parser.add_argument('--file', type=str, help='Path to the dataset CSV file')

    def handle(self, *args, **kwargs):
        file_path = kwargs['file'] or 'bengaluru_house_prices.csv'
        
        try:
            with open(file_path, mode='r', encoding='utf-8') as file:
                reader = csv.DictReader(file)
                count = 0
                for row in reader:
                    try:
                        title = row.get('location', 'Unknown Location')
                        city = row.get('area_type', 'Bengaluru')
                        area = row.get('location', '')
                        
                        price_str = row.get('price', '0')
                        price = float(price_str) if price_str else 0.0
                        
                        size_str = row.get('size', '1')
                        bedrooms = int(''.join(filter(str.isdigit, size_str))) if any(c.isdigit() for c in size_str) else 1
                        
                        bathrooms_str = row.get('bath', '1')
                        bathrooms = int(float(bathrooms_str)) if bathrooms_str else 1
                        
                        sqft_str = str(row.get('total_sqft', '0'))
                        if '-' in sqft_str:
                            sqft_str = sqft_str.split('-')[0].strip()
                        square_feet = int(float(''.join(filter(str.isdigit, sqft_str))) or 0)
                        
                        property_type = row.get('area_type', 'apartment').lower()
                        
                        House.objects.create(
                            title=title,
                            city=city,
                            area=area,
                            price=price * 100000, 
                            bedrooms=bedrooms,
                            bathrooms=bathrooms,
                            square_feet=square_feet,
                            property_type=property_type,
                            description=f"Beautiful house located in {title}.",
                            image_url=random.choice(IMAGES)
                        )
                        count += 1
                        
                        if count % 100 == 0:
                            self.stdout.write(f'Imported {count} houses...')
                            
                    except Exception as e:
                        pass
                        
            self.stdout.write(self.style.SUCCESS(f'Successfully imported {count} houses'))
            
        except FileNotFoundError:
            self.stdout.write(self.style.WARNING(f'File {file_path} not found. Generating mock data instead...'))
            for i in range(50):
                city = random.choice(['Bengaluru', 'Mumbai', 'Delhi'])
                area = random.choice(['Indira Nagar', 'Koramangala', 'Whitefield', 'HSR Layout', 'Jayanagar'])
                is_apt = random.choice([True, False])
                House.objects.create(
                    title=f"{'Luxury Apartment' if is_apt else 'Beautiful Villa'} in {area}",
                    city=city,
                    area=area,
                    price=random.randint(50, 300) * 100000,
                    bedrooms=random.randint(1, 5),
                    bathrooms=random.randint(1, 4),
                    square_feet=random.randint(800, 4000),
                    property_type='apartment' if is_apt else 'villa',
                    description=f"A wonderful propery in {area}, {city}. Perfect for a family.",
                    image_url=random.choice(IMAGES),
                    latitude=12.9716 + random.uniform(-0.1, 0.1),
                    longitude=77.5946 + random.uniform(-0.1, 0.1),
                    amenities=random.sample(["parking", "gym", "pool", "security", "near metro"], k=3)
                )
            self.stdout.write(self.style.SUCCESS('Successfully generated 50 mock houses with images.'))
