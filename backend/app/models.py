from sqlalchemy import Column, Integer, String, DateTime, JSON, Boolean, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    first_name = Column(String)
    last_name = Column(String)
    phone = Column(String)
    user_type = Column(String)  # 'patient' or 'responder'
    created_at = Column(DateTime, default=func.now())
    is_active = Column(Boolean, default=True)

class PatientProfile(Base):
    __tablename__ = "patient_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    
    # Medical Information
    blood_type = Column(String)  # 'A+', 'O-', etc.
    allergies = Column(JSON)  # List of allergies
    medical_conditions = Column(JSON)  # List of conditions
    current_medications = Column(JSON)  # List of medications
    emergency_contact_name = Column(String)
    emergency_contact_phone = Column(String)
    emergency_contact_relationship = Column(String)
    
    # Additional medical info
    date_of_birth = Column(String)
    height = Column(String)
    weight = Column(String)
    primary_physician = Column(String)
    physician_phone = Column(String)
    insurance_provider = Column(String)
    insurance_id = Column(String)
    
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

class EmergencyEvent(Base):
    __tablename__ = "emergency_events"
    
    id = Column(Integer, primary_key=True, index=True)
    emergency_id = Column(String, unique=True, index=True)  # EMG20241108123045ABC123
    patient_id = Column(Integer, ForeignKey('users.id'))
    qr_data = Column(Text)  # Encrypted QR data
    location_lat = Column(String)
    location_lng = Column(String)
    status = Column(String)  # 'active', 'resolved', 'cancelled'
    created_at = Column(DateTime, default=func.now())
    resolved_at = Column(DateTime)
    expires_at = Column(DateTime)