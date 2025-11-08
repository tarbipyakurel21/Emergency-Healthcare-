from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import base64

from services.qr_service import qr_service

app = FastAPI(
    title="Emergency Healthcare API",
    description="Secure QR-based emergency medical information system",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Emergency Healthcare API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "emergency-healthcare-api"}

@app.post("/demo/generate-qr")
async def demo_generate_qr():
    try:
        medical_data = {
            "blood_type": "O+",
            "allergies": ["Penicillin", "Peanuts"],
            "conditions": ["Asthma", "Hypertension"],
            "medications": ["Ventolin", "Lisinopril"],
            "emergency_contact": {
                "name": "Jane Smith",
                "phone": "+1-555-0123",
                "relationship": "Spouse"
            }
        }
        
        location = {
            "lat": 40.7128,
            "lng": -74.0060,
            "address": "New York, NY, USA"
        }
        
        qr_result = qr_service.create_emergency_qr_data(
            user_id=999,
            medical_data=medical_data,
            location=location
        )
        
        qr_image = qr_service.generate_qr_code_image(qr_result["qr_data"])
        qr_image_base64 = base64.b64encode(qr_image.getvalue()).decode()
        
        return {
            "success": True,
            "emergency_id": qr_result["emergency_id"],
            "qr_code_image": f"data:image/png;base64,{qr_image_base64}",
            "encrypted_data": qr_result["encrypted_data"],  # ADD THIS LINE
            "expires_in": "2 hours",
            "message": "Demo QR code generated successfully"
        }
        
    except Exception as e:
        return {"error": str(e)}

@app.post("/demo/scan-qr")
async def demo_scan_qr(encrypted_data: str):
    try:
        emergency_data = qr_service.validate_qr_code(encrypted_data)
        return {
            "success": True,
            "emergency_data": emergency_data,
            "message": "QR code scanned successfully"
        }
    except Exception as e:
        return {"error": str(e)}
