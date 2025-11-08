from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any

from ..database import get_db
from ..models import User, PatientProfile, ResponderProfile

router = APIRouter()

# Import other routes
from .qr_routes import router as qr_router
from .nlp_routes import router as nlp_router

# Include all routers
router.include_router(qr_router)
router.include_router(nlp_router)

@router.get("/")
async def root():
    return {"message": "Emergency Healthcare API", "status": "active"}

@router.get("/user/{user_id}/profile")
async def get_user_profile(user_id: int, db: Session = Depends(get_db)):
    """Get user profile with medical information"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.user_type == "patient":
        profile = db.query(PatientProfile).filter(PatientProfile.user_id == user_id).first()
    else:
        profile = db.query(ResponderProfile).filter(ResponderProfile.user_id == user_id).first()
    
    return {
        "user": {
            "id": user.id,
            "email": user.email,
            "user_type": user.user_type
        },
        "profile": profile
    }