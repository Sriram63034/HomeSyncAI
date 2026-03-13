# HomeSync AI Backend

This is the backend for HomeSync AI, an AI-powered real estate recommendation platform, built using Python, Django, and Django REST Framework.

## Features Built
1. User Authentication (JWT)
2. Houses listings with a custom radius-based search (Haversine formula).
3. Seven-step User Preference system.
4. House Recommendation Engine based on an advanced rule-based scoring algorithm.
5. Saved Houses tracking and Comparison system.
6. A management command to ingest Kaggle's Bengaluru House Price Data.

## Prerequisites
- Python 3.9+ 
- Virtualenv

## Setup Instructions

1. **Activate the virtual environment**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

2. **Install requirements**:
   ```bash
   pip install django djangorestframework djangorestframework-simplejwt django-cors-headers
   ```

3. **Apply Database Migrations**:
   ```bash
   python manage.py migrate
   ```

4. **Import Dataset**:
   Place the Kaggle dataset (`bengaluru_house_prices.csv`) in the base directory of the backend, or pass specifying standard path.
   ```bash
   python manage.py import_houses --file /path/to/dataset.csv
   ```
   (Alternatively, with it in the base directory: `python manage.py import_houses`)

5. **Run Development Server**:
   ```bash
   python manage.py runserver
   ```
   
## Available API Routes
- **Accounts:**
  - `POST /api/auth/signup/`
  - `POST /api/auth/login/`
  - `GET /api/auth/profile/`
- **Houses:**
  - `GET /api/houses/`
  - `GET /api/houses/radius_search/?latitude=X&longitude=Y&radius=Z`
  - `GET /api/houses/<id>/`
- **Preferences:**
  - `GET / POST / PUT /api/preferences/`
- **Recommendations:**
  - `GET /api/houses/recommendations/`
- **Saved Houses:**
  - `GET / POST /api/houses/saved/`
  - `POST / DELETE /api/houses/save/<id>/`
  - `POST /api/houses/compare/` (Provide JSON `{"house_ids": [1, 2, 3]}`)
  
## Architecture
- `accounts`: Manages Custom Users and Auth tokens.
- `core`: Base utilities and Pagination classes.
- `houses`: Core property data models/endpoints.
- `preferences`: User profiling.
- `recommendations`: Custom recommendation calculator integrating properties and preferences.
- `saved`: For shortlisting favorite properties.
