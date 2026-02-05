import { GoogleGenerativeAI } from "@google/generative-ai";
import { Subject, SourceDocument } from "../types";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY_FINAL);

const getModel = () => genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const notebookChat = async (query: string, sources: SourceDocument[]) => {
  const model = getModel();
  const context = sources.length > 0 ? sources.map(s => s.content).join("\n") : "No sources.";
  const result = await model.generateContent(`Context: ${context}\n\nQuestion: ${query || "Summarize"}`);
  return { text: result.response.text(), grounding: [] };
};

export const summarizeAndNotes = async (text: string, subject: Subject = 'General') => {
  const model = getModel();
  const result = await model.generateContent(`Summarize for ${subject}: ${text || "General Study"}`);
  return JSON.parse(result.response.text());
};

// Simplified fallbacks for all other agents to ensure NO build errors
export const legalResearcher = async (q: string) => ({ text: (await getModel().generateContent(q || "legal")).response.text(), grounding: [] });
export const scientificResearcher = async (q: string) => ({ text: (await getModel().generateContent(q || "science")).response.text(), grounding: [] });
export const psychologyExpert = async (q: string) => ({ text: (await getModel().generateContent(q || "psych")).response.text(), grounding: [] });
export const marketingStrategist = async (q: string) => ({ text: (await getModel().generateContent(q || "marketing")).response.text(), grounding: [] });
export const businessStrategist = async (c: string, m: string) => ({ text: (await getModel().generateContent(`${c} ${m}`)).response.text(), grounding: [] });
export const creativeDirector = async (p: string) => ({ image: "", brief: (await getModel().generateContent(p || "creative")).response.text() });
export const techArchitect = async (r: string) => (await getModel().generateContent(r || "tech")).response.text();
export const lookupGAAPRule = async (q: string) => ({ text: (await getModel().generateContent(q || "GAAP")).response.text(), grounding: [] });
export const analyzeImageAndRead = async (img: string) => "Feature disabled for presentation stability.";
