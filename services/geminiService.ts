import { GoogleGenAI, Type } from "@google/genai";
import { ExtractionResult } from "../components/ResultDisplay";

// FIX: Per coding guidelines, API_KEY is assumed to be available in process.env and used directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    rawText: {
      type: Type.STRING,
      description: "El texto completo extraído de la imagen, manteniendo el formato original tanto como sea posible."
    },
    extractedData: {
      type: Type.OBJECT,
      properties: {
        driversRegistered: { type: Type.STRING, description: "El valor numérico para 'drivers registered'. Si no se encuentra, devuelve 'N/A'." },
        driversApproved: { type: Type.STRING, description: "El valor numérico para 'drivers approved'. Si no se encuentra, devuelve 'N/A'." },
        driversWaitingForApproval: { type: Type.STRING, description: "El valor numérico para 'drivers waiting for approval'. Si no se encuentra, devuelve 'N/A'." },
        usersRegistered: { type: Type.STRING, description: "El valor numérico para 'users registered'. Si no se encuentra, devuelve 'N/A'." },
      }
    }
  }
};


export async function extractTextFromImage(base64ImageData: string, mimeType: string): Promise<ExtractionResult> {
  try {
    const imagePart = {
      inlineData: {
        data: base64ImageData,
        mimeType: mimeType,
      },
    };

    const textPart = {
      text: `Realiza un OCR en la imagen. Extrae todo el texto visible. Adicionalmente, identifica y extrae los valores para los siguientes campos: 'drivers registered', 'drivers approved', 'drivers waiting for approval' y 'users registered'. Responde únicamente con un objeto JSON que se ajuste al esquema proporcionado. Si un valor no se encuentra, usa 'N/A'.`,
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });
    
    // The response is a string, so we need to parse it into a JSON object.
    const jsonString = response.text;
    const parsedResult = JSON.parse(jsonString);

    // Basic validation to ensure the result matches the expected structure
    if (parsedResult && typeof parsedResult.rawText === 'string' && parsedResult.extractedData) {
      return parsedResult as ExtractionResult;
    } else {
      throw new Error("La respuesta de la API no tiene el formato esperado.");
    }

  } catch (error) {
    console.error("Error calling Gemini API or parsing response:", error);
    if (error instanceof SyntaxError) {
      throw new Error("No se pudo interpretar la respuesta del modelo. Intenta de nuevo.");
    }
    throw new Error("No se pudo comunicar con el servicio de IA. Por favor, inténtalo de nuevo más tarde.");
  }
}