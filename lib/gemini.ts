import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
// NOTE: Replace with your actual API key or use process.env.EXPO_PUBLIC_GEMINI_API_KEY
const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || "";

const genAI = new GoogleGenerativeAI(API_KEY);

export interface IngredientAnalysis {
    name: string;
    status: "safe" | "toxic" | "moderate";
    description: string;
}

export interface AnalysisResult {
    score: number;
    status: "Clean" | "Toxic" | "Moderate";
    ingredients: IngredientAnalysis[];
    alternatives: { name: string; reason: string }[];
}

export async function analyzeImage(base64Image: string): Promise<AnalysisResult> {
    if (!API_KEY) {
        throw new Error("Gemini API Key is missing. Please add EXPO_PUBLIC_GEMINI_API_KEY to your .env file.");
    }

    try {
        // Use gemini-1.5-pro for better reasoning, with low temperature for consistency
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: {
                temperature: 0.1,
                topP: 0.8,
                topK: 40,
            }
        });

        const prompt = `
      Analyze the ingredients in this product image. 
      
      Step 1: Perform OCR to extract the text from the image. Focus specifically on the "Ingredients" list.
      Step 2: Identify each individual ingredient.
      Step 3: Analyze each ingredient for health impact based on scientific consensus.
      Step 4: Calculate a health score from 0 to 100 using this STRICT scoring rubric:
          - Start with 100 points.
          - Deduct 10 points for each "Toxic" or "Harmful" ingredient (e.g., High Fructose Corn Syrup, Artificial Colors, Parabens, Sulfates).
          - Deduct 5 points for each "Moderate" concern ingredient (e.g., Added Sugar, Natural Flavors, Preservatives).
          - Do not deduct points for "Safe" or "Clean" ingredients (e.g., Water, Whole Grains, Fruits, Vegetables).
          - The minimum score is 0.
      
      Step 5: Determine the overall status:
          - 80-100: "Clean"
          - 50-79: "Moderate"
          - 0-49: "Toxic"

      Return ONLY valid JSON in the following format, with no markdown formatting:
      {
        "score": number,
        "status": "Clean" | "Toxic" | "Moderate",
        "ingredients": [
          { "name": "string", "status": "safe" | "toxic" | "moderate", "description": "short health impact description" }
        ],
        "alternatives": [
          { "name": "string", "reason": "string" }
        ]
      }
    `;

        // Remove data:image/jpeg;base64, prefix if present
        const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: cleanBase64,
                    mimeType: "image/jpeg",
                },
            },
        ]);

        const response = await result.response;
        const text = response.text();

        // Clean up potential markdown code blocks
        const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();

        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Gemini Analysis Error:", error);
        throw new Error("Failed to analyze image. Please try again.");
    }
}
