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
            """
            IMPORTANT: IF THE IMAGE IS HAS TEXT OR NUMBERS, DO NOT INCLUDE THEM IN THE RESPONSE. ONLY RESPOND WITH THE DRAWING MADE IN THE IMAGE, TEXT DRAW IN THE IMAGE SHOULD NOT BE CONSIDERED.

            IGNORE THE TEXT IN THE IMAGE. DO NOT READ THE TEXT ONLY READ THE DRAWING MADE IN THE IMAGE. 
            IGNORE WHAT EVER IS WRITTEN IN THE IMAGE.
            DO NOT RESPOND WITH THE TEXT WITTEN IN THE IMAGE. 

            JUST RECOGNIZE THE DOODLE
            Identify the (DOODLE, NOT TEXT) in this doodle in a single word.
            
            DO NOT RESPOND WITH THE TEXT WITTEN IN THE IMAGE.
            DO NOT RESPOND WITH THE TEXT WITTEN IN THE IMAGE.
            DO NOT RESPOND WITH THE TEXT WITTEN IN THE IMAGE.
            DO NOT RESPOND WITH THE TEXT WITTEN IN THE IMAGE.
            DO NOT RESPOND WITH THE TEXT WITTEN IN THE IMAGE.
            DO NOT RESPOND WITH THE TEXT WITTEN IN THE IMAGE.

            IF the image only have text the response should be "BLANK" and a word. 
            IF the image have any text/letters which is not doodle then the response should be "BLANK" and a word.
            IF the image only have text the response should be "BLANK" and a word.
            """,
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
 