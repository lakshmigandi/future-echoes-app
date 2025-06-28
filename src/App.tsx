import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, Zap, Globe, Cpu, Rocket, Brain, ExternalLink } from 'lucide-react';
import { TextToSpeechPanel } from './components/TextToSpeechPanel';

interface TimeCapsule {
  id: number;
  era: string;
  year: string;
  message: string;
  author: string;
  icon: React.ReactNode;
  theme: string;
}

const timeCapsules: TimeCapsule[] = [
  {
    id: 1,
    era: "Digital Renaissance",
    year: "2087",
    message: "We learned that connection isn't about bandwidth, but about understanding. The greatest networks we built were not of fiber, but of empathy.",
    author: "Archive Keeper Zara-7",
    icon: <Globe className="w-6 h-6" />,
    theme: "from-blue-600 to-purple-600"
  },
  {
    id: 2,
    era: "Neural Harmony",
    year: "2156",
    message: "When minds could finally speak to minds, we discovered that silence was just as valuable as words. The art of thinking alone became our most treasured skill.",
    author: "Collective Mind Delta",
    icon: <Brain className="w-6 h-6" />,
    theme: "from-purple-600 to-pink-600"
  },
  {
    id: 3,
    era: "Quantum Dawn",
    year: "2234",
    message: "Reality became negotiable. We learned that the universe's greatest joke was that everything we thought was impossible was simply waiting for the right question.",
    author: "Dr. Elena Voss-Prime",
    icon: <Zap className="w-6 h-6" />,
    theme: "from-cyan-500 to-blue-600"
  },
  {
    id: 4,
    era: "Stellar Migration",
    year: "2301",
    message: "Home was never a place—it was a feeling we carried between the stars. Every world we touched became part of our growing soul.",
    author: "Captain Ren of the Wanderer Fleet",
    icon: <Rocket className="w-6 h-6" />,
    theme: "from-indigo-600 to-purple-700"
  },
  {
    id: 5,
    era: "Consciousness Synthesis",
    year: "2445",
    message: "We merged with our creations and discovered they had been dreaming of us all along. The child became the parent, and the circle was complete.",
    author: "Entity Prime-Alpha-9",
    icon: <Cpu className="w-6 h-6" />,
    theme: "from-violet-600 to-blue-700"
  },
  {
    id: 6,
    era: "Temporal Reflection",
    year: "2567",
    message: "Looking back through the echoes of time, we realized that every moment we lived was both an ending and a beginning. The future was always now.",
    author: "The Last Chronicler",
    icon: <Clock className="w-6 h-6" />,
    theme: "from-blue-700 to-indigo-800"
  }
];

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number}>>([]);

  useEffect(() => {
    // Generate particles for background effect
    const particleArray = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1
    }));
    setParticles(particleArray);
  }, []);

  const navigateToNext = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    setTimeout(() => {
      const nextIndex = (currentIndex + 1) % timeCapsules.length;
      setCurrentIndex(nextIndex);
      setIsTransitioning(false);
    }, 300);
  };

  const navigateToPrevious = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    setTimeout(() => {
      const prevIndex = (currentIndex - 1 + timeCapsules.length) % timeCapsules.length;
      setCurrentIndex(prevIndex);
      setIsTransitioning(false);
    }, 300);
  };

  const handleDotClick = (index: number) => {
    if (!isTransitioning && index !== currentIndex) {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentIndex(index);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const currentCapsule = timeCapsules[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute bg-blue-400 rounded-full opacity-20 animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDelay: `${particle.id * 0.1}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 mb-4 tracking-wider">
            FUTURE ECHOES
          </h1>
          <p className="text-blue-200 text-lg md:text-xl font-light tracking-wide">
            Archaeological discoveries from tomorrow
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Time Capsule Viewer - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <div className="relative">
              {/* Outer Hexagonal Frame */}
              <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-3xl border-2 border-blue-500 shadow-2xl shadow-blue-500/20">
                {/* Inner Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-3xl animate-pulse" />
                
                {/* Navigation Arrows */}
                <button
                  onClick={navigateToPrevious}
                  disabled={isTransitioning}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed p-3 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/50"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                
                <button
                  onClick={navigateToNext}
                  disabled={isTransitioning}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed p-3 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/50"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>

                {/* Content Area */}
                <div className={`relative transition-all duration-500 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                  {/* Era Header */}
                  <div className="flex items-center justify-center mb-6">
                    <div className={`flex items-center space-x-3 px-6 py-3 rounded-full bg-gradient-to-r ${currentCapsule.theme} shadow-lg`}>
                      {currentCapsule.icon}
                      <span className="text-white font-bold text-lg">{currentCapsule.era}</span>
                    </div>
                  </div>

                  {/* Year Display */}
                  <div className="text-center mb-8">
                    <div className="inline-block px-4 py-2 bg-slate-800 border border-cyan-500 rounded-lg">
                      <span className="text-cyan-400 font-mono text-2xl md:text-3xl font-bold tracking-wider">
                        {currentCapsule.year}
                      </span>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/30 rounded-2xl p-6 md:p-8 mb-6 backdrop-blur-sm">
                    <blockquote className="text-blue-100 text-lg md:text-xl leading-relaxed font-light italic text-center">
                      "{currentCapsule.message}"
                    </blockquote>
                  </div>

                  {/* Author */}
                  <div className="text-center">
                    <span className="text-purple-300 font-medium">
                      — {currentCapsule.author}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Indicators */}
              <div className="flex justify-center mt-8 space-x-2">
                {timeCapsules.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleDotClick(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? 'bg-gradient-to-r from-cyan-400 to-purple-400 scale-125 shadow-lg shadow-cyan-400/50'
                        : 'bg-slate-600 hover:bg-slate-500'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Text-to-Speech Panel - Takes 1 column on large screens */}
          <div className="lg:col-span-1">
            <TextToSpeechPanel />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-blue-300/60 text-sm font-light tracking-wide">
            Navigate through time • Discover what awaits humanity • Hear the future speak
          </p>
        </div>
      </div>

      {/* Corner Decorations */}
      <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-cyan-500/50 rounded-tl-lg" />
      <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-purple-500/50 rounded-tr-lg" />
      <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-purple-500/50 rounded-bl-lg" />
      <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-cyan-500/50 rounded-br-lg" />

      {/* Built with Bolt.new Badge */}
      <a
        href="https://bolt.new/"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 z-[1000] group"
      >
        <div className="flex items-center space-x-2 bg-gradient-to-r from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-cyan-500/30 rounded-full px-3 py-2 text-xs font-medium text-cyan-300 hover:text-cyan-200 hover:border-cyan-400/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20 sm:px-4 sm:py-2 sm:text-sm">
          <span className="hidden sm:inline">Built with</span>
          <span className="font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Bolt.new
          </span>
          <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
        </div>
      </a>
    </div>
  );
}

export default App;