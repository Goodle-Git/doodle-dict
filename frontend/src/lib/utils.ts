import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { GoogleGenAI } from "@google/genai";

const VITE_GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: VITE_GEMINI_API_KEY });

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function generateGeminiImage(word: string) {
  try {
    const contents = `Create a simple black and white doodle OUTLINE drawing of a ${word}. Make it over-simplified, minimal, easy to understand, and suitable for kids to draw with a pencil. DO NOT SEND RESPOND WITH ANY TEXT ONLY IMAGE`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp-image-generation",
      contents: contents,
      config: {
        responseModalities: ["Text", "Image"],
      },
    });
    console.log(response)

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      } else {
        console.log("Received text instead of image:", part.text);
        return null;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
}

export async function generateStableDiffusionImage(word: string) {
  try {
    const sdUrl = localStorage.getItem('stableDiffusionUrl') || 'https://8374-34-139-188-243.ngrok-free.app/generate';
    
    const response = await fetch(sdUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ 
        prompt: `Doodle outline drawing of ${word}, black and white, minimal, line drawing, simple, easy to understand and draw with a pencil for a kid.` 
      })
    });
    
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to generate images');
    }

    if (!data.images || !data.images.length) {
      throw new Error('No images received from server');
    }

    return data.images[0]; // Return just the first image
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
}

export async function generateHelpImages(word: string, useGemini: boolean) {
  return useGemini ? generateGeminiImage(word) : generateStableDiffusionImage(word);
}