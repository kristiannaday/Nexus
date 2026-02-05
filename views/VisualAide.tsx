import React, { useRef, useState, useEffect } from 'react';
import { analyzeImageAndRead } from '../services/gemini';

const VisualAide = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [resultText, setResultText] = useState("");

  // 1. Starts camera automatically
  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = s;
      }
    } catch (err) {
      setResultText("Camera access denied. Please click 'Allow' in your browser.");
    }
  };

  useEffect(() => {
    startCamera();
  }, []);

  // 2. Text-to-Speech tool
  const speak = (text) => {
    if (!text) return;
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(msg);
  };

  // 3. The "Snapshot" and AI logic
  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setLoading(true);
    setResultText("Analyzing...");
    speak("Analyzing image, please wait.");

    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    // Take the picture
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);

    // Get the image data
    const imageData = canvas.toDataURL('image/jpeg');
    
    try {
      // Send to the fixed gemini.ts
      const response = await analyzeImageAndRead(imageData);
      setResultText(response);
      speak(response);
    } catch (err) {
      setResultText("Sorry, I couldn't read that. Try again.");
      speak("Sorry, I couldn't read that.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
      <h2 style={{ color: '#831843', fontWeight: '900', fontSize: '2rem' }}>Visual Aide</h2>
      <p style={{ color: '#be185d', marginBottom: '20px' }}>Tap the camera feed to read text aloud.</p>

      <div 
        onClick={captureAndAnalyze}
        style={{ 
          position: 'relative', 
          aspectRatio: '1/1', 
          background: '#000', 
          borderRadius: '30px', 
          overflow: 'hidden',
          border: '4px solid white',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          cursor: 'pointer'
        }}
      >
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          style={{ width: '100%', h: '100%', objectFit: 'cover' }} 
        />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        
        {loading && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(131, 24, 67, 0.7)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Gemini is looking...</p>
          </div>
        )}

        <div style={{ position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)', background: 'white', padding: '10px 30px', borderRadius: '50px', fontWeight: 'bold', color: '#831843' }}>
           📸 TAP TO READ
        </div>
      </div>

      {resultText && !loading && (
        <div style={{ marginTop: '20px', padding: '20px', background: 'white', borderRadius: '20px', textAlign: 'left', border: '1px solid #fce7f3' }}>
          <h3 style={{ color: '#9d174d', fontWeight: 'bold' }}>Description:</h3>
          <p style={{ color: '#500724' }}>{resultText}</p>
          <button onClick={() => speak(resultText)} style={{ marginTop: '10px', color: '#db2777', fontWeight: 'bold', border: 'none', background: 'none', cursor: 'pointer' }}>
            🔊 Replay Audio
          </button>
        </div>
      )}
    </div>
  );
};

export default VisualAide;
