import os
import django
import random

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "homesync_backend.settings")
django.setup()

from houses.models import House

cities = {

"Bengaluru":[("Koramangala",12.9352,77.6245),("Whitefield",12.9698,77.7499),("Indira Nagar",12.9719,77.6412)],
"Mumbai":[("Andheri",19.1136,72.8697),("Bandra",19.0596,72.8295),("Powai",19.1176,72.9060)],
"Delhi":[("Saket",28.5245,77.2066),("Dwarka",28.5921,77.0460),("Rohini",28.7041,77.1025)],
"Hyderabad":[("Banjara Hills",17.4126,78.4482),("Gachibowli",17.4401,78.3489),("Madhapur",17.4485,78.3915)],
"Chennai":[("Anna Nagar",13.0843,80.2705),("T Nagar",13.0418,80.2341),("Velachery",12.9750,80.2212)],
"Pune":[("Baner",18.5590,73.7868),("Hinjewadi",18.5913,73.7389),("Kothrud",18.5074,73.8077)],

"Kolkata":[("Salt Lake",22.5726,88.3639),("New Town",22.5750,88.4794)],
"Ahmedabad":[("Satellite",23.0225,72.5714),("Navrangpura",23.0367,72.5611)],
"Jaipur":[("Malviya Nagar",26.8467,75.8067),("Vaishali Nagar",26.9147,75.7447)],
"Lucknow":[("Gomti Nagar",26.8467,81.0083),("Hazratganj",26.8500,80.9499)],
"Chandigarh":[("Sector 17",30.7333,76.7794),("Sector 22",30.7333,76.7794)],
"Indore":[("Vijay Nagar",22.7533,75.8937),("Palasia",22.7196,75.8577)],
"Bhopal":[("MP Nagar",23.2599,77.4126),("Arera Colony",23.2599,77.4126)],

"Surat":[("Adajan",21.1702,72.8311),("Vesu",21.1702,72.8311)],
"Nagpur":[("Dharampeth",21.1458,79.0882),("Sitabuldi",21.1458,79.0882)],
"Coimbatore":[("RS Puram",11.0168,76.9558),("Peelamedu",11.0168,76.9558)],
"Visakhapatnam":[("MVP Colony",17.6868,83.2185),("Gajuwaka",17.6868,83.2185)],

"Kochi":[("Kakkanad",9.9312,76.2673),("Edappally",9.9975,76.3083)],
"Thiruvananthapuram":[("Technopark",8.5241,76.9366),("Kowdiar",8.5241,76.9366)],
"Mysuru":[("Vijayanagar",12.2958,76.6394),("Gokulam",12.3052,76.6551)],
"Mangalore":[("Kadri",12.9141,74.8560),("Bejai",12.8896,74.8539)],

"Patna":[("Boring Road",25.5941,85.1376),("Kankarbagh",25.5941,85.1376)],
"Ranchi":[("Harmu",23.3441,85.3096),("Morabadi",23.3441,85.3096)],
"Bhubaneswar":[("Khandagiri",20.2961,85.8245),("Patia",20.3534,85.8195)],

"Guwahati":[("Dispur",26.1445,91.7362),("Beltola",26.1445,91.7362)],
"Dehradun":[("Rajpur Road",30.3165,78.0322),("Balliwala",30.3165,78.0322)],
"Amritsar":[("Ranjit Avenue",31.6340,74.8723),("Lawrence Road",31.6340,74.8723)],
"Ludhiana":[("Model Town",30.9010,75.8573),("Pakhowal Road",30.9010,75.8573)],

"Vadodara":[("Alkapuri",22.3072,73.1812),("Gotri",22.3072,73.1812)],
"Rajkot":[("Kalavad Road",22.3039,70.8022),("University Road",22.3039,70.8022)],

# Andhra Pradesh
"Vijayawada":[("Benz Circle",16.5062,80.6480),("Governorpet",16.5185,80.6236)],
"Guntur":[("Brodipet",16.3067,80.4365),("Arundelpet",16.3067,80.4365)],
"Nellore":[("Magunta Layout",14.4426,79.9865),("Balaji Nagar",14.4426,79.9865)],
"Tirupati":[("Renigunta Road",13.6288,79.4192),("Tiruchanoor",13.6288,79.4192)],

# Telangana
"Warangal":[("Hanamkonda",17.9689,79.5941),("Kazipet",17.9689,79.5941)],
"Karimnagar":[("Jyothi Nagar",18.4386,79.1288),("Mukrampura",18.4386,79.1288)],
"Nizamabad":[("Subhash Nagar",18.6725,78.0941),("Armoor Road",18.6725,78.0941)],

# Gujarat
"Bhavnagar":[("Waghawadi",21.7645,72.1519),("Nilambaug",21.7645,72.1519)],
"Jamnagar":[("Digvijay Plot",22.4707,70.0577),("Patel Colony",22.4707,70.0577)],
"Anand":[("Vidhyanagar",22.5645,72.9289),("Karamsad",22.5645,72.9289)],
"Gandhinagar":[("Sector 21",23.2156,72.6369),("Sector 11",23.2156,72.6369)],

# Madhya Pradesh
"Jabalpur":[("Napier Town",23.1815,79.9864),("Wright Town",23.1815,79.9864)],
"Gwalior":[("City Center",26.2183,78.1828),("Thatipur",26.2183,78.1828)],
"Ujjain":[("Freeganj",23.1765,75.7885),("Nanakhheda",23.1765,75.7885)],
"Sagar":[("Civil Lines",23.8388,78.7378),("Makronia",23.8388,78.7378)],

# Uttar Pradesh
"Kanpur":[("Kakadeo",26.4499,80.3319),("Govind Nagar",26.4499,80.3319)],
"Agra":[("Sikandra",27.1767,78.0081),("Dayalbagh",27.1767,78.0081)],
"Varanasi":[("Lanka",25.3176,82.9739),("Sigra",25.3176,82.9739)],
"Meerut":[("Shastri Nagar",28.9845,77.7064),("Ganga Nagar",28.9845,77.7064)],
"Prayagraj":[("Civil Lines",25.4358,81.8463),("George Town",25.4358,81.8463)],

# Bihar
"Muzaffarpur":[("Motijheel",26.1209,85.3647),("Kalyani",26.1209,85.3647)],
"Gaya":[("Bodh Gaya Road",24.7914,85.0002),("Civil Lines",24.7914,85.0002)],
"Bhagalpur":[("Tilka Manjhi",25.2425,86.9842),("Adampur",25.2425,86.9842)],

# Rajasthan
"Jodhpur":[("Shastri Nagar",26.2389,73.0243),("Sardarpura",26.2389,73.0243)],
"Kota":[("Talwandi",25.2138,75.8648),("Mahaveer Nagar",25.2138,75.8648)],
"Udaipur":[("Hiran Magri",24.5854,73.7125),("Fatehpura",24.5854,73.7125)],
"Ajmer":[("Vaishali Nagar",26.4499,74.6399),("Civil Lines",26.4499,74.6399)],

# Punjab
"Jalandhar":[("Model Town",31.3260,75.5762),("Urban Estate",31.3260,75.5762)],
"Patiala":[("Rajpura Road",30.3398,76.3869),("Urban Estate",30.3398,76.3869)],
"Bathinda":[("Model Town",30.2070,74.9455),("Civil Lines",30.2070,74.9455)],

# Haryana
"Faridabad":[("Sector 15",28.4089,77.3178),("Sector 21",28.4089,77.3178)],
"Panipat":[("Model Town",29.3909,76.9635),("Huda Sector",29.3909,76.9635)],
"Karnal":[("Sector 13",29.6857,76.9905),("Model Town",29.6857,76.9905)],

# Odisha
"Cuttack":[("Buxi Bazaar",20.4625,85.8828),("Mangalabag",20.4625,85.8828)],
"Rourkela":[("Civil Township",22.2604,84.8536),("Uditnagar",22.2604,84.8536)],
"Sambalpur":[("Budharaja",21.4700,83.9700),("Ainthapali",21.4700,83.9700)],

# Chhattisgarh
"Raipur":[("Shankar Nagar",21.2514,81.6296),("Telibandha",21.2514,81.6296)],
"Bhilai":[("Nehru Nagar",21.1938,81.3509),("Supela",21.1938,81.3509)],
"Bilaspur":[("Vyapar Vihar",22.0796,82.1408),("Sarkanda",22.0796,82.1408)],

# Jharkhand
"Dhanbad":[("Bank More",23.7957,86.4304),("Saraidhela",23.7957,86.4304)],
"Bokaro":[("Sector 4",23.6693,86.1511),("Sector 9",23.6693,86.1511)],

# Uttarakhand
"Haridwar":[("Jwalapur",29.9457,78.1642),("Ranipur",29.9457,78.1642)],
"Rishikesh":[("Tapovan",30.0869,78.2676),("Lakshman Jhula",30.0869,78.2676)],

# Himachal Pradesh
"Shimla":[("Mall Road",31.1048,77.1734),("New Shimla",31.1048,77.1734)],
"Dharamshala":[("McLeod Ganj",32.2190,76.3234),("Kotwali Bazaar",32.2190,76.3234)]
}

titles=[
"Luxury Villa",
"Modern Apartment",
"Premium Penthouse",
"Elegant Family Home"
]


for i in range(1500):

    city=random.choice(list(cities.keys()))
    area,lat,lon=random.choice(cities[city])

    House.objects.create(
        title=random.choice(titles)+" in "+area,
        city=city,
        area=area,
        price=random.randint(4000000,30000000),
        bedrooms=random.randint(1,5),
        bathrooms=random.randint(1,4),
        square_feet=random.randint(600,4000),
        latitude=lat+random.uniform(-0.02,0.02),
        longitude=lon+random.uniform(-0.02,0.02)
    )

print("1500 houses generated successfully")
