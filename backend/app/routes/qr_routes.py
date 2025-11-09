from fastapi import APIRouter, Depends, HTTPException
import base64
from pydantic import BaseModel
from app.services.qr_service import qr_service

router = APIRouter(prefix="/qr", tags=["qr-codes"])

class EmergencyRequest(BaseModel):
    user_id: int
    location: dict

class QRScanRequest(BaseModel):
    encrypted_data: str

@router.post("/generate-emergency")
async def generate_emergency_qr(request: EmergencyRequest):
    try:
        # For now, use demo medical data - you can connect to database later
        medical_data = {
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
        
        qr_data = qr_service.create_emergency_qr_data(
            user_id=request.user_id,
            medical_data=medical_data,
            location=request.location
        )
        
        # Generate QR image
        qr_image = qr_service.generate_qr_code_image(qr_data["qr_data"])
        qr_base64 = base64.b64encode(qr_image.getvalue()).decode()
        
        return {
            "success": True,
            "emergency_id": qr_data["emergency_id"],
            "qr_code": f"data:image/png;base64,{qr_base64}",
            "expires_at": qr_data.get("expires_at", "")
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/scan")
async def scan_qr_code(request: QRScanRequest):
    try:
        # Extract encrypted data from QR string if needed
        if request.encrypted_data.startswith("EMERGENCY:"):
            parts = request.encrypted_data.split(":")
            if len(parts) >= 3:
                encrypted_data = parts[2]
            else:
                raise HTTPException(status_code=400, detail="Invalid QR format")
        else:
            encrypted_data = request.encrypted_data
        
        # Validate and decrypt
        payload = qr_service.validate_qr_code(encrypted_data)
        
        return {
            "success": True,
            "emergency_data": payload,
            "message": "QR code scanned successfully"
        }
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scan failed: {str(e)}")
