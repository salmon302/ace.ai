# ACE.AI + DSATrain Integration Plan: "The Local-First Data-Driven Interviewer"

This document outlines the strategy for merging the sleek, voice-driven interface of **ACE.AI** with the deep, AI-enhanced data framework of **DSATrain** to create a sophisticated, local-first interview preparation platform.

---

## 🎯 Vision
Transform ACE.AI from a one-shot interview simulator into a **continuous learning platform** that uses DSATrain's 10,000+ problems and 480+ AI features to guide users through a personalized pedagogical journey.

---

## 🏗️ Architectural Core: The "Hybrid Bridge"

The integration will use a service-oriented architecture where DSATrain acts as a "Data & Recommendation Provider" for the ACE.AI frontend.

### 1. Backend Integration (Bridge Service)
*   **The DSA Proxy:** Create a `dsaService.ts` in the ACE.AI backend that communicates with the DSATrain FastAPI server (`http://localhost:8000`).
*   **Unified Execution Engine:** Route complex code execution (C++, Java, Bash) from ACE.AI's editor to DSATrain's already-implemented remote execution API.

### 2. Frontend Integration (UI Overlay)
*   **Knowledge Graph Dashboard:** Embed a React visualization of DSATrain’s 52-concept knowledge graph into the ACE.AI `Dashboard.tsx`.
*   **Smart Selection:** Update `SetupDashboard.tsx` to allow selecting "Focus Concepts" (e.g., Slidng Window, DP) which pulls problems via DSATrain's semantic similarity matching.

---

## 🧠 Feature Deep-Dive

### A. The "Smart Recommender" Flow
Instead of raw random selection, the LLM will act as a **Curator**:
1.  **Context Fetch:** ACE.AI backend asks DSATrain for 10 problems matching the user's "weakest nodes" in the knowledge graph.
2.  **LLM Selection:** The LLM analyzes the 128-dimensional embeddings and 5-dimensional difficulty vectors to select the 3 most "thematically consistent" problems.
3.  **Narrative Generation:** The LLM builds a custom interview script that links these problems into a realistic scenario (e.g., "Scaling a Distributed System").

### B. Cognitive Load & Adaptive Scaffolding
*   **Brain Power Meter:** Display the `working_memory_load` (1-10) for each problem in the UI.
*   **Adaptive Scaffolding:** If the user struggles (detected via ACE.AI transcript), the system triggers DSATrain's "Chunking Scaffolds" to provide conceptual hints without giving away the answer.

### C. Advanced Behavioral "STAR" Evaluation
Traditional ACE.AI behavioral feedback is general. Integration with DSATrain brings **Academic-Grade Rubrics**:
*   **STAR Quantifier:** Use DSATrain's `star_rubric_synthesizer` to score transcripts specifically on **Situation, Task, Action, and Result** on a 1-5 scale.
*   **Competency Heatmap:** Map ACE.AI responses to DSATrain’s 12 core competencies (Leadership, Ambiguity, etc.) and generate a radar chart in the results page.
*   **"Googleyness" Marker:** Leverage DSATrain's Google-specific behavioral markers (e.g., "Influence without Authority") to evaluate cultural fit.

### D. Multi-Modal "Replay Analytics"
*   **Code-Transcript Interleaving:** In `InterviewReplayPage.tsx`, sync the DSATrain "Heuristic Markers" with the transcript timeline. Highlighting moments where the user demonstrated "Strategic Thinking" or "System Perspective."
*   **SRS Integration:** Mark problems for "Review" in the ACE.AI Replay page, which automatically schedules them in DSATrain’s Spaced Repetition System (SRS).

### E. Career Progression & "Interview Readiness" Dashboard
Transform the ACE.AI Dashboard into a centralized career hub using DSATrain's historical analytics:
*   **The "Industry Readiness" Score:** Use DSATrain's `enhanced_stats` to calculate a live "Interview Readiness" meter (0-100%) based on mastery of high-relevance problems (quality >= 90.0).
*   **Cognitive Growth Trends:** Plot a time-series chart of the user's **Processing Speed** and **Working Memory Capacity** (from `cognitive_service.py`), showing how their problem-solving efficiency has evolved over multiple interviews.
*   **Skill Mastery Heatmap:** A 52-node knowledge graph visualization in the ACE.AI UI, color-coded by DSATrain's proficiency scores (0.0-1.0) for every major algorithm category.
*   **Adaptive Milestone Tracker:** Display the "Projected Completion" date of the user's current Career Path (e.g., "Full Stack Engineer @ Google") based on their real-world `solve_velocity`.

