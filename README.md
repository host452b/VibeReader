# VibeReader — AI Page Analyst & Summarizer

> **Read any webpage with AI.** Instant summaries, deep-dive analysis, smart content chunking — with 17 AI providers and EN/JA/ZH language support.

---

## Overview

VibeReader is a Chrome extension that turns your browser into an AI-powered reading assistant. It extracts the visible content from any webpage and sends it to a large language model for analysis — so you can understand long pages in seconds instead of minutes.

Unlike generic chatbots that require you to copy-paste text, VibeReader works **in-place**: open the side panel on any page, ask a question, and get AI-powered insights with full page context — no tab-switching, no pasting.

### Why VibeReader?

- **Instant Summaries** — Auto-generate bullet-point digests on every page load (EN/JA/ZH)
- **Ask Anything** — Query the current page like a document: *"What are the breaking changes?"*, *"Summarize this bug report"*
- **Multi-Tab Context** — Load content from multiple tabs at once via a floating tab picker, merged with page separators
- **Smart Chunking** — Pages too long for the model? VibeReader automatically splits, analyzes, and merges — no manual intervention
- **15 Professional Templates** — DevOps RCA, Code Review, Security Audit, Legal Analysis, Financial Analysis, News Fact-Check, and more — all in EN/JA/ZH
- **17 AI Providers** — Ollama, LM Studio, DeepSeek, SiliconFlow, Moonshot, Zhipu, Tongyi, Doubao, OpenAI, Claude, Gemini, Groq, Mistral, xAI, OpenRouter, Together AI, plus any custom endpoint
- **Zero Build Step** — Pure vanilla JS, no npm, no bundler. Load unpacked and go

---

## Key Features

| Feature | How It Works |
|---|---|
| **One-Click Page Analysis** | Extracts visible text, meta tags, title, and URL; strips ads/scripts/styles. Respects user text selection. |
| **Multi-Tab Context** | [+ Add Page] opens a floating tab picker — select multiple tabs, content is extracted in parallel with inline fallback, then merged with `══════ Page N/M ══════` separators. |
| **Auto Summary Sidebar** | A collapsible sidebar injected on every new page load with a localized digest — expand to read, collapse to hide. Retry button on failure. |
| **RAW_TXT Editor** | Editable page context panel with syntax highlighting, position markers (10k/20k/...), text search with prev/next navigation, and live stats (line count + token estimate). |
| **Binary Split Strategy** | Automatically chunks oversized content (2→4→8→16 segments) at natural paragraph/sentence boundaries, then synthesizes a unified answer. Visual progress bar with per-chunk timing and ETA. |
| **15 Prompt Templates** | Professional presets for tech, legal, finance, news, research, writing, product, data — users can create custom templates in Options. |
| **Multi-Turn Context** | Each follow-up carries the previous AI response, enabling deeper conversational analysis. |
| **3 API Formats** | OpenAI Chat Completions, Anthropic Messages, and OpenAI Responses API — auto-routed by provider. |
| **Request Timer** | Live elapsed time + ETA prediction based on rolling average of past 10 calls. |
| **i18n (EN/JA/ZH)** | Full UI labels, templates, system prompts, and auto-summary prompts in English, Japanese, and Chinese. |
| **HUD Status Indicator** | Cycles through STANDBY → IDLE → READY → SYS:OK → AWAIT during idle; shows LIVE with VU meter animation during API calls; DONE on completion. |
| **Retry with Backoff** | Transient errors (429/5xx/network) trigger exponential retry (2s→4s→8s) with UI feedback. |
| **Custom System Prompt** | Configurable system prompt with dynamic placeholders (page title, core content, timestamp, user question) — auto-filled at runtime. |

---

## How It Works

