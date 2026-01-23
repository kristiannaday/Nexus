
import { GoogleGenAI, Type } from "@google/genai";
import { Subject, SourceDocument } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const notebookChat = async (query: string, sources: SourceDocument[]) => {
  const ai = getAI();
  const contextText = sources.map(s => `SOURCE [${s.title}]: ${s.content}`).join("\n\n");
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `You are an advanced academic research assistant. 
    
    TASK:
    1. Use the provided user notes (SOURCES) to answer the query.
    2. Use GOOGLE SEARCH to verify the accuracy of the information in the notes.
    3. If there is a CONFLICT between the provided notes and the information found on the internet, clearly highlight it in a section called "CONTEXT CONFLICT".
    4. Provide the final answer based on the most accurate information.

    SOURCES:
    ${contextText}
    
    USER QUERY: ${query}`,
    config: {
      tools: [{ googleSearch: {} }],
      thinkingConfig: { thinkingBudget: 1000 }
    }
  });

  return {
    text: response.text,
    grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

export const generateEmail = async (goal: string, context: string, tone: string = "Professional") => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `You are a high-end personal assistant. Write a ${tone} email. 
    Goal: ${goal}
    Context: ${context}
    Provide 3 variations: 1. Concise, 2. Detailed, 3. Empathetic.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          variations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                subject: { type: Type.STRING },
                body: { type: Type.STRING }
              },
              required: ["label", "subject", "body"]
            }
          }
        },
        required: ["variations"]
      }
    }
  });
  return JSON.parse(response.text.trim());
};

export const gradeAssistant = async (subject: string, assignmentType: string, rubric: string, submission: string, taKnowledge?: SourceDocument[]) => {
  const ai = getAI();
  const knowledgeContext = taKnowledge?.map(s => `REFERENCE [${s.title}]: ${s.content}`).join("\n") || "";
  const persona = subject === 'Accounting' ? "CPA Professor" : subject === 'Psychology' ? "Psychology Professor" : `${subject} TA`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Grade this ${subject} ${assignmentType}. 
    
    SUBMISSION: ${submission}
    RUBRIC PROVIDED BY USER: ${rubric}
    
    ${knowledgeContext ? `CLASS CONTEXT/DOCUMENTS:\n${knowledgeContext}` : ""}
    `,
    config: {
      systemInstruction: `You are a ${persona}. Focus on rubric adherence and professional feedback. Use the class context provided to ensure grading matches class-specific policies.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.STRING },
          feedback: { type: Type.STRING },
          criteriaMet: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["score", "feedback", "criteriaMet"]
      }
    }
  });
  return JSON.parse(response.text.trim());
};

export const summarizeAndNotes = async (text: string, subject: Subject = 'General') => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the following ${subject} text and provide a structured summary and study notes. Also, generate 5 flashcards. Text: ${text}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          notes: { type: Type.STRING },
          flashcards: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                answer: { type: Type.STRING }
              },
              required: ["question", "answer"]
            }
          }
        },
        required: ["summary", "notes", "flashcards"]
      }
    }
  });
  return JSON.parse(response.text.trim());
};

export const analyzeAccountingTransaction = async (description: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze this transaction and provide the journal entry (Debits/Credits). Transaction: ${description}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          analysis: { type: Type.STRING },
          entries: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                account: { type: Type.STRING },
                type: { type: Type.STRING, enum: ["Debit", "Credit"] },
                amount: { type: Type.STRING },
                reason: { type: Type.STRING }
              },
              required: ["account", "type", "amount", "reason"]
            }
          }
        },
        required: ["analysis", "entries"]
      }
    }
  });
  return JSON.parse(response.text.trim());
};

export const analyzeImageAndRead = async (base64Image: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
        { text: "Extract text and analyze context." }
      ]
    }
  });
  return response.text;
};

export const draftDocument = async (topic: string, field: string, type: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Create a professional document draft for a ${field} ${type}. 
    Topic: ${topic}. 
    Include a Title, Executive Summary, and a 5-part structured outline.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          summary: { type: Type.STRING },
          outline: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["title", "summary", "outline"]
      }
    }
  });
  return JSON.parse(response.text.trim());
};
