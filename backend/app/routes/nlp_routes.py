# backend/app/nlp_routes.py
from fastapi import APIRouter, Request
from app.services.nlp_service import get_first_aid_response
from app.services.nvidia_service import chat_with_nvidia 

router = APIRouter(prefix="/nlp", tags=["AI Chatbot"])

# In-memory session store for demo (replace with DB if needed)
CONVERSATIONS = {}


@router.post("/chat")
async def chat_endpoint(request: Request):
    """
    Main chat endpoint for the AI first-aid assistant.
    Accepts user messages and returns AI replies with short-term memory.
    """
    try:
        data = await request.json()
        user_id = data.get("user_id", "demo_user")
        message = data.get("message", "").strip()

        if not message:
            return {"error": "No message provided"}

        # Retrieve or initialize history
        history = CONVERSATIONS.get(user_id, [])

        # Generate AI response
        reply = get_first_aid_response(message, history)

        # Update conversation memory
        history.append({"role": "user", "content": message})
        history.append({"role": "assistant", "content": reply})
        CONVERSATIONS[user_id] = history

        return {"reply": reply, "history": history[-6:]}

    except Exception as e:
        return {"error": str(e)}


@router.post("/nvidia")
async def nvidia_chat_endpoint(request: Request):
    """
    Chat endpoint for NVIDIA Nemotron AI.
    Accepts user messages and returns AI replies.
    """
    try:
        data = await request.json()
        message = data.get("message", "").strip()

        if not message:
            return {"error": "No message provided"}

        reply = chat_with_nvidia(message)
        return {"reply": reply}

    except Exception as e:
        return {"error": str(e)}