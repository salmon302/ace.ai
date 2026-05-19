import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Mic, MicOff, X, Loader2, Play, Circle } from "lucide-react";
import { useManualVoiceInterview } from "../hooks/useManualVoiceInterview";
import { MicVisualizer } from "./MicVisualizer";
import { DashboardNavbar } from "./DashboardNavbar";

export function ManualVoiceInterviewPanel() {
  const navigate = useNavigate();
  const location = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);

  const state = location.state as {
    role?: string;
    questionType?: string;
    difficulty?: number;
    strictness?: number;
    experienceLevel?: number;
    interviewer?: string;
  } | null;

  const config = {
    role: state?.role ?? "fullstack",
    difficulty: state?.difficulty ?? 50,
    experienceLevel: state?.experienceLevel ?? 50,
    interviewer: state?.interviewer ?? "Cassidy",
  };

  const {
    status,
    messages,
    startSession,
    isUserSpeaking,
    transcript
  } = useManualVoiceInterview(config);

  const [timeLeft, setTimeLeft] = useState(1500); // 25 min default

  useEffect(() => {
    if (status === "idle" || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [status, timeLeft]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, transcript]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleEndCall = () => {
    // Logic to evaluate transcript and navigate to analytics
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden flex flex-col">
      <DashboardNavbar activeTab="interviews" variant="dark" compact />

      <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full p-4 md:p-6 gap-6 overflow-hidden">
        {/* Header Stats */}
        <div className="flex items-center justify-between backdrop-blur-lg bg-white/5 rounded-2xl border border-white/10 p-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full animate-pulse ${status !== "idle" ? "bg-green-500" : "bg-gray-500"}`} />
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Status</p>
              <p className="text-sm font-medium capitalize">{status}</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Time Remaining</p>
            <p className="text-lg font-mono font-bold text-cyan-400">{formatTime(timeLeft)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Role</p>
            <p className="text-sm font-medium">{config.role}</p>
          </div>
        </div>

        {/* Main Interaction Area */}
        <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
          {/* Avatar & Controls */}
          <div className="w-full md:w-1/3 flex flex-col gap-6">
            <div className="flex-1 backdrop-blur-lg bg-white/5 rounded-3xl border border-white/10 shadow-2xl flex flex-col items-center justify-center p-8 relative overflow-hidden group">
              {/* Animated Background Pulse */}
              <AnimatePresence>
                {(status === "speaking" || isUserSpeaking) && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1.5, opacity: 0.15 }}
                    exit={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`absolute inset-0 rounded-full ${isUserSpeaking ? "bg-cyan-500" : "bg-purple-500"}`}
                  />
                )}
              </AnimatePresence>

              <div className={`w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl z-10 border-4 ${status === "speaking" ? "border-purple-400/50" : "border-white/10"}`}>
                <span className="text-5xl font-bold">{config.interviewer[0]}</span>
              </div>
              
              <div className="mt-8 text-center z-10">
                <h2 className="text-2xl font-bold">{config.interviewer}</h2>
                <p className="text-gray-400">AI Recruiter</p>
              </div>

              <div className="mt-8 w-full z-10 px-4">
                <MicVisualizer 
                  volumeLevel={0} // We need to wire up real volume from useVoiceActivityDetection if possible
                  isListening={status === "listening" || isUserSpeaking}
                  isSpeaking={status === "speaking"}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="backdrop-blur-lg bg-white/5 rounded-2xl border border-white/10 p-4 flex items-center justify-center gap-4">
              {status === "idle" ? (
                <button
                  onClick={startSession}
                  className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-cyan-500/20"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Begin Interview
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleEndCall}
                    className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-6 py-3 rounded-xl font-bold transition-all"
                  >
                    <X className="w-5 h-5" />
                    End Session
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Transcript/Messages */}
          <div className="flex-1 flex flex-col backdrop-blur-lg bg-white/5 rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
              <h3 className="font-semibold text-gray-300">Live Transcript</h3>
              {status === "thinking" && (
                <div className="flex items-center gap-2 text-xs text-purple-400">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  AI is processing...
                </div>
              )}
            </div>
            <div 
              ref={scrollRef}
              className="flex-1 p-6 overflow-y-auto space-y-4 scroll-smooth"
            >
              {messages.length === 0 && status === "idle" && (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-4">
                  <Circle className="w-12 h-12 text-cyan-500 animate-pulse" />
                  <p>Microphone ready. Click "Begin Interview" to start.</p>
                </div>
              )}
              {messages.map((msg, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                    msg.role === "user" 
                      ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-100" 
                      : "bg-purple-500/10 border border-purple-500/20 text-purple-100"
                  }`}>
                    <p className="text-[10px] uppercase tracking-tighter opacity-50 mb-1 font-bold">
                      {msg.role === "user" ? "You" : config.interviewer}
                    </p>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {transcript && (
                <motion.div className="flex justify-end opacity-70">
                  <div className="max-w-[85%] rounded-2xl px-4 py-2 text-sm bg-cyan-900/20 border border-cyan-500/10 italic text-cyan-200">
                    <p className="text-[10px] uppercase tracking-tighter opacity-50 mb-1 font-bold">User (Streaming)</p>
                    {transcript}...
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
