import base64
import random
import google.generativeai as genai
from app.core.config import settings

genai.configure(api_key=settings.GEMINI_API_KEY)

def preprocess_image(image_base64: str) -> bytes:
    """Preprocess the base64 encoded image for AI recognition"""
    if "base64," in image_base64:
        image_base64 = image_base64.split("base64,")[1]
    return base64.b64decode(image_base64)

async def recognize_doodle(image_base64: str) -> dict:
    try:
        base64_image = preprocess_image(image_base64)
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content([
            "Identify the object in this doodle in a single word.",
            {
                "mime_type": "image/png",
                "data": base64_image
            }
        ])
        return {
            "result": response.text.split()[0].strip(".,!?").lower(),
            "confidence": round(random.uniform(0.6, 1.0), 2)  # Random accuracy between 60% and 100%
        }
    except Exception as e:
        raise Exception(f"Failed to recognize doodle: {str(e)}")
 