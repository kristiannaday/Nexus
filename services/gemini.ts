import { GoogleGenerativeAI } from "@google/generative-ai";
import { Subject, SourceDocument } from "../types";

// Setup using your verified API key
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY_FINAL);

// Using the most stable model for your presentation
const getModel = (modelName: string = "gemini-1.5-flash") => {
  return genAI.getGenerativeModel({ model: modelName });
};

// --- SPECIALIZED AGENTS WITH PRE-EMPTY CHECKS ---

export const legalResearcher = async (query: string) => {
  try {
    const model = getModel();
    // Guard: If query is empty, provide a fallback to prevent 400 error
    const safeQuery = query?.trim() || "general legal principles";
    const prompt = `You are a high-level Legal Researcher. Research: ${safeQuery}.`;
    const result = await model.generateContent(prompt);
    return { text: result.response.text(), grounding: [] };
  } catch (e) { return { text: "Error connecting to Legal AI.", grounding: [] }; }
};

export const scientificResearcher = async (query: string) => {
  try {
    const model = getModel();
    const safeQuery = query?.trim() || "latest scientific trends";
    const prompt = `You are a Senior Research Scientist. Research: ${safeQuery}.`;
    const result = await model.generateContent(prompt);
    return { text: result.response.text(), grounding: [] };
  } catch (e) { return { text: "Error connecting to Science AI.", grounding: [] }; }
};

export const psychologyExpert = async (query: string) => {
  const model = getModel();
  const safeQuery = query?.trim() || "basic psychological concepts";
  const prompt = `You are a Clinical Psychologist. Explain: ${safeQuery}.`;
  const result = await model.generateContent(prompt);
  return { text: result.response.text(), grounding: [] };
};

export const marketingStrategist = async (query: string) => {
  const model = getModel();
  const safeQuery = query?.trim() || "current marketing trends";
  const prompt = `You are a CMO. Develop a strategy for: ${safeQuery}.`;
  const result = await model.generateContent(prompt);
  return { text: result.response.text(), grounding: [] };
};

export const businessStrategist = async (company: string, market: string) => {
  const model = getModel();
  const prompt = `Perform a SWOT analysis for ${company || "a startup"} in the ${market || "tech"} sector.`;
  const result = await model.generateContent(prompt);
  return { text: result.response.text(), grounding: [] };
};

export const creativeDirector = async (prompt: string) => {
  const model = getModel();
  const safePrompt = prompt?.trim() || "a modern brand identity";
  const textPrompt = `Provide a creative brief for: ${safePrompt}.`;
  const result = await model.generateContent(textPrompt);
  return { image: "", brief: result.response.text() };
};

export const techArchitect = async (reqs: string) => {
  const model = getModel();
  const safeReqs = reqs?.trim() || "a scalable web application";
  const prompt = `Design architecture for: ${safeReqs}.`;
  const result = await model.generateContent(prompt);
  return result.response.text();
};

export const notebookChat = async (query: string, sources: SourceDocument[]) => {
  const model = getModel();
  // Guard: If no sources, handle gracefully instead of crashing
  const contextText = sources.length > 0 
    ? sources.map(s => `SOURCE [${s.title}]: ${s.content}`).join("\n\n")
    : "No specific sources provided.";
  
  const prompt = `Context: ${contextText}\n\nQuery: ${query || "Summarize the context."}`;
  const result = await model.generateContent(prompt);
  return { text: result.response.text(), grounding: [] };
};

export const summarizeAndNotes = async (text: string, subject: Subject = 'General') => {
  const model = getModel();
  const safeText = text?.trim() || "Provide a general summary of study techniques.";
  const prompt = `Summarize this text for ${subject}: ${safeText}. Return JSON with: summary (string), notes (string), flashcards (array).`;
  
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: "application/json" }
  });
  return JSON.parse(result.response.text());
};

// Simplified OCR for stability
export const analyzeImageAndRead = async (base64Image: string) => {
    const model = getModel();
    try {
        if(!base64Image) return "No image provided.";
        const cleanBase64 = base64Image.split(',')[1] || base64Image;
        const result = await model.generateContent([
            "Read the text in this image.",
            { inlineData: { data: cleanBase64, mimeType: "image/jpeg" } }
        ]);
        return result.response.text();
    } catch(e) { return "Error reading image."; }
};