```
┌─────────────────────────────────────────────────────────────────────┐
│                      MANUAL ANALYSIS FLOW                           │
│                                                                     │
│  [User clicks extension]                                            │
│       │                                                             │
│       ▼                                                             │
│  [Side Panel opens] ──→ [content.js injected into active tab]       │
│       │                        │                                    │
│       │  sends "getPageContent"│  returns visible text + meta       │
│       ▼                        ▼                                    │
│  [Page Context loaded into RAW_TXT editor]                          │
│       │                                                             │
│       ├── [+ Add Page] → floating tab picker                        │
│       │       │  select tabs → parallel extraction                  │
│       │       │  inline fallback → merge with separators            │
│       │       ▼                                                     │
│       │  [Multi-tab context in RAW_TXT]                             │
│       │                                                             │
│       │  user types question + selects template                     │
│       ▼                                                             │
│  [Build Messages: system prompt + full context + user query]        │
│       │                                                             │
│       ▼                                                             │
│  [API Call: route by provider + format]                              │
│       │                                                             │
│       │──── Context overflow? ────┐                                 │
│       │                           ▼                                 │
│       │                  [Binary Split Strategy]                    │
│       │                  split at natural boundaries → analyze      │
│       │                  chunks sequentially → synthesize            │
│       │                           │                                 │
│       ▼                           ▼                                 │
│  [Render response with copy button + root_cause highlights]         │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      AUTO SUMMARY FLOW                              │
│                                                                     │
│  [Tab loads new URL]                                                │
│       │                                                             │
│       ▼                                                             │
│  [background.js checks autoSumEnabled + URL change]                 │
│       │                                                             │
│       ▼                                                             │
│  [Inject autosum.js + autosum.css → show loading sidebar]           │
│       │                                                             │
│       ▼                                                             │
│  [Extract page content → truncate to 8K chars → call AI]            │
│       │                                                             │
│       ▼                                                             │
│  [Localized summary displayed in collapsible sidebar]               │
│  [Retry button on failure]                                          │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Installation

### Prerequisites

- Google Chrome (or any Chromium-based browser) with Manifest V3 support
- An AI backend (local or cloud):
  - **Ollama (Local)** — no API key needed. Install from [ollama.com](https://ollama.com) and run `ollama serve`
  - **LM Studio (Local)** — no API key needed. Download models inside LM Studio, then start the server
  - **Cloud** — API key from any supported provider (DeepSeek, SiliconFlow, OpenAI, Anthropic, Google AI Studio, etc.)

### Steps

1. **Download / Clone** the `vibe_reader` folder to your local machine.

2. **Load as Unpacked Extension**
   - Open `chrome://extensions/`
   - Enable **Developer mode** (toggle in top-right)
   - Click **Load unpacked** → select the `vibe_reader` folder

3. **Configure API Settings**
   - Click the extension icon → right-click → **Options**
   - Select your **Provider** (local or cloud)
   - Base URL and models are auto-filled per provider; enter **API Key** if required
   - Choose **API Format** if using a custom endpoint (OpenAI / Anthropic / Responses)
   - Click **Test Connection** to verify
   - (Optional) Enable **Auto Summary**
   - (Optional) Add custom **Prompt Templates**
   - (Optional) Edit the **Default System Prompt**

4. **Pin the Extension** to the toolbar for quick access.

### Notes

- No `npm install` or build step required — pure vanilla JS.
- The `icons/` folder with `icon16.png`, `icon48.png`, `icon128.png` must exist for the extension icon to display.
- All settings sync across Chrome profiles via `chrome.storage.sync`.

---

## Supported AI Providers

| Category | Providers |
|---|---|
| **Local** | Ollama, LM Studio |
| **China Cloud** | DeepSeek, SiliconFlow, Moonshot / Kimi, Zhipu AI, Alibaba Tongyi (DashScope), Doubao / Volcengine |
| **International Cloud** | OpenAI, Anthropic Claude, Google Gemini, Groq, Mistral AI, xAI Grok |
| **Routers / Aggregators** | OpenRouter (200+ models), Together AI |
| **Custom** | Any OpenAI / Anthropic / Responses API compatible endpoint |

---

## Prompt Templates (15)

All templates are fully localized in EN/JA/ZH:

| Template | Use Case |
|---|---|
| DevOps Root Cause | SRE incident triage with `<root_cause>` highlighting |
| Code Review | Bug, security, performance, readability analysis |
| Tech Explainer | Explain technical content for a broad audience |
| Security Audit | OWASP Top 10 / CWE review |
| Legal Document Analysis | Contract, ToS, policy review |
| Legal Clause Comparison | Compare terms against market standards |
| Financial Analysis | Key metrics, trends, red flags, investment thesis |
| Business Strategy Brief | Management consulting framework |
| News Fact-Check & Bias | Source quality, bias indicators, reliability rating |
| Research Paper Critique | Peer review: methodology, findings, reproducibility |
| Copywriting Audit | Message clarity, persuasion, rewrite suggestions |
| Translation Review | EN↔CN / EN↔JA translation + terminology |
| Product Analysis | Value proposition, UX, competitive positioning |
| Meeting Notes → Action Items | Extract decisions, owners, deadlines |
| Data Insight Extraction | Patterns, statistical significance, follow-up analysis |

---

## Use Cases

### 1. Triage Production Incidents

