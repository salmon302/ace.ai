import { useCallback, useRef } from "react";
import { apiFetch } from "../services/auth";

export function useTextToSpeech() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const speak = useCallback(async (text: string, voiceId: string = "21m00Tcm4TlvDq8ikWAM") => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      // Stop current playback if any (barge-in support)
      if (currentSourceRef.current) {
        currentSourceRef.current.stop();
      }

      const response = await apiFetch("/tokens/tts", {
        method: "POST",
        body: JSON.stringify({ text, voiceId }),
      });

      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
      
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      source.start(0);
      
      currentSourceRef.current = source;
    } catch (error) {
      console.error("Failed to speak text:", error);
    }
  }, []);

  const stop = useCallback(() => {
    if (currentSourceRef.current) {
      currentSourceRef.current.stop();
      currentSourceRef.current = null;
    }
  }, []);

  return { speak, stop };
}
