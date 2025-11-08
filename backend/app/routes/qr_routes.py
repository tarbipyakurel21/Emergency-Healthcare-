from fastapi import APIRouter

router = APIRouter(prefix="/qr", tags=["QR Codes"])

@router.get("/test")
async def test_qr():
    return {"message": "QR routes working"}
