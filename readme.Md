@'
# Emergency Healthcare App

A secure QR-based emergency medical information system.

## 🚀 Current Status (Feature Branch)

**✅ What Works:**
- Backend API running on port 8000
- QR code generation and encryption
- QR code scanning and decryption  
- Responder web app on port 3000
- Mobile-responsive design
- Demo endpoints for testing
- Camera QR scanning (on supported devices)

**🔧 What Needs Work:**
- Camera permissions on some mobile devices
- Network configuration for phone access
- Patient app interface
- User authentication system
- Database integration

## 🏃 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.8+
- Git

### Setup
```bash
# Clone and setup
git clone <your-repo>
git checkout feature/emergency-qr-system

# Backend
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Frontend (new terminal)
cd responder-web
npm install
npm start