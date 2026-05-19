import fs from "fs";
import path from "path";
import { supabase } from "./supabase";
import { DISABLE_SUPABASE } from "../config";
import type {
  SavedInterview,
  VapiInterviewConfig,
  VapiAnalysisResult,
  VapiTranscriptEntry,
} from "../types/interview";

const LOCAL_STORAGE_PATH = path.join(process.cwd(), "data", "interviews.json");

// Ensure data directory exists
if (DISABLE_SUPABASE && !fs.existsSync(path.dirname(LOCAL_STORAGE_PATH))) {
  fs.mkdirSync(path.dirname(LOCAL_STORAGE_PATH), { recursive: true });
}

function loadLocalInterviews(): any[] {
  if (!fs.existsSync(LOCAL_STORAGE_PATH)) return [];
  try {
    return JSON.parse(fs.readFileSync(LOCAL_STORAGE_PATH, "utf-8"));
  } catch {
    return [];
  }
}

function saveLocalInterviews(interviews: any[]): void {
  fs.writeFileSync(LOCAL_STORAGE_PATH, JSON.stringify(interviews, null, 2));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToInterview(row: any): SavedInterview {
  return {
    id: row.id,
    date: row.created_at,          // frontend expects "date"
    role: row.role,
    questionType: row.question_type,
    config: row.config,
    result: row.result,
    transcript: row.transcript ?? [],
  };
}

const COLUMNS = "id, created_at, role, question_type, config, result, transcript";

export async function saveInterview(
  userId: string,
  config: VapiInterviewConfig,
  result: VapiAnalysisResult,
  transcript: VapiTranscriptEntry[] = [],
): Promise<SavedInterview> {
  if (DISABLE_SUPABASE) {
    const interviews = loadLocalInterviews();
    const newInterview = {
      id: Math.random().toString(36).substring(2, 15),
      user_id: userId,
      role: config.role,
      question_type: config.questionType,
      config,
      result,
      transcript,
      created_at: new Date().toISOString(),
    };
    interviews.push(newInterview);
    saveLocalInterviews(interviews);
    return rowToInterview(newInterview);
  }

  const { data, error } = await supabase
    .from("interviews")
    .insert({
      user_id: userId,
      role: config.role,
      question_type: config.questionType,
      config,
      result,
      transcript,
    })
    .select(COLUMNS)
    .single();

  if (error || !data) throw new Error(error?.message ?? "Failed to save interview");
  return rowToInterview(data);
}

export async function getInterviews(userId: string): Promise<SavedInterview[]> {
  if (DISABLE_SUPABASE) {
    const interviews = loadLocalInterviews();
    return interviews
      .filter((i) => i.user_id === userId)
      .map(rowToInterview)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  const { data, error } = await supabase
    .from("interviews")
    .select(COLUMNS)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(rowToInterview);
}

export async function getInterviewById(
  userId: string,
  id: string,
): Promise<SavedInterview | null> {
  if (DISABLE_SUPABASE) {
    const interviews = loadLocalInterviews();
    const interview = interviews.find((i) => i.id === id && i.user_id === userId);
    return interview ? rowToInterview(interview) : null;
  }

  const { data, error } = await supabase
    .from("interviews")
    .select(COLUMNS)
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (error || !data) return null;
  return rowToInterview(data);
}

export async function getLatestInterview(userId: string): Promise<SavedInterview | null> {
  if (DISABLE_SUPABASE) {
    const interviews = loadLocalInterviews();
    const userInterviews = interviews
      .filter((i) => i.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return userInterviews.length > 0 ? rowToInterview(userInterviews[0]) : null;
  }

  const { data, error } = await supabase
    .from("interviews")
    .select(COLUMNS)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  return rowToInterview(data);
}
