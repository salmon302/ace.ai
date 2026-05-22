import { useCallback, useRef } from "react";

export function useTextToSpeech() {
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speakWithBrowserTTS = useCallback((text: string) => {
    if (!window.speechSynthesis) {
      throw new Error("Speech synthesis is not available in this browser");
    }

    window.speechSynthesis.cancel();

    return new Promise<void>((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.volume = 1;
      utterance.lang = "en-US";
      utterance.onend = () => {
        if (speechUtteranceRef.current === utterance) {
          speechUtteranceRef.current = null;
        }
        resolve();
      };
      utterance.onerror = () => {
        if (speechUtteranceRef.current === utterance) {
          speechUtteranceRef.current = null;
        }
        reject(new Error("Speech synthesis failed"));
      };

      speechUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    });
  }, []);

  const speak = useCallback(async (
    text: string,
    _voiceId: string = "21m00Tcm4TlvDq8ikWAM",
    _modelId: string = "eleven_monolingual_v1",
  ): Promise<"browser-speech"> => {
    try {
      await speakWithBrowserTTS(text);
      return "browser-speech";
    } catch (error) {
      console.error("Failed to speak text:", error);
      return "browser-speech";
    }
  }, [speakWithBrowserTTS]);

  const stop = useCallback(() => {
    if (speechUtteranceRef.current && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      speechUtteranceRef.current = null;
    }
  }, []);

  return { speak, stop };
}
