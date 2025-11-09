from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import jwt
import json
import base64
from datetime import datetime, timedelta
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import secrets
import string
import io
import segno

app = FastAPI(title="Emergency Healthcare API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://10.25.19.50:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET_KEY = "emergency-healthcare-secret-key-2024"

# Simple in-memory user storage
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

class EmergencyRequest(BaseModel):
    user_id: int
    location: dict

class QRScanRequest(BaseModel):
    encrypted_data: str

def create_access_token(data: dict):
    return jwt.encode(data, SECRET_KEY, algorithm="HS256")

class QRCodeService:
    def __init__(self):
        self.secret_key = self._generate_secure_key()
        self.fernet = Fernet(self.secret_key)
    
    def _generate_secure_key(self):
        password = "emergency_healthcare_secret_key_2024".encode()
        salt = b"emergency_salt_1234"
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=100000,
        )
        key = base64.urlsafe_b64encode(kdf.derive(password))
        return key
    
    def generate_emergency_id(self):
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        random_chars = ''.join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(6))
        return f"EMG{timestamp}{random_chars}"
    
    def encrypt_data(self, data):
        if isinstance(data, dict):
            data = json.dumps(data)
        encrypted_data = self.fernet.encrypt(data.encode())
        return base64.urlsafe_b64encode(encrypted_data).decode()
    
    def decrypt_data(self, encrypted_data):
        try:
            encrypted_data = base64.urlsafe_b64decode(encrypted_data.encode())
            decrypted_data = self.fernet.decrypt(encrypted_data)
            return json.loads(decrypted_data.decode())
        except Exception as e:
            raise ValueError("Invalid or expired QR code")
    
    def create_emergency_qr_data(self, user_data, location):
        emergency_id = self.generate_emergency_id()
        
        expiration_time = datetime.now() + timedelta(hours=2)
        
        payload = {
            "emergency_id": emergency_id,
            "user_id": user_data.get("id", 1),
            "timestamp": datetime.now().isoformat(),
            "expires_at": expiration_time.isoformat(),
            "location": location,
            "medical_summary": user_data.get("medical_info", {})
        }
        
        encrypted_payload = self.encrypt_data(payload)
        
        return {
            "emergency_id": emergency_id,
            "encrypted_data": encrypted_payload,
            "qr_data": f"EMERGENCY:{emergency_id}:{encrypted_payload}",
            "expires_at": expiration_time.isoformat()
        }
    
    def generate_qr_code_image(self, qr_data):
        qr = segno.make(qr_data)
        buffer = io.BytesIO()
        qr.save(buffer, kind='png', scale=5)
        buffer.seek(0)
        return buffer
    
    def validate_qr_code(self, encrypted_data):
        try:
            payload = self.decrypt_data(encrypted_data)
            expires_at = datetime.fromisoformat(payload["expires_at"])
            if datetime.now() > expires_at:
                raise ValueError("QR code has expired")
            return payload
        except Exception as e:
            raise ValueError(f"Invalid QR code: {str(e)}")

# Create QR service instance
qr_service = QRCodeService()

@app.post("/auth/login")
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

@app.post("/auth/register")
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

@app.get("/")
async def root():
    return {"message": "Emergency Healthcare API is running"}

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "emergency-healthcare"}

@app.get("/auth/health")
async def auth_health():
    return {"status": "ok", "message": "Auth service is running"}

@app.post("/qr/generate-emergency")
async def generate_emergency_qr(request: EmergencyRequest):
    try:
        # Find user in our simple database
        user = None
        for user_data in users_db.values():
            if user_data["id"] == request.user_id:
                user = user_data
                break
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Generate QR with user data
        qr_data = qr_service.create_emergency_qr_data(user, request.location)
        
        # Generate QR image
        qr_image = qr_service.generate_qr_code_image(qr_data["qr_data"])
        qr_base64 = base64.b64encode(qr_image.getvalue()).decode()
        
        return {
            "success": True,
            "emergency_id": qr_data["emergency_id"],
            "qr_code": f"data:image/png;base64,{qr_base64}",
            "expires_at": qr_data["expires_at"]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/qr/scan")
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
