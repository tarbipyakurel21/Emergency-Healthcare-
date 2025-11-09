import requests
import json

BASE_URL = "http://localhost:8000"

def test_qr_flow():
    # This is a test - in real app, you'd have proper authentication
    test_user_id = 1
    test_location = {
        "lat": 40.7128,
        "lng": -74.0060,
        "address": "New York, NY"
    }
    
    # Generate QR code
    response = requests.post(
        f"{BASE_URL}/qr/generate-emergency",
        params={"user_id": test_user_id},
        json=test_location
    )
    
    if response.status_code == 200:
        result = response.json()
        print("QR Code Generated Successfully!")
        print(f"Emergency ID: {result['emergency_id']}")
        print(f"Expires in: {result['expires_in']}")
        
        # The QR code image is in result['qr_code'] as base64
        # You can display this in your frontend
        
        return result
    else:
        print(f"Error: {response.text}")
        return None

if __name__ == "__main__":
    test_qr_flow()