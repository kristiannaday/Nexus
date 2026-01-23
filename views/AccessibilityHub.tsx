
import React, { useRef, useState, useEffect, useContext } from 'react';
import { analyzeImageAndRead } from '../services/gemini';
import { ThemeContext } from '../App';
import { ModuleVisibility } from '../types';

const AccessibilityHub: React.FC = () => {
  const themeCtx = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState<'vision' | 'hearing' | 'cognitive' | 'experimental' | null>(null);
  const [visibility, setVisibility] = useState<Partial<ModuleVisibility>>({});
  
  // Vision State
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visionLoading, setVisionLoading] = useState(false);
  const [visionResult, setVisionResult] = useState("");
  const [visionStream, setVisionStream] = useState<MediaStream | null>(null);

  // Hearing State
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState<{role: 'speaker' | 'env', text: string}[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('psych_assistant_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      if (parsed.moduleVisibility) {
        setVisibility(parsed.moduleVisibility);
        // Automatically select the first enabled tool
        if (parsed.moduleVisibility.visionAide) setActiveTab('vision');
        else if (parsed.moduleVisibility.hearingAide) setActiveTab('hearing');
        else if (parsed.moduleVisibility.cognitiveAide) setActiveTab('cognitive');
        else if (parsed.moduleVisibility.colorFilters || parsed.moduleVisibility.screenReaderOpt) setActiveTab('experimental');
      }
    }
  }, []);

  if (!themeCtx) return null;
  const { colors, isDyslexicMode } = themeCtx;

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setVisionStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch (err) { console.error("Camera access failed", err); }
  };

  const captureVision = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setVisionLoading(true);
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth; canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    const base64 = canvas.toDataURL('image/jpeg').split(',')[1];
    try {
      const text = await analyzeImageAndRead(base64);
      setVisionResult(text);
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
    } catch (err) { setVisionResult("Failed to analyze image."); }
    finally { setVisionLoading(false); }
  };

  const toggleTranscript = () => {
    if (isListening) { setIsListening(false); return; }
    setIsListening(true);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true; recognition.interimResults = true;
      recognition.onresult = (e: any) => {
        const last = e.results.length - 1;
        if (e.results[last].isFinal) setTranscript(prev => [...prev, { role: 'speaker', text: e.results[last][0].transcript }]);
      };
      recognition.onend = () => { if (isListening) recognition.start(); };
      recognition.start();
    } else { setIsListening(false); alert("Speech recognition not supported in this browser."); }
  };

  useEffect(() => {
    if (activeTab === 'vision' && visibility.visionAide) startCamera();
    else visionStream?.getTracks().forEach(t => t.stop());
    return () => visionStream?.getTracks().forEach(t => t.stop());
  }, [activeTab, visibility.visionAide]);

  if (activeTab === null) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <i className="fa-solid fa-universal-access text-6xl text-gray-200 mb-6"></i>
        <h2 className="text-2xl font-black text-gray-400">Personal Assistance tools are currently inactive.</h2>
        <p className="text-gray-400 mt-2">Activate preferred aides in Settings.</p>
      </div>
    );
  }

  // Header Title based on tool
  const getHeaderTitle = () => {
    if (activeTab === 'vision') return "Vision Assistant";
    if (activeTab === 'hearing') return "Hearing Assistant";
    if (activeTab === 'cognitive') return "Cognitive Assistant";
    return "Personal Aide";
  };

  return (
    <div className={`max-w-6xl mx-auto pb-12 text-${colors.text}`}>
      <header className="mb-10">
        <h2 className="text-4xl font-black mb-2 flex items-center">
          <i className={`fa-solid ${activeTab === 'vision' ? 'fa-eye' : activeTab === 'hearing' ? 'fa-ear-listen' : 'fa-universal-access'} mr-4 text-${colors.primary}`}></i>
          {getHeaderTitle()}
        </h2>
        <p className="opacity-60 font-bold uppercase tracking-widest text-xs">AI Powered assistance for your personalized needs</p>
      </header>

      {/* Tabs - Only show what is enabled */}
      <div className="flex bg-white/50 backdrop-blur-md p-2 rounded-3xl border border-gray-100 shadow-sm mb-8 sticky top-0 z-10">
        {visibility.visionAide && (
          <button onClick={() => setActiveTab('vision')} className={`flex-1 py-4 rounded-2xl font-black text-xs transition-all ${activeTab === 'vision' ? `bg-${colors.primary} text-white shadow-lg` : 'text-gray-400 hover:text-gray-600'}`}>
            <i className="fa-solid fa-eye mr-2"></i> Vision
          </button>
        )}
        {visibility.hearingAide && (
          <button onClick={() => setActiveTab('hearing')} className={`flex-1 py-4 rounded-2xl font-black text-xs transition-all ${activeTab === 'hearing' ? `bg-${colors.primary} text-white shadow-lg` : 'text-gray-400 hover:text-gray-600'}`}>
            <i className="fa-solid fa-ear-listen mr-2"></i> Hearing
          </button>
        )}
        {visibility.cognitiveAide && (
          <button onClick={() => setActiveTab('cognitive')} className={`flex-1 py-4 rounded-2xl font-black text-xs transition-all ${activeTab === 'cognitive' ? `bg-${colors.primary} text-white shadow-lg` : 'text-gray-400 hover:text-gray-600'}`}>
            <i className="fa-solid fa-brain mr-2"></i> Cognitive
          </button>
        )}
        {(visibility.colorFilters || visibility.screenReaderOpt) && (
          <button onClick={() => setActiveTab('experimental')} className={`flex-1 py-4 rounded-2xl font-black text-xs transition-all ${activeTab === 'experimental' ? `bg-${colors.primary} text-white shadow-lg` : 'text-gray-400 hover:text-gray-600'}`}>
            <i className="fa-solid fa-sliders mr-2"></i> System
          </button>
        )}
      </div>

      <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 min-h-[500px]">
        {activeTab === 'vision' && visibility.visionAide && (
          <div className="p-8 space-y-8 animate-in fade-in">
             <div className="relative aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl cursor-pointer" onClick={captureVision}>
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <canvas ref={canvasRef} className="hidden" />
                {visionLoading && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white">
                    <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="font-bold">Analyzing visually...</p>
                  </div>
                )}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full bg-white text-black font-black flex items-center space-x-2">
                  <i className="fa-solid fa-camera"></i>
                  <span>TAP TO ANALYZE</span>
                </div>
             </div>
             {visionResult && (
               <div className={`p-8 rounded-3xl bg-${colors.primary}/5 border-l-8 border-${colors.primary}`}>
                  <h4 className="font-black text-[10px] uppercase mb-2 opacity-40">Visual Description</h4>
                  <p className="text-xl font-bold leading-relaxed">{visionResult}</p>
               </div>
             )}
          </div>
        )}

        {activeTab === 'hearing' && visibility.hearingAide && (
          <div className="p-8 h-full flex flex-col min-h-[500px] animate-in fade-in">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black">Live Transcript</h3>
              <button 
                onClick={toggleTranscript} 
                className={`px-8 py-4 rounded-full font-black text-sm transition-all ${isListening ? 'bg-rose-500 text-white animate-pulse' : `bg-${colors.primary} text-white`}`}
              >
                {isListening ? 'STOP TRANSCRIPT' : 'START TRANSCRIPT'}
              </button>
            </div>
            <div ref={scrollRef} className="flex-1 bg-gray-50 rounded-[2rem] p-8 overflow-y-auto space-y-4 max-h-[400px] border border-gray-100">
              {transcript.length === 0 && <p className="text-center py-20 opacity-20 font-bold">Transcription will appear here...</p>}
              {transcript.map((line, i) => (
                <div key={i}>
                  <span className="text-[10px] font-black uppercase opacity-40 block">{line.role}</span>
                  <p className="text-lg font-bold text-gray-800">{line.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'cognitive' && visibility.cognitiveAide && (
          <div className="p-12 space-y-8 animate-in fade-in">
            <h3 className="text-2xl font-black">Cognitive Aide</h3>
            <div className="p-8 rounded-[2rem] bg-gray-50 border border-gray-100 flex items-center justify-between">
              <div>
                <span className="font-black text-[10px] uppercase opacity-40">Dyslexia Mode</span>
                <p className="text-sm font-bold">Status: {isDyslexicMode ? 'ACTIVE' : 'INACTIVE'}</p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDyslexicMode ? `bg-${colors.primary} text-white shadow-lg` : 'bg-gray-200 text-gray-400'}`}>
                <i className="fa-solid fa-font"></i>
              </div>
            </div>
            <div className="p-10 rounded-[3rem] bg-white border-4 border-dashed border-gray-100 text-center">
              <i className="fa-solid fa-wand-magic-sparkles text-3xl text-gray-200 mb-4 block"></i>
              <p className="font-black text-gray-300">DROP TEXT HERE TO SIMPLIFY</p>
            </div>
          </div>
        )}

        {activeTab === 'experimental' && (
          <div className="p-12 space-y-6 animate-in fade-in">
            <h3 className="text-2xl font-black">System Preferences</h3>
            {visibility.colorFilters && (
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex items-center space-x-4">
                <i className="fa-solid fa-circle-half-stroke text-2xl opacity-20"></i>
                <span className="font-bold">High Contrast & Color Filters Active</span>
              </div>
            )}
            {visibility.screenReaderOpt && (
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex items-center space-x-4">
                <i className="fa-solid fa-keyboard text-2xl opacity-20"></i>
                <span className="font-bold">Screen Reader Optimization Enabled</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccessibilityHub;
