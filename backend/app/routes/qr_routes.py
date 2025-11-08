from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import Response
from sqlalchemy.orm import Session
from typing import Dict, Any
import base64

from ..services.qr_service import qr_service
from ..models import EmergencyEvent, PatientProfile, User
from ..database import get_db

router = APIRouter(prefix="/qr", tags=["QR Codes"])

@router.post("/generate-emergency")
async def generate_emergency_qr(
    user_id: int,
    location: Dict[str, Any],
    db: Session = Depends(get_db)
):
    """Generate emergency QR code for a user"""
    try:
        # Get user's medical data
        patient_profile = db.query(PatientProfile).filter(PatientProfile.user_id == user_id).first()
        if not patient_profile:
            raise HTTPException(status_code=404, detail="Patient profile not found")
        
        # Prepare medical data
        medical_data = {
            "blood_type": patient_profile.blood_type,
            "allergies": patient_profile.allergies or [],
            "conditions": patient_profile.medical_conditions or [],
            "medications": patient_profile.current_medications or [],
            "emergency_contact": patient_profile.emergency_contact or {}
        }
        
        # Generate QR code data
        qr_result = qr_service.create_emergency_qr_data(
            user_id=user_id,
            medical_data=medical_data,
            location=location
        )
        
        # Generate QR code image
        qr_image = qr_service.generate_qr_code_image(qr_result["qr_data"])
        
        # Save emergency event to database
        emergency_event = EmergencyEvent(
            emergency_id=qr_result["emergency_id"],
            user_id=user_id,
            status="active",
            location=location,
            qr_data=qr_result["encrypted_data"],
            accessed_by=[]
        )
        db.add(emergency_event)
        db.commit()
        
        # Return QR code as image
        qr_image_base64 = base64.b64encode(qr_image.getvalue()).decode()
        
        return {
            "success": True,
            "emergency_id": qr_result["emergency_id"],
            "qr_code": f"data:image/png;base64,{qr_image_base64}",
            "expires_in": "2 hours",
            "message": "Emergency QR code generated successfully"
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error generating QR code: {str(e)}")


@router.post("/scan")
async def scan_qr_code(
    request: dict,  # Changed from individual parameters to request dict
    db: Session = Depends(get_db)
):
    """Scan and decrypt QR code for web responders"""
    try:
        encrypted_data = request.get("encrypted_data")
        responder_id = request.get("responder_id")
        
        if not encrypted_data:
            raise HTTPException(status_code=400, detail="No QR data provided")
        
        # Validate and decrypt QR data
        emergency_data = qr_service.validate_qr_code(encrypted_data)
        
        # Check if emergency is still active
        emergency_event = db.query(EmergencyEvent).filter(
            EmergencyEvent.emergency_id == emergency_data["emergency_id"]
        ).first()
        
        if not emergency_event or emergency_event.status != "active":
            raise HTTPException(status_code=410, detail="Emergency no longer active")
        
        # Log responder access
        if responder_id not in emergency_event.accessed_by:
            if emergency_event.accessed_by is None:
                emergency_event.accessed_by = []
            emergency_event.accessed_by.append(responder_id)
            db.commit()
        
        return {
            "success": True,
            "emergency_data": emergency_data,
            "message": "QR code scanned successfully"
        }
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error scanning QR code: {str(e)}")

@router.get("/emergency/{emergency_id}")
async def get_emergency_status(emergency_id: str, db: Session = Depends(get_db)):
    """Get status of an emergency event"""
    emergency_event = db.query(EmergencyEvent).filter(
        EmergencyEvent.emergency_id == emergency_id
    ).first()
    
    if not emergency_event:
        raise HTTPException(status_code=404, detail="Emergency not found")
    
    return {
        "emergency_id": emergency_event.emergency_id,
        "status": emergency_event.status,
        "triggered_at": emergency_event.triggered_at,
        "accessed_by": emergency_event.accessed_by,
        "location": emergency_event.location
    }

@router.post("/emergency/{emergency_id}/resolve")
async def resolve_emergency(emergency_id: str, db: Session = Depends(get_db)):
    """Mark emergency as resolved"""
    emergency_event = db.query(EmergencyEvent).filter(
        EmergencyEvent.emergency_id == emergency_id
    ).first()
    
    if not emergency_event:
        raise HTTPException(status_code=404, detail="Emergency not found")
    
    emergency_event.status = "resolved"
    db.commit()
    
    return {"success": True, "message": "Emergency resolved successfully"}