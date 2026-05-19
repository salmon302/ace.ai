import { Router } from "express";
import type { Request, Response } from "express";
import { analyzeVapiTranscript, generateInterviewQuestions } from "../services/aiService";
import { saveInterview, getInterviews } from "../services/storageService";
import type { VapiTranscriptEntry, VapiInterviewConfig } from "../types/interview";
import { validateQuestionGeneration, validateTranscriptEvaluation } from "../middleware/validate";

const router = Router();

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
