# backend/app/nlp_service.py
import os
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


# System-level instruction for AI personality and safety
SYSTEM_PROMPT = (
    "You are MedSense AI — a calm, compassionate, medically informed virtual assistant. "
    "Your job is to help users manage minor health incidents and understand emergency procedures. "
    "You must stay strictly within safe first-aid guidance. "
    "NEVER give prescriptions, diagnoses, or medication dosages. "
    "If the user's situation sounds severe or life-threatening, advise them to call emergency services. "
    "Use friendly, human-like language. "
    "Always end each reply with this disclaimer:\n"
    "'⚠️ This information is for general first-aid and education only. "
    "Seek professional medical care if symptoms worsen or persist.'"
)


def get_first_aid_response(message: str, history: list = None) -> str:
    """
    Generates a natural-language chatbot response that maintains short-term
    memory for context.
    """
    try:
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]

        # keep up to 5 previous turns for contextual replies
        if history:
            messages.extend(history[-5:])

        messages.append({"role": "user", "content": message})

        # ✅ new client method
        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            temperature=0.6,
            max_tokens=600,
        )

        return completion.choices[0].message.content

    except Exception as e:
        return f"⚠️ Error generating AI response: {e}"