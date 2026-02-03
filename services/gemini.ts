
import { GoogleGenAI, Type } from "@google/genai";
import { Subject, SourceDocument } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const legalResearcher = async (query: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `You are a high-level Legal Researcher. Research the legal precedent, statutes, or common law principles related to: ${query}. Provide citations if possible and a summary of legal risk or standing.`,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });
  return {
    text: response.text,
    grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

export const scientificResearcher = async (query: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `You are a Senior Research Scientist. Research the latest scientific findings, peer-reviewed data, and experimental methodologies for: ${query}. Focus on accuracy and empirical evidence.`,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });
  return {
    text: response.text,
    grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

export const psychologyExpert = async (query: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `You are a Clinical Psychologist and Research Expert. Explain the following psychological concept, clinical presentation, or therapeutic methodology: ${query}. Reference standard frameworks like the DSM-5 or ICD-11 where appropriate.`,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });
  return {
    text: response.text,
    grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

export const marketingStrategist = async (query: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `You are a Chief Marketing Officer. Develop a marketing strategy, audience persona, or campaign brief for: ${query}. Use current market trends and consumer behavior data.`,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });
  return {
    text: response.text,
    grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

export const businessStrategist = async (company: string, market: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Perform a SWOT analysis and market trend report for ${company} in the ${market} sector. Use up-to-date market data.`,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });
  return {
    text: response.text,
    grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

export const creativeDirector = async (prompt: string) => {
  const ai = getAI();
  const imageResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: `A professional moodboard and creative visual concept for: ${prompt}. Cinematic, high-quality, aesthetic.` }] },
    config: { imageConfig: { aspectRatio: "16:9" } }
  });
  
  let imageData = "";
  for (const part of imageResponse.candidates[0].content.parts) {
    if (part.inlineData) imageData = `data:image/png;base64,${part.inlineData.data}`;
  }

  const textResponse = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Provide a creative brief and brand personality guide for: ${prompt}.`,
  });

  return { image: imageData, brief: textResponse.text };
};

export const techArchitect = async (reqs: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Design a technical system architecture for the following requirements: ${reqs}. Include stack recommendations, data flow logic, and potential scaling bottlenecks.`,
    config: { thinkingConfig: { thinkingBudget: 2000 } }
  });
  return response.text;
};

export const generateAnatomyDictionaryEntry = async (bodyPart: string) => {
  const ai = getAI();
  const imageResponse = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: { parts: [{ text: `A highly detailed medical illustration of the ${bodyPart}. Clean white background.` }] },
    config: { imageConfig: { aspectRatio: "1:1", imageSize: "1K" } }
  });
  let imageData = "";
  for (const part of imageResponse.candidates[0].content.parts) {
    if (part.inlineData) imageData = `data:image/png;base64,${part.inlineData.data}`;
  }
  const textResponse = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Clinical definition for: ${bodyPart}. Include function, location, and 3 pathologies.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          definition: { type: Type.STRING },
          function: { type: Type.STRING },
          location: { type: Type.STRING },
          pathologies: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["name", "definition", "function", "location", "pathologies"]
      }
    }
  });
  return { image: imageData, details: JSON.parse(textResponse.text.trim()) };
};

export const solveEngineeringProblem = async (problem: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Engineering solver: ${problem}`,
    config: {
      thinkingConfig: { thinkingBudget: 2000 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          solution: { type: Type.STRING },
          finalResult: { type: Type.STRING },
          principles: { type: Type.ARRAY, items: { type: Type.STRING } },
          visualDescription: { type: Type.STRING }
        },
        required: ["solution", "finalResult", "principles"]
      }
    }
  });
  return JSON.parse(response.text.trim());
};

export const notebookChat = async (query: string, sources: SourceDocument[]) => {
  const ai = getAI();
  const contextText = sources.map(s => `SOURCE [${s.title}]: ${s.content}`).join("\n\n");
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Notebook chat: ${contextText}\n\nQuery: ${query}`,
    config: { tools: [{ googleSearch: {} }], thinkingConfig: { thinkingBudget: 1000 } }
  });
  return { text: response.text, grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [] };
};

export const gradeAssistant = async (subject: string, assignmentType: string, rubric: string, submission: string, taKnowledge?: SourceDocument[]) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Grade this ${subject} ${assignmentType}. Rubric: ${rubric}. Submission: ${submission}`,
    config: {
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
    contents: `Summarize: ${text}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          notes: { type: Type.STRING },
          flashcards: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { question: { type: Type.STRING }, answer: { type: Type.STRING } } } }
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
    contents: `Accounting analysis: ${description}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          analysis: { type: Type.STRING },
          financialImpact: { type: Type.STRING },
          entries: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { account: { type: Type.STRING }, type: { type: Type.STRING }, amount: { type: Type.STRING }, reason: { type: Type.STRING } } } }
        },
        required: ["analysis", "financialImpact", "entries"]
      }
    }
  });
  return JSON.parse(response.text.trim());
};

export const analyzeImageAndRead = async (base64Image: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [{ inlineData: { data: base64Image, mimeType: 'image/jpeg' } }, { text: "Read text." }] }
  });
  return response.text;
};

export const draftDocument = async (topic: string, field: string, type: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Draft ${type} for ${field} on ${topic}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: { title: { type: Type.STRING }, summary: { type: Type.STRING }, outline: { type: Type.ARRAY, items: { type: Type.STRING } } },
        required: ["title", "summary", "outline"]
      }
    }
  });
  return JSON.parse(response.text.trim());
};

export const lookupGAAPRule = async (query: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `GAAP Rule: ${query}`,
    config: { tools: [{ googleSearch: {} }] }
  });
  return { text: response.text, grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [] };
};

export const draftFinancialStatements = async (scenario: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Statements: ${scenario}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          incomeStatement: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { item: { type: Type.STRING }, amount: { type: Type.NUMBER }, category: { type: Type.STRING } } } },
          balanceSheet: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { item: { type: Type.STRING }, amount: { type: Type.NUMBER }, type: { type: Type.STRING } } } },
          ratios: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, value: { type: Type.STRING }, interpretation: { type: Type.STRING } } } },
          healthScore: { type: Type.NUMBER },
          summary: { type: Type.STRING }
        }
      }
    }
  });
  return JSON.parse(response.text.trim());
};

export const auditTransaction = async (description: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Audit: ${description}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          analysis: { type: Type.STRING },
          riskLevel: { type: Type.STRING },
          warnings: { type: Type.ARRAY, items: { type: Type.STRING } },
          correctEntry: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { account: { type: Type.STRING }, type: { type: Type.STRING }, amount: { type: Type.STRING } } } }
        }
      }
    }
  });
  return JSON.parse(response.text.trim());
};

export const generateEmail = async (goal: string, context: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Email Goal: ${goal}. Context: ${context}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          variations: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { label: { type: Type.STRING }, subject: { type: Type.STRING }, body: { type: Type.STRING } } } }
        }
      }
    }
  });
  return JSON.parse(response.text.trim());
};
