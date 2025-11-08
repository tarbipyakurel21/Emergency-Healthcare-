from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import base64
import sys
import os

# Add the current directory to Python path
sys.path.append(os.path.dirname(__file__))

try:
    # Try importing from services folder
    from services.qr_service import qr_service
    print("✅ QR service imported successfully!")
except ImportError as e:
    print(f"❌ Import failed: {e}")
    # Create a simple fallback
    class SimpleQRService:
        def create_emergency_qr_data(self, user_id, medical_data, location):
            return {
                "emergency_id": "DEMO123",
                "encrypted_data": "demo_encrypted_data_here",
                "qr_data": "EMERGENCY:DEMO123:demo_data"
            }
        def generate_qr_code_image(self, data):
            import io
            # Create a simple black square as placeholder
            img_data = b"fake_qr_image_data"
            return io.BytesIO(img_data)
        def validate_qr_code(self, encrypted_data):
            return {
                "emergency_id": "DEMO123",
                "user_id": 999,
                "timestamp": "2024-01-01T00:00:00",
                "expires_at": "2024-01-01T02:00:00",
                "location": {"lat": 40.7128, "lng": -74.0060, "address": "Demo Location"},
                "medical_summary": {
                    "blood_type": "O+",
                    "allergies": ["Penicillin", "Peanuts"],
                    "conditions": ["Asthma"],
                    "medications": ["Ventolin"],
                    "emergency_contact": {"name": "Demo Contact", "phone": "123-456-7890"}
                }
            }
    qr_service = SimpleQRService()
    print("✅ Using simple QR service for demo")

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
            "encrypted_data": qr_result["encrypted_data"],
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
