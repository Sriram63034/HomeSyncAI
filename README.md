# 🏠 HomeSyncAI  
### AI-Powered Real Estate Recommendation Platform

HomeSyncAI is a modern web-based platform designed to simplify the house-hunting experience by leveraging intelligent filtering and scalable architecture. It enables users to discover properties based on personalized preferences such as location, budget, and features.

---

## 📌 Overview

Finding the right home is often time-consuming and inefficient due to scattered listings and manual filtering. HomeSyncAI addresses this by providing a centralized platform that delivers fast, relevant, and user-centric property recommendations.

---

## ✨ Core Features

- 🔍 **Advanced Property Search**  
  Search properties using location and customizable preferences  

- 🎯 **Smart Filtering System**  
  Efficient filtering based on price, features, and availability  

- 🏘️ **Dynamic Property Listings**  
  Clean UI displaying relevant house recommendations  

- 📞 **Agent Interaction**  
  Connect directly with real estate agents  

- 📅 **Visit Scheduling**  
  Schedule property visits seamlessly  

---

## 🧠 Future Enhancements

- 🤖 **AI Real Estate Assistant**  
  Natural language chatbot for instant property discovery  

- 🏡 **3D Virtual Property Tour**  
  Immersive virtual walkthroughs before physical visits  

- 🛒 **Property Marketplace**  
  Platform for direct buying and selling by users  

- 📊 **AI-Based Recommendation Engine**  
  Personalized suggestions using Machine Learning  

---

## 🏗️ System Architecture

The application follows a **client-server architecture**:
Frontend (React + TypeScript)
↓
REST API (Django Backend)
↓
Database (SQLite)


- **Frontend** handles UI and user interactions  
- **Backend** processes logic and API requests  
- **Database** stores structured property data  

---

## ⚙️ Tech Stack

### 🖥️ Frontend
- React.js  
- TypeScript  
- Vite  

### 🧠 Backend
- Django (Python)  
- Django REST Framework  

### 🗄️ Database
- SQLite  

---

## 🔄 Application Workflow

1. User inputs location and preferences  
2. Frontend sends API request to backend  
3. Backend processes request and applies filtering logic  
4. Database returns matching property data  
5. Serializer converts data into JSON  
6. Frontend displays results dynamically  

---

## 📂 Project Structure
HomeSyncAI/

│

├── frontend/ # React + TypeScript application

│ ├── components/

│ ├── pages/

│ └── services/

│

├── backend/ # Django backend

│ ├── models/ # Database schema

│ ├── views/ # API endpoints

│ ├── serializers/ # Data transformation

│ ├── urls/ # Routing

│

└── db.sqlite3 # Database file

## Running backend
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver


## Running Frontend
cd frontend
npm install
npm run dev


🔐 Authentication 

JWT-based authentication for secure user sessions

Token-based API access control

🌍 Real-World Impact

Reduces time spent searching for properties

Improves decision-making with filtered results

🚀 Future Scope

HomeSyncAI can evolve into a full-scale real estate ecosystem by integrating:

Machine Learning models

Predictive analytics

Personalized recommendation systems


👨‍💻 Author

Devana Sriram
B.Tech CSE (AI & ML)
Parul University
