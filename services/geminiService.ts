import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Preferences, Property } from '../types';

const getAiClient = () => {
    const apiKey = import.meta.env.VITE_API_KEY;
    if (!apiKey) {
        // This error is now more user-friendly and guides them for Vercel deployment.
        throw new Error("A chave de API do Gemini não está configurada. Adicione VITE_API_KEY às suas variáveis de ambiente no Vercel e faça o redeploy.");
    }
    return new GoogleGenAI({ apiKey });
};

const generatePropertyListingsPrompt = (preferences: Preferences): string => {
  const allPriorities = [...preferences.priorities, preferences.otherPriorities].filter(Boolean).join(', ');
  const allExtras = [...preferences.extras, preferences.otherExtras].filter(Boolean).join(', ');
  const fullPropertyType = [preferences.propertyType, preferences.otherPropertyType].filter(Boolean).join(' / ');

  return `
  As an expert real estate agent and creative copywriter, generate a list of 3 fictional but realistic high-end properties in Brazil that match the following user preferences. The user's name is ${preferences.name}.

  User Preferences:
  - Intention: ${preferences.intention}
  - Property Type: ${fullPropertyType}
  - Budget: ${preferences.budget.min.toLocaleString('pt-BR')} to ${preferences.budget.max.toLocaleString('pt-BR')} BRL
  - Location: Prefers areas like ${preferences.location}, with a vibe that is ${allPriorities}.
  - Home Essentials: ${preferences.bedrooms} bedrooms, ${preferences.bathrooms} bathrooms, and must have: ${allExtras}.

  For each property, provide a JSON object with the following structure:
  {
    "id": "a unique identifier using a UUID format",
    "title": "A creative and appealing headline for the property, in Portuguese.",
    "address": "A realistic-sounding fictional address in Brazil, in Portuguese.",
    "price": "A realistic integer price within the user's budget.",
    "bedrooms": "Number of bedrooms.",
    "bathrooms": "Number of bathrooms.",
    "sqft": "A realistic integer for square meters (m²), appropriate for the property size.",
    "description": "A compelling and evocative property description of 2-3 sentences, in Portuguese. This should contain enough detail to generate a representative image.",
    "imagePrompt": "A detailed English prompt (15-20 words) for an image generation AI, describing key visual elements of the property to generate multiple images (exterior, interior, lifestyle). Example: 'A modern Brazilian villa, minimalist facade with natural wood accents, spacious open-concept living room with a view, infinity pool overlooking the ocean.'",
    "personalizedPitch": "A short, friendly paragraph written directly to ${preferences.name}, explaining why this specific house is a perfect fit for their priorities and desired features. Address them by name. Write this in Portuguese."
  }

  Return ONLY a valid JSON array of these objects, with no other text or explanation.
`;
};

const generateNeighborhoodVibePrompt = (property: Omit<Property, 'imageUrls' | 'neighborhoodVibe'>, preferences: Preferences): string => {
  const allPriorities = [...preferences.priorities, preferences.otherPriorities].filter(Boolean).join(', ');
  return `
  As a local expert and travel writer, describe the neighborhood vibe for ${preferences.name} for the property at ${property.address}.
  Focus on aspects that align with their priorities: "${allPriorities}".
  Mention 1-2 specific (but fictional) points of interest like cafes, parks, or markets that they would enjoy.
  The tone should be enthusiastic and welcoming. Write a single paragraph of 3-4 sentences in Portuguese.
  Do not use markdown or JSON. Return only the text.
`;
};


export const generatePropertyImages = async (imagePrompt: string): Promise<string[]> => {
    try {
        const ai = getAiClient();
        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: `Professional, photorealistic real estate photography of: ${imagePrompt}. Generate multiple varied views including exterior, interior (living room), and a key feature (like a backyard or balcony).`,
            config: { numberOfImages: 3, outputMimeType: 'image/jpeg' },
        });

        const imageUrls = response.generatedImages.map(img => `data:image/jpeg;base64,${img.image.imageBytes}`);
        
        if (imageUrls.length === 0) throw new Error("No images generated");

        return imageUrls;
    } catch (error) {
        console.error("Error generating property images, using placeholders", error);
        if (error instanceof Error && error.message.includes("API")) throw error;
        // Return placeholders if generation fails for other reasons
        return [
            `https://picsum.photos/800/600?random=${Math.floor(Math.random() * 1000)}`,
            `https://picsum.photos/800/600?random=${Math.floor(Math.random() * 1001)}`,
            `https://picsum.photos/800/600?random=${Math.floor(Math.random() * 1002)}`,
        ];
    }
};

const generateNeighborhoodVibe = async (property: Omit<Property, 'imageUrls' | 'neighborhoodVibe'>, preferences: Preferences): Promise<string> => {
    const prompt = generateNeighborhoodVibePrompt(property, preferences);
    try {
        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-preview-04-17',
            contents: prompt,
            config: { temperature: 0.75 }
        });
        return response.text;
    } catch (error) {
        console.error("Error generating neighborhood vibe:", error);
         if (error instanceof Error && error.message.includes("API")) throw error;
        return "Não foi possível carregar a descrição do bairro, mas temos certeza que você vai adorar a área!";
    }
};

