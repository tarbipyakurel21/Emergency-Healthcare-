import segno
import json
import base64
from datetime import datetime, timedelta
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import secrets
import string
import io

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
    
    def create_emergency_qr_data(self, user_id, medical_data, location):
        emergency_id = self.generate_emergency_id()
        
        expiration_time = datetime.now() + timedelta(hours=2)
        
        payload = {
            "emergency_id": emergency_id,
            "user_id": user_id,
            "timestamp": datetime.now().isoformat(),
            "expires_at": expiration_time.isoformat(),
            "location": location,
            "medical_summary": medical_data
        }
        
        encrypted_payload = self.encrypt_data(payload)
        
        return {
            "emergency_id": emergency_id,
            "encrypted_data": encrypted_payload,
            "qr_data": f"EMERGENCY:{emergency_id}:{encrypted_payload}"
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

qr_service = QRCodeService()
