import { useEffect, useMemo, useState } from "react";
import { INTERVIEWERS } from "../hooks/useVapiInterview";
import { useTextToSpeech } from "../hooks/useTextToSpeech";
import { DashboardNavbar } from "./DashboardNavbar";
import { Volume2, Play, Square, Loader2, AlertCircle } from "lucide-react";

export function ElevenLabsTester() {
  const [status, setStatus] = useState<"idle" | "connecting" | "active" | "ended">("idle");
  const [logs, setLogs] = useState<{ ts: string; msg: string; type: "info" | "error" | "success" }[]>([]);
  const [elevenLabsModel, setElevenLabsModel] = useState("eleven_monolingual_v1");
  const [selectedInterviewer, setSelectedInterviewer] = useState("cassidy");
  const { speak, stop } = useTextToSpeech();

  const manualInterviewers = useMemo(
    () => Object.entries(INTERVIEWERS).filter(([, interviewer]) => interviewer.voice.provider === "11labs"),
    [],
  );
  
  const log = (msg: string, type: "info" | "error" | "success" = "info") => {
    const ts = new Date().toLocaleTimeString();
    setLogs(prev => [{ ts, msg, type }, ...prev].slice(0, 50));
  };

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  async function startTest() {
    try {
      setStatus("connecting");
      const interviewer = INTERVIEWERS[selectedInterviewer] || INTERVIEWERS.cassidy;
      if (interviewer.voice.provider !== "11labs") {
        log("This manual tester only supports ElevenLabs-backed voices.", "error");
        setStatus("idle");
        return;
      }

      log(`Starting manual playback test with ${selectedInterviewer} (${elevenLabsModel})...`);

      const previewText = "This is a test of the voice system. If you can hear me, the playback is working correctly.";
      log(`Previewing voice: ${interviewer.voice.voiceId}`);

      setStatus("active");
      const playbackMode = await speak(previewText, interviewer.voice.voiceId, elevenLabsModel);
      log(`Manual playback finished using ${playbackMode}.`, "success");
      setStatus("ended");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown playback error";
      log(`Failed to start: ${message}`, "error");
      setStatus("idle");
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <DashboardNavbar activeTab="System Test" variant="dark" compact />
      
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
            <Volume2 className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Manual Voice Debugger</h1>
            <p className="text-slate-400 text-sm">Diagnostic tool for ElevenLabs playback without Vapi</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="space-y-6">
            <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6 shadow-2xl">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                Settings
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-500 font-bold mb-2">Interviewer</label>
                  <select 
                    value={selectedInterviewer} 
                    onChange={(e) => setSelectedInterviewer(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                  >
                    {manualInterviewers.map(([key, interviewer]) => (
                        <option key={key} value={key}>{interviewer.name} ({interviewer.voice.provider})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-500 font-bold mb-2">ElevenLabs Model</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => setElevenLabsModel("eleven_monolingual_v1")}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                        elevenLabsModel === "eleven_monolingual_v1" 
                        ? "bg-blue-500/20 border-blue-500/50 text-blue-400" 
                        : "bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700"
                      }`}
                    >
                      Monolingual v1
                    </button>
                    <button 
                      onClick={() => setElevenLabsModel("eleven_multilingual_v2")}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                        elevenLabsModel === "eleven_multilingual_v2" 
                        ? "bg-blue-500/20 border-blue-500/50 text-blue-400" 
                        : "bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700"
                      }`}
                    >
                      Multilingual v2
                    </button>
                  </div>
                </div>

                <div className="pt-4">
                  {status === "active" ? (
                    <button 
                      onClick={() => {
                        stop();
                        setStatus("ended");
                        log("Manual playback stopped.", "info");
                      }}
                      className="w-full py-4 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl font-bold flex items-center justify-center gap-2 border border-red-500/30 transition-all"
                    >
                      <Square className="w-5 h-5 fill-current" />
                      Stop Test
                    </button>
                  ) : (
                    <button 
                      onClick={startTest}
                      disabled={status === "connecting"}
                      className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
                    >
                      {status === "connecting" ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Play className="w-5 h-5 fill-current" />
                      )}
                      Run Playback Test
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="backdrop-blur-xl bg-amber-500/5 rounded-2xl border border-amber-500/10 p-5">
              <h3 className="text-amber-400 font-bold text-sm flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4" />
                Troubleshooting
              </h3>
              <ul className="text-xs text-slate-400 space-y-2 list-disc pl-4">
                <li>This tester now uses browser speech synthesis locally.</li>
                <li>Ensure your browser has a usable English voice installed.</li>
                <li>Verify your microphone permissions are granted.</li>
                <li>Open Browser Console (F12) for detailed network error codes.</li>
              </ul>
            </div>
          </div>

          {/* Logs */}
          <div className="flex flex-col h-[500px]">
             <div className="flex-1 backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 overflow-hidden flex flex-col">
               <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                 <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Live Logs</span>
                 <button onClick={() => setLogs([])} className="text-[10px] text-slate-500 hover:text-slate-300">Clear</button>
               </div>
               <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-[11px]">
                  {logs.length === 0 && <div className="text-slate-600 italic">Waiting for events...</div>}
                  {logs.map((L, i) => (
                    <div key={i} className="flex gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                      <span className="text-slate-600 shrink-0">[{L.ts}]</span>
                      <span className={
                        L.type === "error" ? "text-red-400" : 
                        L.type === "success" ? "text-emerald-400" : 
                        "text-blue-300"
                      }>{L.msg}</span>
                    </div>
                  ))}
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}