from sqlalchemy import Column, Integer, String, DateTime, Boolean, JSON, Text
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    user_type = Column(String)  # "patient" or "responder"
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class PatientProfile(Base):
    __tablename__ = "patient_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    full_name = Column(String)
    date_of_birth = Column(String)
    blood_type = Column(String)
    allergies = Column(JSON)  # List of allergies
    medical_conditions = Column(JSON)  # List of conditions
    current_medications = Column(JSON)  # List of medications
    emergency_contact = Column(JSON)  # {name: "", phone: "", relationship: ""}
    additional_notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class ResponderProfile(Base):
    __tablename__ = "responder_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    full_name = Column(String)
    badge_number = Column(String)
    organization = Column(String)
    department = Column(String)
    verification_status = Column(String)  # "pending", "verified", "rejected"
    license_number = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class EmergencyEvent(Base):
    __tablename__ = "emergency_events"
    
    id = Column(Integer, primary_key=True, index=True)
    emergency_id = Column(String, unique=True, index=True)
    user_id = Column(Integer, index=True)
    status = Column(String)  # "active", "resolved", "cancelled"
    location = Column(JSON)  # {lat: xx, lng: xx, address: ""}
    triggered_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)
    qr_data = Column(Text)  # Encrypted QR data
    accessed_by = Column(JSON)  # List of responder IDs who accessed