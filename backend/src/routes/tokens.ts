import { Router } from "express";
import { DeepgramClient } from "@deepgram/sdk";
import { authMiddleware } from "../middleware/auth";

const router = Router();
const deepgram = new DeepgramClient(process.env.DEEPGRAM_API_KEY as string);

// Provision ephemeral keys for STT
router.get("/stt-token", authMiddleware, async (req, res) => {
  try {
    const { result, error } = await deepgram.manage.createProjectKey(
      process.env.DEEPGRAM_PROJECT_ID as string,
      {
        comment: "Ephemeral key for interview session",
        scopes: ["usage:write"],
        tags: ["interview"],
        time_to_live_in_seconds: 3600, // 1 hour
      }
    );

    if (error) {
       console.error("Deepgram token error:", error);
       res.status(500).json({ error: "Failed to create STT token" });
       return;
    }

    res.json({ token: result.key });
  } catch (error) {
    console.error("STT token exception:", error);
    res.status(500).json({ error: "Internal server error during STT token generation" });
  }
});

// Proxy for ElevenLabs TTS to avoid CORS and hide API key
router.post("/tts", authMiddleware, async (req, res) => {
  try {
    const { text, voiceId } = req.body;
    const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
    
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY as string,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
        },
      }),
    });

    if (!response.ok) {
      throw new Error("ElevenLabs API error");
    }

    const arrayBuffer = await response.arrayBuffer();
    res.set("Content-Type", "audio/mpeg");
    res.send(Buffer.from(arrayBuffer));
  } catch (error) {
    console.error("TTS proxy error:", error);
    res.status(500).json({ error: "Failed to generate speech" });
  }
});

export default router;
