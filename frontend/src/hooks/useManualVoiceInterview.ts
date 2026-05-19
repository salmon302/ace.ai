import { useState, useEffect, useCallback, useRef } from "react";
import { useVoiceActivityDetection } from "./useVoiceActivityDetection";
import { useSpeechToText } from "./useSpeechToText";
import { useTextToSpeech } from "./useTextToSpeech";
import { apiFetch } from "../services/auth";

export function useManualVoiceInterview(config: any) {
  const [messages, setMessages] = useState<any[]>([]);
  const [status, setStatus] = useState<"idle" | "listening" | "thinking" | "speaking">("idle");
  const { isUserSpeaking, vad } = useVoiceActivityDetection();
  const { transcript, setTranscript, startListening, stopListening } = useSpeechToText();
  const { speak, stop: stopTTS } = useTextToSpeech();
  
  const isSpeakingRef = useRef(false);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize Microphone
  const startSession = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;
    startListening(stream);
    setStatus("listening");
    
    // Initial greeting if needed
    handleLLMResponse("Hello! I'm your interviewer today. Are you ready to begin?");
  };

  // Handle LLM Completion and TTS
  const handleLLMResponse = async (text: string) => {
    setStatus("speaking");
    isSpeakingRef.current = true;
    await speak(text);
    isSpeakingRef.current = false;
    setStatus("listening");
  };

  // Logic to process transcript when user stops speaking
  useEffect(() => {
    if (!isUserSpeaking && transcript.trim().length > 0 && status === "listening") {
      const userMessage = transcript.trim();
      setTranscript("");
      processUserMessage(userMessage);
    }
  }, [isUserSpeaking, transcript, status]);

  const processUserMessage = async (text: string) => {
    setStatus("thinking");
    const updatedMessages = [...messages, { role: "user", content: text }];
    setMessages(updatedMessages);

    try {
      const response = await apiFetch("/analysis/chat", {
        method: "POST",
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const reader = response.body?.getReader();
      let fullResponse = "";
      
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = new TextDecoder().decode(value);
          const lines = chunk.split("\n\n");
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") break;
              try {
                const { content } = JSON.parse(data);
                fullResponse += content;
              } catch (e) {}
            }
          }
        }
      }

      setMessages(prev => [...prev, { role: "assistant", content: fullResponse }]);
      handleLLMResponse(fullResponse);
    } catch (error) {
       console.error("LLM Error:", error);
       setStatus("listening");
    }
  };

  // Interruption (Barge-in)
  useEffect(() => {
    if (isUserSpeaking && status === "speaking") {
      stopTTS();
      setStatus("listening");
    }
  }, [isUserSpeaking, status, stopTTS]);

  return {
    status,
    messages,
    startSession,
    isUserSpeaking,
    transcript
  };
}
