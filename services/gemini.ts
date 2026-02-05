import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { Subject, SourceDocument } from "../types";

// 1. Setup the API using the correct Vercel Environment Variable
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY_FINAL);

// Helper to get a model instance (Using Gemini 1.5 Flash for speed and intelligence)
const getModel = (modelName: string = "gemini-1.5-flash") => {
  return genAI.getGenerativeModel({ model: modelName }, { apiVersion: 'v1' });
};

// --- SPECIALIZED AGENTS ---

export const legalResearcher = async (query: string) => {
  try {
    const model = getModel();
    const prompt = `You are a high-level Legal Researcher. Research the legal precedent, statutes, or common law principles related to: ${query}. Provide citations if possible and a summary of legal risk or standing.`;
    const result = await model.generateContent(prompt);
    return { text: result.response.text(), grounding: [] };
  } catch (e) { return { text: "Error connecting to Legal AI.", grounding: [] }; }
};

export const scientificResearcher = async (query: string) => {
  try {
    const model = getModel();
    const prompt = `You are a Senior Research Scientist. Research the latest scientific findings, peer-reviewed data, and experimental methodologies for: ${query}. Focus on accuracy and empirical evidence.`;
    const result = await model.generateContent(prompt);
    return { text: result.response.text(), grounding: [] };
  } catch (e) { return { text: "Error connecting to Science AI.", grounding: [] }; }
};

export const psychologyExpert = async (query: string) => {
  const model = getModel();
  const prompt = `You are a Clinical Psychologist and Research Expert. Explain the following psychological concept, clinical presentation, or therapeutic methodology: ${query}. Reference standard frameworks like the DSM-5 or ICD-11 where appropriate.`;
  const result = await model.generateContent(prompt);
  return { text: result.response.text(), grounding: [] };
};

export const marketingStrategist = async (query: string) => {
  const model = getModel();
  const prompt = `You are a Chief Marketing Officer. Develop a marketing strategy, audience persona, or campaign brief for: ${query}. Use current market trends and consumer behavior data.`;
  const result = await model.generateContent(prompt);
  return { text: result.response.text(), grounding: [] };
};

export const businessStrategist = async (company: string, market: string) => {
  const model = getModel();
  const prompt = `Perform a SWOT analysis and market trend report for ${company} in the ${market} sector. Use up-to-date market data.`;
  const result = await model.generateContent(prompt);
  return { text: result.response.text(), grounding: [] };
};

export const creativeDirector = async (prompt: string) => {
  // Note: Image generation via API often requires specific enterprise accounts. 
  // We will fallback to text description for the "brief" to ensure the app doesn't crash.
  const model = getModel();
  const textPrompt = `Provide a creative brief, brand personality guide, and detailed visual description for a moodboard based on: ${prompt}.`;
  
  const result = await model.generateContent(textPrompt);
  return { image: "", brief: result.response.text() };
};

export const techArchitect = async (reqs: string) => {
  const model = getModel();
  const prompt = `Design a technical system architecture for the following requirements: ${reqs}. Include stack recommendations, data flow logic, and potential scaling bottlenecks.`;
  const result = await model.generateContent(prompt);
  return result.response.text();
};

export const generateAnatomyDictionaryEntry = async (bodyPart: string) => {
  const model = getModel();
  const prompt = `Generate a clinical definition for: ${bodyPart}. Return a JSON object with these fields: name, definition, function, location, pathologies (an array of 3 strings).`;
  
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: "application/json" }
  });
  
  return { image: "", details: JSON.parse(result.response.text()) };
};

export const solveEngineeringProblem = async (problem: string) => {
  const model = getModel();
  const prompt = `Engineering solver for: ${problem}. Return JSON with: solution (string), finalResult (string), principles (array of strings), visualDescription (string).`;
  
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: "application/json" }
  });
  
  return JSON.parse(result.response.text());
};

export const notebookChat = async (query: string, sources: SourceDocument[]) => {
  const model = getModel();
  const contextText = sources.map(s => `SOURCE [${s.title}]: ${s.content}`).join("\n\n");
  const prompt = `You are a helpful notebook assistant. Use these sources to answer the query.\n\nCONTEXT:\n${contextText}\n\nQUERY: ${query}`;
  
  const result = await model.generateContent(prompt);
  return { text: result.response.text(), grounding: [] };
};

export const gradeAssistant = async (subject: string, assignmentType: string, rubric: string, submission: string) => {
  const model = getModel();
  const prompt = `Grade this ${subject} ${assignmentType}. Rubric: ${rubric}. Submission: ${submission}. Return JSON with: score (string), feedback (string), criteriaMet (array of strings).`;
  
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: "application/json" }
  });
  
  return JSON.parse(result.response.text());
};

export const summarizeAndNotes = async (text: string, subject: Subject = 'General') => {
  const model = getModel();
  const prompt = `Summarize this text and create study notes. Return JSON with: summary (string), notes (string), flashcards (array of objects with question and answer). Text: ${text}`;
  
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: "application/json" }
  });
  
  return JSON.parse(result.response.text());
};

export const analyzeAccountingTransaction = async (description: string) => {
  const model = getModel();
  const prompt = `Analyze this accounting transaction: "${description}". Return JSON with: analysis, financialImpact, entries (array with account, type, amount, reason).`;
  
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: "application/json" }
  });
  
  return JSON.parse(result.response.text());
};

export const draftDocument = async (topic: string, field: string, type: string) => {
  const model = getModel();
  const prompt = `Draft a ${type} for ${field} on the topic: ${topic}. Return JSON with: title, summary, outline (array of strings).`;
  
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: "application/json" }
  });
  
  return JSON.parse(result.response.text());
};

export const lookupGAAPRule = async (query: string) => {
  const model = getModel();
  const prompt = `Explain the GAAP Rule regarding: ${query}.`;
  const result = await model.generateContent(prompt);
  return { text: result.response.text(), grounding: [] };
};

export const draftFinancialStatements = async (scenario: string) => {
  const model = getModel();
  const prompt = `Generate financial statements for: ${scenario}. Return JSON with incomeStatement (array), balanceSheet (array), ratios (array), healthScore (number), summary (string).`;
  
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: "application/json" }
  });
  
  return JSON.parse(result.response.text());
};

export const auditTransaction = async (description: string) => {
  const model = getModel();
  const prompt = `Audit this transaction: ${description}. Return JSON with analysis, riskLevel, warnings (array), correctEntry (array).`;
  
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: "application/json" }
  });
  
  return JSON.parse(result.response.text());
};

export const generateEmail = async (goal: string, context: string) => {
  const model = getModel();
  const prompt = `Write emails for goal: ${goal}. Context: ${context}. Return JSON with "variations" (array of objects with label, subject, body).`;
  
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: "application/json" }
  });
  
  return JSON.parse(result.response.text());
};

// Fallback for image analysis (simplified for text-only input for now)
export const analyzeImageAndRead = async (base64Image: string) => {
    // Note: To handle images properly, we need to strip the base64 header
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    try {
        // Simple text fallback if image fails or string is empty
        if(!base64Image) return "No image provided.";
        
        // This expects the base64 string to be clean (no data:image/... prefix)
        // If your app sends the prefix, we clean it:
        const cleanBase64 = base64Image.split(',')[1] || base64Image;

        const result = await model.generateContent([
            "Read the text in this image and analyze it.",
            { inlineData: { data: cleanBase64, mimeType: "image/jpeg" } }
        ]);
        return result.response.text();
    } catch(e) {
        return "Error reading image. Ensure it is a valid format.";
    }
};
