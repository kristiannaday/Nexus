import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const NexusAI = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  // Access the key from Vercel
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

  async function sendMessage() {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro"});
      const result = await model.generateContent(input);
      const text = result.response.text();
      setResponse(text);
    } catch (error) {
      setResponse("Error: Could not connect to Gemini. Make sure your API Key is set in Vercel.");
      console.error(error);
    }
    setLoading(false);
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 min-h-[600px] flex flex-col">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-indigo-600 mb-2">Nexus AI Assistant</h1>
          <p className="text-gray-500">Powered by Gemini</p>
        </div>

        {/* Chat Output Area */}
        <div className="flex-1 bg-gray-50 rounded-xl p-4 mb-4 overflow-y-auto whitespace-pre-wrap font-medium text-gray-700">
          {response || "Hello! I am your Nexus AI assistant. How can I help you organize your life today?"}
        </div>

        {/* Input Area */}
        <div className="flex gap-2">
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me to draft an email, plan a schedule, or explain a concept..."
            className="flex-1 p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-24"
          />
          <button 
            onClick={sendMessage}
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Thinking..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NexusAI;