### F. Dedicated "DSA Learning Mode" & Intelligent Skill Tree
Instead of role-based interviewing, this mode focuses on algorithmic mastery via structured progression.

*   **Tiered Concept Gating:** Implement a "Tier" system in the Skill Tree. Users must complete at least 2 "Tier 1" problems (e.g., Arrays, Hash Tables) before unlocking "Tier 2" (e.g., Sliding Window, Trees).
    *   **Tier 1: Foundations** (No prerequisites)
    *   **Tier 2: Patterns** (Requires Arrays/Strings)
    *   **Tier 3: Advanced** (Requires Graphs/DP)
*   **The "Intelligent Challenge" Selector:** When a user clicks a "Challenge Me" button on a Skill Tree node, the system queries DSATrain's `ProblemDifficultyVector` to pick a problem that is exactly +0.1 algorithmic complexity higher than their current average mastery for that node.
*   **Narrative Pedagogy:** In Learning Mode, the ACE.AI voice assistant shifts from "Evaluator" to "Guide." It uses DSATrain's `ConceptNode` metadata to explain *why* a specific pattern (like Two Pointers) is the most efficient choice for the current problem.
*   **Visual Progress "Paths":** The Skill Tree UI will highlight recommended "Next Steps" paths based on DSATrain's defined dependencies—e.g., if you master `Two Pointers`, the tree will glow to suggest `Sliding Window` next.

### G. UI for "Hidden Complexity" & Positive Reinforcement
The interface should simplify the vast DSATrain dataset into an encouraging, "gamified" progression that rewards partial mastery.

*   **The "Discovery Map" (Hidden Vastness):** Instead of a list of 10,000 problems, show a "Fog of War" on the Skill Tree. Only 3-5 immediate "Challenge Nodes" are visible at any time. This prevents choice paralysis and makes the vast database feel like an unfolding adventure.
*   **"Partial Mastery" Gems:** Use DSATrain's 5-dimensional vectors to reward users for *parts* of a complex question. 
    *   If a user solves the "Algorithm" but fails the "Optimization," they still earn a **"Conceptual Master"** gem for that node. 
    *   Visual feedback: The node glows half-silver (Conceptual) and half-gold (Complete) to encourage returning for the full solve later.
*   **Adaptive Exposure (The "AI Mercy" Loop):** The AI's real-time transcript analysis directly informs the "Exposure Level" of tomorrow's problems.
    *   **The Recognition Loop:** If a user fails the coding test but the Vapi transcript shows they correctly articulated the *logic* (e.g., "I know I need a Hash Map here, but I'm struggling with the syntax"), the AI interviewer grants a **"Logical Intuition"** credit.
    *   **Exposure Adjustment:** This credit prevents the system from "demoting" the user back to basic levels. Instead, it offers a "Syntax-Light" version of a similar problem next, keeping the user challenged on logic while recognizing their tactical struggle.
*   **Cross-Concept "Fusion" Nodes:** For questions that bridge concepts (e.g., *Linked List* + *Binary Search*), display a specialized "Fusion Icon."
    *   Solving these provides bonus XP across both skill areas simultaneously, reinforcing the idea that engineering is about connecting dots.
*   **The "Confidence Meter":** A subtle, always-visible gauge in the Dashboard that fills as you master Tiers. It uses positive language like "Ready for Mid-Level Challenges" and "Pattern Recognition Sharpness +15%."
*   **Dual-Currency Economy (The Khan Model):**
    *   **⚡ Energy Points (Effort):** Awarded for *persistence*. Users earn these for minutes spent in the editor, lines of code written, and words spoken during the interview—even if the solution is wrong. This rewards the *grind* and reduces the fear of failure.
    *   **🏆 Mastery Points (Knowledge):** Awarded for *attaining targets*. These are tied directly to DSATrain's 5-dimensional difficulty vectors. Passing a "Hard" optimization test grants maximum Mastery Points for that concept node.
    *   **UI Integration:** Displayed as two distinct bars in the header. High Energy with Low Mastery suggests "High Potential - Need Targeted Practice," triggering the AI to recommend a "Foundation" bridge.
