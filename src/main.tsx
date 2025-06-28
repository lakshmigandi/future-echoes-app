import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Assuming you have or will create an index.css

const App: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // You can customize the time capsule messages or add more
  const timeCapsules = [
    { year: 2050, text: "In 2050, humanity thrives on renewable energy, and virtual reality seamlessly integrates with daily life, making remote work and global connections more vibrant than ever. Remember the simple joy of a sunny afternoon." },
    { year: 2075, text: "By 2075, advanced AI assistants are common companions, space tourism is accessible, and personalized medicine extends lifespans. Society values knowledge and empathy above all else. Cherish your unique journey." },
    { year: 2100, text: "Welcome to 2100. Quantum computing has unlocked unimaginable possibilities, sustainable mega-cities stand tall, and humanity explores distant stars. The echoes of the past remind us of the courage it took to reach this future. Embrace the unknown." },
  ];

  const futureMessage = timeCapsules[Math.floor(Math.random() * timeCapsules.length)];

  // --- FINAL WORKAROUND: API KEY HARDCODED FOR DEMONSTRATION ---
  // !!! IMPORTANT !!!
  // Replace 'YOUR_ACTUAL_ELEVENLABS_API_KEY_STARTING_WITH_SK-HERE'
  // with your REAL ElevenLabs API key that starts with 'sk-'
  const API_KEY = 'sk_f539e12593fe8818b54345d8d1c15148bc008fd09ea8ec7f';
  // --- END WORKAROUND ---

  const VOICE_ID = 'pNInz6obpgdqAKRxlnGw'; // Adam's voice ID 
  const MODEL_ID = 'eleven_monolingual_v1'; // Or 'eleven_multilingual_v2' for more languages

  // The useEffect to check API_KEY is now for the hardcoded key
  useEffect(() => {
    if (API_KEY && API_KEY !== 'YOUR_ACTUAL_ELEVENLABS_API_KEY_STARTING_WITH_SK-HERE') {
      console.log("ElevenLabs API Key: Loaded (hardcoded and valid)");
      setError(null);
    } else {
      setError("ElevenLabs API Key is missing or placeholder. Please provide your real key in src/main.tsx.");
      console.error("ElevenLabs API Key is missing or placeholder. Please provide your real key in src/main.tsx.");
    }
  }, [API_KEY]);

  // Function to speak the message using ElevenLabs API
  const speakMessage = async (text: string) => {
    // If API key is not available or is still the placeholder, set error and stop
    if (!API_KEY || API_KEY === 'YOUR_ACTUAL_ELEVENLABS_API_KEY_STARTING_WITH_SK-HERE') {
      setError("ElevenLabs API Key is not configured. Cannot speak message.");
      console.error("ElevenLabs API Key is not configured. Cannot speak message.");
      return;
    }

    // Prevent multiple concurrent speech requests
    if (isSpeaking) return;

    setIsSpeaking(true); // Set speaking state to true
    setError(null); // Clear any previous errors

    try {
      // Make the API request to ElevenLabs
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': API_KEY,
        },
        body: JSON.stringify({
          text: text,
          model_id: MODEL_ID,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      });

      // Handle non-OK responses from the API
      if (!response.ok) {
        const errorData = await response.json();
        console.error("ElevenLabs API Error:", errorData);
        setError(`Failed to generate speech: ${errorData.detail || response.statusText}`);
        setIsSpeaking(false);
        return;
      }

      // Get the audio blob and create an audio URL
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      // Event listener for when audio finishes playing
      audio.onended = () => {
        setIsSpeaking(false); // Reset speaking state
        URL.revokeObjectURL(audioUrl); // Release the object URL
      };

      // Event listener for audio playback errors
      audio.onerror = (e) => {
        console.error("Audio playback error:", e);
        setError("Error playing audio. Please check console for details.");
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };

      audio.play(); // Play the generated audio

    } catch (err) {
      // Catch network or other unexpected errors
      console.error("Network or unexpected error:", err);
      setError("An unexpected error occurred. Please check your network connection.");
      setIsSpeaking(false);
    }
  };

  return (
    <div style={{
      fontFamily: 'Inter, sans-serif', // Using Inter font
      textAlign: 'center',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#282c34', // Dark background
      color: 'white', // White text
      padding: '20px',
      borderRadius: '8px' // Rounded corners for overall div
    }}>
      <h1 style={{ marginBottom: '20px', color: '#61dafb' }}>Future Echoes</h1> {/* Highlighted title */}
      <p style={{ fontSize: '1.2em', maxWidth: '600px', margin: '20px 0', lineHeight: '1.5' }}>
        A message from the year {futureMessage.year}:
      </p>
      <p style={{
        fontSize: '1.5em',
        fontWeight: 'bold',
        fontStyle: 'italic',
        maxWidth: '700px',
        border: '1px solid #61dafb', // Border color
        padding: '20px',
        borderRadius: '15px', // More rounded corners
        backgroundColor: '#3a3f47', // Slightly lighter dark background for the box
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)' // Stronger shadow
      }}>
        "{futureMessage.text}"
      </p>

      <button
        onClick={() => speakMessage(futureMessage.text)}
        disabled={isSpeaking || !API_KEY || API_KEY === 'YOUR_ACTUAL_ELEVENLABS_API_KEY_STARTING_WITH_SK-HERE'} // Disable if speaking or no valid API key
        style={{
          padding: '15px 30px',
          fontSize: '1.2em',
          marginTop: '30px',
          cursor: isSpeaking || !API_KEY || API_KEY === 'YOUR_ACTUAL_ELEVENLABS_API_KEY_STARTING_WITH_SK-HERE' ? 'not-allowed' : 'pointer',
          backgroundColor: isSpeaking ? '#555' : '#61dafb', // Blue for active, grey for disabled
          color: 'white',
          border: 'none',
          borderRadius: '25px', // Pill-shaped button
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)', // Button shadow
          transition: 'background-color 0.3s ease, transform 0.2s ease', // Smooth transitions
          outline: 'none', // Remove outline on focus
          // Hover and active states (can be done with CSS modules or inline)
          ':hover': {
            transform: (isSpeaking || !API_KEY || API_KEY === 'YOUR_ACTUAL_ELEVENLABS_API_KEY_STARTING_WITH_SK-HERE') ? 'none' : 'translateY(-2px)',
            backgroundColor: (isSpeaking || !API_KEY || API_KEY === 'YOUR_ACTUAL_ELEVENLABS_API_KEY_STARTING_WITH_SK-HERE') ? '#555' : '#4fa3d8', // Darker blue on hover
          },
          ':active': {
            transform: (isSpeaking || !API_KEY || API_KEY === 'YOUR_ACTUAL_ELEVENLABS_API_KEY_STARTING_WITH_SK-HERE') ? 'none' : 'translateY(0)',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)'
          }
        }}
      >
        {isSpeaking ? 'Speaking...' : 'Hear Message from the Future'}
      </button>

      {error && (
        <p style={{ color: '#ff6b6b', marginTop: '20px', fontWeight: 'bold', animation: 'fadeIn 0.5s' }}>
          Error: {error}
        </p>
      )}

      {/* Basic CSS for fade-in animation, if you add it to index.css */}
      {/*
      <style>
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      </style>
      */}

      <p style={{ marginTop: '50px', fontSize: '0.9em', color: '#aaa' }}>
        Powered by ElevenLabs
      </p>
    </div>
  );
};

// ReactDOM.createRoot is used to render the React application into the DOM
// It targets the HTML element with id 'root'
ReactDOM.createRoot(document.getElementById('root')!).render(
  // React.StrictMode is a tool for highlighting potential problems in an application
  // It activates additional checks and warnings for its descendants
  <React.StrictMode>
    <App /> {/* The main application component is rendered here */}
  </React.StrictMode>,
);