Open a CI/CD failure page or Kubernetes event log → select the **DevOps Root Cause** template → click **SEND**. The AI identifies the root cause, ranks potential causes, and suggests validation steps.

### 2. Speed-Read Long Documentation

Reading a 20-page API reference or RFC? Enable **Auto Summary** for a hands-free localized overview on every page load. Or open the side panel and ask: *"What are the breaking changes in this document?"*

### 3. Analyze Bug Reports

Open a bug report on Jira, GitHub Issues, or NVBugs → the extension extracts all visible text (description, comments, metadata) → ask: *"Summarize the bug and suggest which component to investigate."*

### 4. Cross-Tab Research

Need to compare information across multiple pages? Click **[+ Add Page]** to open the tab picker → select the tabs you want to analyze → their content is merged into a single context. Ask: *"Compare the approaches described in these pages."*

### 5. Repeatable Workflows via Templates

Create a custom template (e.g., *"OWASP Top 10 Checklist"* or *"Code Review Checklist"*) in Options. Navigate to each target page → select the template → send. Consistent analysis every time.

### 6. Handle Extremely Long Pages

Pages with massive logs or thread discussions that exceed model context limits are handled automatically. The **Binary Split Strategy** splits content at natural boundaries (2→4→8→16 chunks), analyzes each, then merges into a unified response. A visual progress bar shows per-chunk timing and estimated time remaining.

---

## File Structure

```
vibe_reader/
├── manifest.json          # Chrome extension manifest (MV3)
├── background.js          # Service worker: auto summary, tab URL tracking
├── content.js             # Content script: extract visible page text
├── popup.html             # Side panel UI (main interface)
├── popup.js               # Side panel logic: chat, split strategy, raw editor
├── popup.css              # Side panel styles
├── options.html           # Settings page UI
├── options.js             # Settings page logic: provider config, templates
├── api-utils.js           # Shared API layer: 17 providers, 3 formats
├── i18n.js                # i18n: UI strings, templates, prompts (EN/JA/ZH)
├── autosum.js             # Auto summary: sidebar injection + display
├── autosum.css            # Auto summary sidebar styles
├── tab-picker.html        # Multi-tab picker floating window
├── tab-picker.js          # Tab picker logic: list, select, load
├── build.sh               # Build & lint script (validate, check, package)
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```

---

## Build & Lint

A single `build.sh` handles validation, linting, and packaging. No external tools required beyond `bash`, `node`, and optionally `jq`.

```bash
# full build: validate + lint + create zip
./build.sh

# dry run: validate + lint only, no zip
./build.sh --check

# lint only
./build.sh --lint
```

The build pipeline runs 9 checks in sequence:

| Step | What It Does |
|---|---|
| 1. File check | Verify all required source files exist and are non-empty |
| 2. Manifest schema | Validate `manifest_version`, `name`, `description` length, `service_worker` |
| 3. Cross-reference | Ensure every file referenced in `manifest.json` actually exists on disk |
| 4. JS syntax | Run `node --check` on all `.js` files |
| 5. JSON validation | Parse `manifest.json` with `jq` or `python3` |
| 6. CSS brace balance | Count `{` vs `}` in all `.css` files |
| 7. HTML structure | Check DOCTYPE, charset meta, script tag pairing |
| 8. Code hygiene | Scan for `console.log`, `debugger`, `eval()`, hardcoded API keys, `TODO/FIXME` |
| 9. File size sanity | Warn if any single file > 500 KB or total > 2 MB |

On success, outputs `VibeReader-v{version}.zip` (version read from `manifest.json`). The zip excludes `.git`, `.DS_Store`, `README.md`, `build.sh`, and existing zip files.

---

## Tech Stack

| Component | Detail |
|---|---|
| Platform | Chrome Extension, Manifest V3, Side Panel API |
| Language | Vanilla JavaScript (no framework, no bundler) |
| UI | Editorial minimal CSS (shadcn/ui-inspired), Inter + Noto Sans JP/SC fonts |
| i18n | English, Japanese, Chinese — UI, templates, system prompts, auto-summary prompts |
| API Formats | OpenAI Chat Completions, Anthropic Messages, OpenAI Responses |
| Providers | 16 built-in + custom endpoint (local-first: Ollama, LM Studio) |
| Storage | `chrome.storage.sync` (settings persist across devices) |
| Performance | Debounced rendering, virtual overlay, GPU-compositable scroll sync, rAF-batched scroll |

---

## Version

**v1.4** · Manifest V3 · Side Panel Interface
