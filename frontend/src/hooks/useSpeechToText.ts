import { DeepgramClient } from "@deepgram/sdk";
import { useState, useCallback, useRef } from "react";
import { apiFetch } from "../services/auth";

export function useSpeechToText() {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const dgConnectionRef = useRef<any>(null);

  const startListening = useCallback(async (stream: MediaStream) => {
    try {
      const response = await apiFetch("/tokens/stt-token");
      const { token } = await response.json();

      const deepgram = new DeepgramClient({ accessToken: token });
      const connection = await deepgram.listen.v1.connect({
        model: "nova-2",
        language: "en-US",
        punctuate: "true",
        interim_results: "true",
      });

      connection.on("open", () => {
        setIsListening(true);
        console.log("Deepgram connection opened");

        const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0 && connection.getReadyState() === 1) {
            connection.sendMedia(event.data);
          }
        };
        mediaRecorder.start(100); // 100ms chunks
      });

      connection.on("message", (data) => {
        if (data.type !== "Results" || !data.is_final) {
          return;
        }

        const text = data.channel.alternatives[0].transcript;
        if (text) {
          setTranscript((prev) => prev + " " + text);
        }
      });

      connection.on("close", () => {
        setIsListening(false);
        console.log("Deepgram connection closed");
      });

      dgConnectionRef.current = connection;
    } catch (error) {
      console.error("Failed to start STT:", error);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (dgConnectionRef.current) {
      dgConnectionRef.current.finish();
      dgConnectionRef.current = null;
    }
  }, []);

  return { transcript, setTranscript, isListening, startListening, stopListening };
}
