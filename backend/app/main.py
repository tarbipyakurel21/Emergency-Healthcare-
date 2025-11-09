from fastapi import FastAPI,Request
from fastapi.middleware.cors import CORSMiddleware
<<<<<<< HEAD
import base64
import sys
import os
from app.routes.qr_routes import router as qr_router
from app.routes.nlp_routes import router as nlp_router
from app.services.nvidia_service import chat_with_nvidia


# Add current directory to Python path
sys.path.append(os.path.dirname(__file__
                                ))

# ✅ Import routes
\
try:
    # Try importing the QR service
    from services.qr_service import qr_service
    print("✅ QR service imported successfully!")
except ImportError as e:
    print(f"❌ Import failed: {e}")

    # Simple fallback for demo
    class SimpleQRService:
        def create_emergency_qr_data(self, user_id, medical_data, location):
            return {
                "emergency_id": "DEMO123",
                "encrypted_data": "demo_encrypted_data_here",
                "qr_data": "EMERGENCY:DEMO123:demo_data",
            }

        def generate_qr_code_image(self, data):
            import io
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
                    "emergency_contact": {"name": "Demo Contact", "phone": "123-456-7890"},
                },
            }

    qr_service = SimpleQRService()
    print("✅ Using simple QR service for demo")

# ------------------------------------
# APP INITIALIZATION
# ------------------------------------
app = FastAPI(
    title="Emergency Healthcare API",
    description="Secure QR-based emergency medical information system",
    version="1.0.0",
)

# Enable CORS
=======
from app.routes import auth, qr_routes

app = FastAPI(title="Emergency Healthcare API", version="1.0.0")

# Add CORS middleware
>>>>>>> b6b86b137e9229e2b34f75e3b7e8e7ddd0587350
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://10.25.19.50:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

<<<<<<< HEAD
# ------------------------------------
# ROUTE REGISTRATION
# ------------------------------------
app.include_router(qr_router)
app.include_router(nlp_router)

# ------------------------------------
# BASE ROUTES
# ------------------------------------
=======
# Include routes
app.include_router(auth.router)
app.include_router(qr_routes.router)

>>>>>>> b6b86b137e9229e2b34f75e3b7e8e7ddd0587350
@app.get("/")
async def root():
    return {"message": "Emergency Healthcare API is running"}

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "emergency-healthcare"}

<<<<<<< HEAD
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
                "relationship": "Spouse",
            },
        }

        location = {
            "lat": 40.7128,
            "lng": -74.0060,
            "address": "New York, NY, USA",
        }

        qr_result = qr_service.create_emergency_qr_data(
            user_id=999, medical_data=medical_data, location=location
        )

        qr_image = qr_service.generate_qr_code_image(qr_result["qr_data"])
        qr_image_base64 = base64.b64encode(qr_image.getvalue()).decode()

        return {
            "success": True,
            "emergency_id": qr_result["emergency_id"],
            "qr_code_image": f"data:image/png;base64,{qr_image_base64}",
            "encrypted_data": qr_result["encrypted_data"],
            "expires_in": "2 hours",
            "message": "Demo QR code generated successfully",
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
            "message": "QR code scanned successfully",
        }
    except Exception as e:
        return {"error": str(e)}
    
@app.post("/nlp/nvidia")
async def chat_nvidia(request: Request):
    data = await request.json()
    msg = data.get("message")
    media_files = data.get("media_files", [])
    try:
        reply = chat_with_nvidia(msg, media_files)
        return {"response": reply}
    except Exception as e:
        return {"error": str(e)}
=======
# Import and initialize QR service
from app.services.qr_service import qr_service
print("✅ QR service imported successfully!")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
>>>>>>> b6b86b137e9229e2b34f75e3b7e8e7ddd0587350
