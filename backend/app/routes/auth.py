from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import jwt
from datetime import datetime

router = APIRouter(prefix="/auth", tags=["authentication"])

SECRET_KEY = "emergency-healthcare-secret-key-2024"

class UserLogin(BaseModel):
    email: str
    password: str

class UserRegister(BaseModel):
    email: str
    password: str
    first_name: str
    last_name: str
    phone: str
    user_type: str

# Simple in-memory user storage (replace with database later)
users_db = {
    "demo@patient.com": {
        "id": 1,
        "email": "demo@patient.com",
        "password": "demo123",
        "first_name": "Alex",
        "last_name": "Patient",
        "phone": "+1-555-0101",
        "user_type": "patient",
        "medical_info": {
            "blood_type": "O+",
            "allergies": ["Penicillin", "Peanuts"],
            "conditions": ["Asthma"],
            "medications": ["Ventolin"],
            "emergency_contact": {
                "name": "Sarah Wilson",
                "phone": "+1-555-0123",
                "relationship": "Spouse"
            }
        }
    },
    "demo@responder.com": {
        "id": 2,
        "email": "demo@responder.com",
        "password": "demo123",
        "first_name": "Sarah",
        "last_name": "Responder",
        "phone": "+1-555-0102",
        "user_type": "responder",
        "badge_number": "RES123",
        "organization": "City Emergency Services"
    }
}

def create_access_token(data: dict):
    return jwt.encode(data, SECRET_KEY, algorithm="HS256")

@router.post("/login")
async def login(login_data: UserLogin):
    user = users_db.get(login_data.email)
    
    if not user or user["password"] != login_data.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token({
        "sub": user["email"],
        "user_id": user["id"],
        "user_type": user["user_type"]
    })
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user["id"],
        "user_type": user["user_type"],
        "first_name": user["first_name"],
        "last_name": user["last_name"],
        "email": user["email"]
    }

@router.post("/register")
async def register(user_data: UserRegister):
    if user_data.email in users_db:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    new_user_id = max([user["id"] for user in users_db.values()]) + 1
    users_db[user_data.email] = {
        "id": new_user_id,
        "email": user_data.email,
        "password": user_data.password,
        "first_name": user_data.first_name,
        "last_name": user_data.last_name,
        "phone": user_data.phone,
        "user_type": user_data.user_type,
        "medical_info": {
            "blood_type": "",
            "allergies": [],
            "conditions": [],
            "medications": [],
            "emergency_contact": {
                "name": "",
                "phone": "",
                "relationship": ""
            }
        }
    }
    
    access_token = create_access_token({
        "sub": user_data.email,
        "user_id": new_user_id,
        "user_type": user_data.user_type
    })
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": new_user_id,
        "user_type": user_data.user_type,
        "first_name": user_data.first_name,
        "last_name": user_data.last_name,
        "email": user_data.email
    }

@router.get("/health")
async def health_check():
    return {"status": "ok", "message": "Auth service is running"}
