# Design Philosophy & Vision: The Automated Employment Ecosystem

This document outlines the core tenets, architectural principles, and strategic vision for the JobPipe + ACE.AI + DSATrain ecosystem. This is not a SaaS product; it is an open-source, local-first exoskeleton designed to give engineering power-users absolute leverage in the modern job market.

## 🏛️ Core Tenets

### 1. Asymmetric Leverage
The modern hiring pipeline is fundamentally asymmetric. Corporations utilize automated ATS filters, standardized behavioral rubrics, and rigid technical screens at scale. This ecosystem arms the candidate with the exact same level of automated precision. By combining automated ingestion (JobPipe) with hyper-targeted, pedagogically sound simulation (ACE/DSATrain), we remove the friction and guesswork from the job hunt.

### 2. Data Sovereignty & Local-First Execution
Your career data, interview failures, and behavioral weaknesses are strictly your own. 
* **No Cloud Dependency:** The system defaults to local SQLite databases.
* **Private Inference:** First-class support for local LLMs (via Ollama) or cost-effective API routing (OpenRouter).
* **Anti-SaaS:** This tool is designed to cost pennies per hour of deep simulation (leveraging frontier models like DeepSeek or Qwen) rather than trapping users in monthly subscription models.

### 3. The Power User's "Cockpit" (Progressive Disclosure)
We do not hide complexity; we organize it. Power users want telemetry. While the initial setup and UX should respect the user's time (avoiding the "DevOps tax"), the interface will provide deep analytics—52-concept skill trees, cognitive load metrics, and spaced-repetition data. We empower the user by giving them the dials to fly the plane.

### 4. The "Khan Model" of Positive Friction
Technical interview preparation is notoriously demoralizing. The system utilizes a dual-currency economy to combat burnout:
* **Energy Points:** Rewarded for effort, persistence, and logic articulation (the "AI Mercy Loop").
* **Mastery Points:** Rewarded for perfect, optimized execution. 
* *Philosophy:* Reward the grind separately from the execution to keep users in the learning loop.

---

## 🏗️ Architectural Principles

### 1. The "Air Gap" Orchestration
To prevent unmaintainable monolithic code, the ecosystem relies on clean separation of concerns:
* **JobPipe (The Scattergun):** Handles local ingestion, resume staging, and ATS-optimized PDF generation via `pdflatex` and MCP.
* **ACE.AI + DSATrain (The Sniper Rifle):** Handles deep, high-compute interview simulation.
* *The Handoff:* The user acts as the manual API. The heavy-duty interview simulation is only spun up for high-signal opportunities, preserving compute and maintaining modularity.

### 2. Just-In-Time (JIT) JJD/Company Compilation
Instead of maintaining a fragile, static database of "Company X Questions," the system utilizes dynamic LLM extraction.
* **Messy Data In:** Users provide unstructured text (Glassdoor reviews, Job Descriptions, Engineering Blogs, Deep Research dumps).
* **Structured Data Out:** An LLM distills this into a strict JSON "Company Lens" configuration.
* **Dynamic Re-weighting:** This Lens JIT-compiles the platform—shifting the Skill Tree weights, altering the AI interviewer's behavioral STAR rubrics, and dynamically generating system design scenarios relevant to that exact company's stack.

### 3. Native Pedagogical Scaffolding
The interview simulation is not a blind code-execution loop. It is deeply tied to DSATrain’s graph-based backend. When a user fails, the system does not just provide the answer; it identifies the weakest prerequisite node and offers "Chunking Scaffolds" to build foundational understanding.

---

## 🚀 Future Ideas & Implementation Paths

* **The Single-Command Bootstrapper:** A highly robust script or Docker Compose setup that handles DB migrations, local LLM routing, and port configuration silently, minimizing the "DevOps tax" for new users.
* **Rolling Context Compression:** As interview simulations stretch beyond 45 minutes, implement an LLM-driven background summarizer to compress early conversational turns, preserving the system prompt and code diffs within tight local context windows.
* **Open-Source "Lens" Registry:** A community-driven folder of JSON "Company Lenses" (e.g., `meta-e5-infra.json`, `stripe-backend.json`) that users can simply drop into their configuration folder to instantly calibrate their simulation.