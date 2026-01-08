import { GoogleGenAI } from "@google/genai";
import { BrandGuidelines } from "../types";

/**
 * Generates an image based on fixed brand guidelines and a user prompt.
 * prioritizes provided apiKey (manual), fallback to system-provided process.env.API_KEY.
 */
export const generateBrandIllustration = async (
  prompt: string,
  guidelines: BrandGuidelines,
  userProvidedReferences: string[] = [],
  apiKey: string
): Promise<string> => {
  // Use provided key if available, otherwise use injected process.env.API_KEY
  const effectiveKey = apiKey || process.env.API_KEY;

  if (!effectiveKey) {
    throw new Error("API Key is missing. Please configure it in Settings.");
  }

  // Create instance right before call as per best practices
  const ai = new GoogleGenAI({ apiKey: effectiveKey });

  try {
    const allReferences = [...guidelines.referenceAssets, ...userProvidedReferences];
    const parts: any[] = [];

    allReferences.forEach((base64String) => {
      const matches = base64String.match(/^data:(.+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        parts.push({
          inlineData: {
            mimeType: matches[1],
            data: matches[2]
          }
        });
      }
    });

    let fullPrompt = `
      [SYSTEM DIRECTIVE: VISION ANALYSIS & STYLE REPLICATION]
      You are a specialized vision-to-illustration engine for the Worxphere brand. 
      
      STEP 1: ANALYZE STYLE
      Attached are official brand assets. 
      Replicate this exact style:
      - Line: Thick, rough pencil sketch strokes. High texture.
      - Contrast: Spectrum Black (#182432) against pure white background.
      - Detail: Minimal shading, focus on character expression and symbolic objects.

      STEP 2: GENERATE NEW ASSET
      Generate a NEW brand illustration for: "${prompt}".

      BRAND CONSTRAINTS:
      - Palette: Monochromatic Spectrum Black (#182432) on White (#FFFFFF).
      - Style: ${guidelines.artStyle}.
      - Mood: ${guidelines.mood}.
      - Do: Use simple geometric shapes, centered composition.
      - Avoid: Colors, realistic textures, drop shadows, gradients.

      The final image MUST look like a scanned pencil drawing from the provided set.
    `.trim();

    parts.push({ text: fullPrompt });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: parts,
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64EncodeString = part.inlineData.data;
        const mimeType = part.inlineData.mimeType || 'image/png';
        return `data:${mimeType};base64,${base64EncodeString}`;
      }
    }

    throw new Error("Generation failed - No image part in response.");
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    if (error.message?.includes("Requested entity was not found")) {
      throw new Error("The selected API key is invalid or has expired. Please re-select it in Settings.");
    }
    throw error;
  }
};