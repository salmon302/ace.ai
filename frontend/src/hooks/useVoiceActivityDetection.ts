import { useMicVAD } from "@ricky0123/vad-react";
import { useState, useEffect } from "react";

export function useVoiceActivityDetection() {
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);

  const vad = useMicVAD({
    onSpeechStart: () => {
      console.log("Speech start detected");
      setIsUserSpeaking(true);
    },
    onSpeechEnd: (audio) => {
      console.log("Speech end detected");
      setIsUserSpeaking(false);
      // 'audio' is a Float32Array of the captured speech
    },
    workletURL: "/vad/vad.worklet.bundle.min.js",
    modelURL: "/vad/silero_vad_v5.onnx",
  });

  return {
    isUserSpeaking,
    vad,
  };
}
