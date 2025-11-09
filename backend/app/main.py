from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, qr_routes

app = FastAPI(title="Emergency Healthcare API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://10.25.19.50:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(auth.router)
app.include_router(qr_routes.router)

@app.get("/")
async def root():
    return {"message": "Emergency Healthcare API is running"}

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "emergency-healthcare"}

# Import and initialize QR service
from app.services.qr_service import qr_service
print("✅ QR service imported successfully!")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