const parseAndValidateProperties = (jsonStr: string): Omit<Property, 'imageUrls' | 'neighborhoodVibe'>[] => {
    const parsed = JSON.parse(jsonStr) as (Omit<Property, 'imageUrls' | 'neighborhoodVibe'> | null)[];
    if (!Array.isArray(parsed)) {
      throw new Error("API did not return a JSON array.");
    }
    // CRASH FIX: Filter out any null or incomplete items from the API response.
    const validated = parsed.filter((p): p is Omit<Property, 'imageUrls' | 'neighborhoodVibe'> => 
      p !== null && typeof p === 'object' && 'id' in p && 'title' in p && 'imagePrompt' in p
    );
    return validated;
}

export const generatePropertyListings = async (preferences: Preferences, setLoadingMessage: (msg: string) => void): Promise<Property[]> => {
  const prompt = generatePropertyListingsPrompt(preferences);
  
  try {
    const ai = getAiClient();
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-04-17',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            temperature: 0.8,
        }
    });

    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    const baseProperties = parseAndValidateProperties(jsonStr);
    
    setLoadingMessage("Gerando imagens e relatórios de vizinhança...");

    const enrichedProperties = await Promise.all(
        baseProperties.map(async (prop) => {
            const [imageUrls, neighborhoodVibe] = await Promise.all([
                generatePropertyImages(prop.imagePrompt),
                generateNeighborhoodVibe(prop, preferences)
            ]);

            return {
                ...prop,
                imageUrls,
                neighborhoodVibe,
            };
        })
    );

    return enrichedProperties;
  } catch (error) {
    console.error("Error generating property listings:", error);
    const errorMessage = error instanceof Error ? error.message : "Não foi possível gerar as recomendações. Por favor, tente novamente.";
    throw new Error(errorMessage);
  }
};


const generateSimilarListingsPrompt = (preferences: Preferences, existingIds: string[]): string => {
  const allPriorities = [...preferences.priorities, preferences.otherPriorities].filter(Boolean).join(', ');
  const allExtras = [...preferences.extras, preferences.otherExtras].filter(Boolean).join(', ');
  const fullPropertyType = [preferences.propertyType, preferences.otherPropertyType].filter(Boolean).join(' / ');

  return `
  Based on the following user preferences, generate a list of 2 additional fictional but realistic properties in Brazil. These should be interesting alternatives that the user might also like, even if they slightly differ from the main criteria.

  User Preferences:
  - Name: ${preferences.name}
  - Intention: ${preferences.intention}
  - Property Type: ${fullPropertyType}
  - Budget: ${preferences.budget.min.toLocaleString('pt-BR')} to ${preferences.budget.max.toLocaleString('pt-BR')} BRL
  - Location: ${preferences.location}
  - Priorities: ${allPriorities}
  - Essentials: ${preferences.bedrooms} bedrooms, ${preferences.bathrooms} bathrooms, and must have: ${allExtras}.

  For each property, provide a JSON object with the following structure:
  {
    "id": "a unique identifier using a UUID format, different from these: ${existingIds.join(', ')}",
    "title": "A creative and appealing headline for the property, in Portuguese.",
    "address": "A realistic-sounding fictional address in Brazil, in Portuguese.",
    "price": "A realistic integer price, can be slightly outside the user's budget if it's a great match.",
    "bedrooms": "Number of bedrooms.",
    "bathrooms": "Number of bathrooms.",
    "sqft": "A realistic integer for square meters (m²).",
    "description": "A compelling and evocative property description of 2-3 sentences, in Portuguese.",
    "imagePrompt": "A detailed English prompt (15-20 words) for an image generation AI, describing key visual elements to generate multiple images. Example: 'A rustic-chic farmhouse with a large porch, a cozy living room with a stone fireplace, and a gourmet kitchen.'",
    "personalizedPitch": "A short, friendly paragraph written to ${preferences.name}, explaining why this is a good fit.",
    "suggestionReason": "A single, compelling sentence in Portuguese explaining WHY this is a good ALTERNATIVE suggestion. For example: 'É um pouco acima do orçamento, mas oferece um raro terraço na cobertura.' or 'É uma casa em vez de um apartamento, oferecendo mais privacidade.'"
  }

  Return ONLY a valid JSON array of these objects, with no other text or explanation.
  `;
}

export const generateSimilarListings = async (preferences: Preferences, existingListings: Property[], setLoadingMessage: (msg: string) => void): Promise<Property[]> => {
  const existingIds = existingListings.map(p => p.id);
  const prompt = generateSimilarListingsPrompt(preferences, existingIds);

  try {
    const ai = getAiClient();
    setLoadingMessage("Buscando algumas opções criativas...");
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-04-17',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            temperature: 0.9,
        }
    });

    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    const baseProperties = parseAndValidateProperties(jsonStr);
    
    setLoadingMessage("Finalizando os detalhes extras...");

    const enrichedProperties = await Promise.all(
        baseProperties.map(async (prop) => {
            const [imageUrls, neighborhoodVibe] = await Promise.all([
                generatePropertyImages(prop.imagePrompt),
                generateNeighborhoodVibe(prop, preferences)
            ]);

            return {
                ...prop,
                imageUrls,
                neighborhoodVibe,
            };
        })
    );
    
    return enrichedProperties;

  } catch (error) {
    console.error("Error generating similar listings:", error);
    // It's okay to fail silently here, as these are bonus listings
    return [];
  }
};
