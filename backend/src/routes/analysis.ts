import { Router } from "express";
import type { Request, Response } from "express";
import { analyzeVapiTranscript, generateInterviewQuestions, streamChatCompletion } from "../services/aiService";
import { saveInterview, getInterviews } from "../services/storageService";
import type { VapiTranscriptEntry, VapiInterviewConfig } from "../types/interview";
import { validateQuestionGeneration, validateTranscriptEvaluation } from "../middleware/validate";

const router = Router();

// Streaming chat endpoint for voice interviews
router.post("/chat", async (req: Request, res: Response) => {
  try {
    const { messages } = req.body;
    
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const stream = await streamChatCompletion(messages);

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err) {
    console.error("Error in streaming chat:", err);
    res.status(500).end();
  }
});

// POST /api/analysis/questions — generate 3 role-aware technical questions
router.post("/questions", validateQuestionGeneration, async (req: Request, res: Response) => {
  try {
    const { role, difficulty, level, language, jobDescription, resume } = req.body as {
      role: string;
      difficulty: string;
      level: string;
      language?: string;
      jobDescription?: string;
      resume?: string;
    };

    const problems = await generateInterviewQuestions(role, difficulty, level, language, jobDescription, resume);
    res.json({ problems });
  } catch (err) {
    console.error("Error generating questions:", err);
    res.status(500).json({ error: "Failed to generate questions" });
  }
});

// POST /api/analysis/evaluate — analyze a completed voice interview
router.post("/evaluate", validateTranscriptEvaluation, async (req: Request, res: Response) => {
  try {
    const { transcript, config } = req.body as {
      transcript: VapiTranscriptEntry[];
      config: VapiInterviewConfig;
    };

    // Strip timestamps for AI analysis; pass full entries (with timestamps) to storage
    const analysisTranscript = transcript.map(({ role, text }) => ({ role, text }));
    const result = await analyzeVapiTranscript(analysisTranscript, config);
    const saved = await saveInterview(req.user!.id, config, result, transcript);

    res.json({ id: saved.id, result });
  } catch (err) {
    console.error("Error analyzing interview:", err);
    res.status(500).json({ error: "Failed to analyze interview" });
  }
});

// GET /api/analysis/history — return all past interview results (includes transcripts)
router.get("/history", async (req: Request, res: Response) => {
  try {
    const interviews = await getInterviews(req.user!.id);
    res.json({ interviews });
  } catch (err) {
    console.error("Error fetching interview history:", err);
    res.status(500).json({ error: "Failed to fetch interview history" });
  }
});

export default router;
