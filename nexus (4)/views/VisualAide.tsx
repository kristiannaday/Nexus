
import React, { useRef, useState, useEffect } from 'react';
import { analyzeImageAndRead } from '../services/gemini';

const VisualAide: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultText, setResultText] = useState("");

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
      }
    } catch (err) {
      console.error("Camera access denied", err);
      alert("Please allow camera access for the visual aide.");
    }
  };

  useEffect(() => {
    startCamera();
    return () => stream?.getTracks().forEach(t => t.stop());
  }, []);

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(msg);
  };

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setLoading(true);
    setResultText("Analyzing...");
    speak("Analyzing image, please wait.");

    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0);

    const base64 = canvas.toDataURL('image/jpeg').split(',')[1];
    
    try {
      const text = await analyzeImageAndRead(base64);
      setResultText(text);
      speak(text);
    } catch (err) {
      setResultText("Failed to process image.");
      speak("Sorry, I couldn't read that. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-black text-pink-900">Visual Aide</h2>
        <p className="text-pink-600 text-lg">Point camera at text and tap anywhere to read.</p>
      </div>

      <div 
        className="relative aspect-square md:aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl border-4 border-white cursor-pointer group"
        onClick={captureAndAnalyze}
      >
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="w-full h-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />
        
        {loading && (
          <div className="absolute inset-0 bg-pink-900/50 flex flex-col items-center justify-center text-white p-6 text-center">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-2xl font-bold animate-pulse">Gemini is looking...</p>
          </div>
        )}

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white px-8 py-4 rounded-full shadow-lg flex items-center space-x-3 pointer-events-none group-active:scale-95 transition-transform">
          <i className="fa-solid fa-camera text-pink-600 text-xl"></i>
          <span className="font-bold text-pink-900">TAP TO READ</span>
        </div>
      </div>

      {resultText && !loading && (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-pink-100 animate-in fade-in slide-in-from-bottom-4">
          <h3 className="text-lg font-bold mb-2 flex items-center text-pink-800">
            <i className="fa-solid fa-comment-dots mr-2 text-pink-500"></i>
            Description
          </h3>
          <p className="text-pink-950 leading-relaxed text-lg">{resultText}</p>
          <button 
            onClick={() => speak(resultText)}
            className="mt-4 flex items-center space-x-2 text-pink-600 font-bold hover:text-pink-700 transition-colors"
          >
            <i className="fa-solid fa-volume-high"></i>
            <span>Replay Audio</span>
          </button>
        </div>
      )}

      <div className="bg-pink-100/50 p-6 rounded-3xl border border-pink-100">
        <h4 className="font-bold text-pink-800 mb-2">Tips for Better Results</h4>
        <ul className="text-pink-700 space-y-2 list-disc pl-5">
          <li>Hold your device steady</li>
          <li>Ensure there is good lighting</li>
          <li>Center the text in the camera frame</li>
        </ul>
      </div>
    </div>
  );
};

export default VisualAide;