*   **The "Momentum Engine" (Streaks & Discovery):**
    *   **🔥 Velocity Streak:** Tracks consecutive days of earning Energy Points. This promotes the "consistency over intensity" habit essential for interview prep.
    *   **🔭 Discovery Streak:** A specialized streak for **exploring new concepts**. Earned by interacting with a new Skill Tree node or Tier for 3 consecutive sessions. This discourages "camping" in easy concepts.
    *   **Visual Reinforcement:** A "Comet Path" animation on the Skill Tree that lights up as you move across different concepts, visually linking your "Discovery" journey and making the progression feel like a conquest.
*   **Vocal Affirmation Anchors:** The AI assistant is programmed to "anchor" specific correct portions of a failed attempt.
    *   *"You didn't get the code to run, but your insight about the space complexity was spot on. I'm marking your Pattern Recognition as 'High' for this session."*
    *   This feedback is saved as a `heuristic_marker` in the DSATrain DB, influencing future problem recommendations even without a "green" test execution.
*   **Micro-Achievements:** Use the `expert_labeled` data to trigger "Aha Moment" badges:
    *   *"The Space Optimizer"* (for reducing $O(N)$ space to $O(1)$)
    *   *"Strategic Thinker"* (for asking a clarifying question before coding) – powered by Vapi transcript analysis.

### H. Local-First Profile & Data Sovereignty
To align with DSATrain's privacy-first philosophy, the system will shift from a cloud-only Supabase model to a **Hybrid Local-Sync** architecture.

*   **"Offline-Ready" Profile:** ACE.AI currently relies on Supabase Auth. We will introduce a **Local Profile Mode** where user data is mirrored to a local SQLite database (`dsatrain_phase4.db`).
    *   **The Bridge:** When online, stats sync to Supabase. When offline, the system defaults to the `default_user` profile from DSATrain.
*   **Cognitive Persistence (Local-First):** Move specialized metrics (Working Memory, Processing Speed, SRS history) from cloud storage into `config/user_settings.json`. 
    *   This ensures that even if you delete your online account, your "Mental Model" and learning progress remain on your machine.
*   **Local AI Execution:** Add a toggle to route OpenAI requests to a **Local LLM** (e.g., Llama 3 via Ollama) using DSATrain's existing `ai_provider: "local"` configuration. 
    *   This makes the voice-driven interview completely private and functional without an internet connection.
*   **Privacy Dashboard:** Add a "Data Sovereignty" tab where users can export their entire "Interview Memory" (transcripts, code, SRS stats) as a single portable JSON file.

---

## 🛠️ Implementation Phases

### Phase 1: The Data Pipeline (Discovery)
- [ ] Connect ACE.AI backend to DSATrain API.
- [ ] Map DSATrain `Problem` types to ACE.AI `CodingProblem` types.
- [ ] Implement `GET /api/dsa/recommendations` in ACE.AI.

### Phase 2: The Pedagogy (Logic)
- [ ] Integrate DSATrain's `prerequisite_map` into the selection logic.
- [ ] Add "Difficulty Axes" sliders to ACE.AI's setup screen (Implementation vs. Optimization).
- [ ] Link ACE.AI interview results back to DSATrain's SRS (Spaced Repetition) stats.

### Phase 3: The Visualization (UI)
- [ ] Build the "Skill Tree" component in ACE.AI.
- [ ] Add "Cognitive Profile" stats to the `Results.tsx` page.
- [ ] Create a "Local/Remote" toggle for data privacy preferences.

---

## 🚀 Key Synergies
| Feature | ACE.AI (Frontend) | DSATrain (Engine) |
| :--- | :--- | :--- |
| **Problem Bank** | 3 Fallback Problems | 10,618 AI-Enhanced Problems |
| **Selection** | Hardcoded/Random | Semantic & Pattern Matching |
| **Evaluation** | General Feedback | Heuristic + Academic Scoring |
| **Progression** | Single Session | 52-Concept Learning Path |

---
*Plan drafted on May 18, 2026 for the ACE.AI + DSATrain Merge Initiative.*
