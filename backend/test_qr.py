import requests
import json
import sys

BASE_URL = "http://localhost:8001"

def test_qr_flow():
    print("Testing QR Code Generation...")
    
    try:
        # Test the demo endpoint
        response = requests.post(f"{BASE_URL}/demo/generate-qr")
        
        if response.status_code == 200:
            result = response.json()
            if "success" in result and result["success"]:
                print("✅ QR Code Generated Successfully!")
                print(f"Emergency ID: {result['emergency_id']}")
                print(f"Expires in: {result['expires_in']}")
                
                # Test scanning the QR code
                encrypted_data = result.get('encrypted_data')
                if encrypted_data:
                    print(f"\nTesting QR Code Scanning...")
                    
                    scan_response = requests.post(
                        f"{BASE_URL}/demo/scan-qr",
                        params={"encrypted_data": encrypted_data}
                    )
                    
                    if scan_response.status_code == 200:
                        scan_result = scan_response.json()
                        if "success" in scan_result and scan_result["success"]:
                            print("✅ QR Code Scanned Successfully!")
                            print(f"Medical Data: {json.dumps(scan_result['emergency_data'], indent=2)}")
                        else:
                            print(f"❌ Scan failed: {scan_result.get('error', 'Unknown error')}")
                    else:
                        print(f"❌ Scan request failed: {scan_response.text}")
                else:
                    print("❌ No encrypted_data in response")
                    
                return result
            else:
                print(f"❌ Generation failed: {result.get('error', 'Unknown error')}")
        else:
            print(f"❌ HTTP Error: {response.status_code} - {response.text}")
            return None
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to server. Make sure the server is running on http://localhost:8001")
        return None
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return None

if __name__ == "__main__":
    test_qr_flow()
