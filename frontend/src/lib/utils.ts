import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { GoogleGenAI } from "@google/genai";

const VITE_GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: VITE_GEMINI_API_KEY });

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function generateHelpImages(word: string) {
  try {
    const contents = `Create a simple black and white doodle OUTLINE drawing of a ${word}. Make it over-simplified , minimal, easy to understand, and suitable for kids to draw with a pencil.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp-image-generation",
      contents: contents,
      config: {
        responseModalities: ["Text", "Image"],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data; // Return base64 string directly
      } else if (part.text) {
        console.log("Received text instead of image:", part.text);
        return null;
      }
    }
    
    console.log("No valid content found");
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
}