# VibeReader — AI Page Analyst & Summarizer

> **Read any webpage with AI.** Instant summaries, deep-dive analysis, smart content chunking — with 18 AI providers and EN/JA/ZH language support.

---

## Overview

VibeReader is a Chrome extension that turns your browser into an AI-powered reading assistant. It extracts the visible content from any webpage and sends it to a large language model for analysis — so you can understand long pages in seconds instead of minutes.

Unlike generic chatbots that require you to copy-paste text, VibeReader works **in-place**: open the side panel on any page, ask a question, and get AI-powered insights with full page context — no tab-switching, no pasting.

### Why VibeReader?

- **Instant Summaries** — Auto-generate bullet-point digests on every page load (EN/JA/ZH)
- **Ask Anything** — Query the current page like a document: *"What are the breaking changes?"*, *"Summarize this bug report"*
- **Smart Chunking** — Pages too long for the model? VibeReader automatically splits, analyzes, and merges — no manual intervention
- **15 Professional Templates** — DevOps RCA, Code Review, Legal Analysis, Financial Analysis, News Fact-Check, and more — all in EN/JA/ZH
- **Universal AI Support** — 18 built-in providers: Ollama, LM Studio, DeepSeek, SiliconFlow, Moonshot, Zhipu, Tongyi, OpenAI, Claude, Gemini, Groq, Mistral, xAI, OpenRouter, Together AI, and any custom endpoint
- **Zero Build Step** — Pure vanilla JS, no npm, no bundler. Load unpacked and go

---

## Key Features

| Feature | How It Works |
|---|---|
| **One-Click Page Analysis** | Extracts visible text, meta tags, title, and URL; strips ads/scripts/styles. Respects user text selection. |
| **Auto Summary Sidebar** | A collapsible sidebar appears on every new page with a bilingual digest — expand to read, collapse to hide. |
| **Binary Split Strategy** | Automatically chunks oversized content (2→4→8→16 segments) at natural boundaries, then synthesizes a unified answer. |
| **15 Prompt Templates** | Professional presets for tech, legal, finance, news, writing, product — users can create custom templates. |
| **Multi-Turn Context** | Each follow-up carries the previous AI response, enabling deeper conversational analysis. |
| **i18n (EN/JA/ZH)** | Full UI, templates, and system prompts in English, Japanese, and Chinese. |
| **Request Timer** | Live elapsed time + ETA prediction based on rolling average of past calls. |
| **Minimal UI** | Clean editorial design with shadcn/ui-inspired components, focus rings, and card patterns. |

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
│       │  user types question + selects template                     │
│       ▼                                                             │
│  [Build Messages: system prompt + context + user query]             │
│       │                                                             │
│       ▼                                                             │
│  [API Call: Ollama / OpenAI / Claude / Gemini / SiliconFlow]         │
│       │                                                             │
│       │──── Context overflow? ────┐                                 │
│       │                           ▼                                 │
│       │                  [Binary Split Strategy]                    │
│       │                  split → analyze chunks → merge             │
│       │                           │                                 │
│       ▼                           ▼                                 │
│  [Render response as formatted text with copy button]               │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      AUTO SUMMARY FLOW                              │
│                                                                     │
│  [Tab loads new URL]                                                │
│       │                                                             │
│       ▼                                                             │
│  [background.js checks autoSumEnabled]                              │
│       │                                                             │
│       ▼                                                             │
│  [Inject autosum.js → show loading sidebar]                         │
│       │                                                             │
│       ▼                                                             │
│  [Extract page content → truncate to 8K chars → call AI]            │
│       │                                                             │
│       ▼                                                             │
│  [Bilingual summary displayed in collapsible sidebar]               │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Installation

### Prerequisites

- Google Chrome (or any Chromium-based browser) with Manifest V3 support
- An AI backend (local or cloud):
  - **Ollama (Local)** — no API key needed. Install from [ollama.com](https://ollama.com) and run `ollama serve`
  - **Cloud** — API key from OpenAI, Anthropic, Google AI Studio, SiliconFlow, or any OpenAI-compatible router

### Steps

1. **Download / Clone** the `vibe_reader` folder to your local machine.

2. **Load as Unpacked Extension**
   - Open `chrome://extensions/`
   - Enable **Developer mode** (toggle in top-right)
   - Click **Load unpacked** → select the `vibe_reader` folder

3. **Configure API Settings**
   - Click the extension icon → right-click → **Options**
   - Select your **Provider**: Ollama, SiliconFlow, OpenAI, Anthropic, Google Gemini, or Custom
   - Base URL and models are auto-filled; enter **API Key** if required
   - Click **Test Connection** to verify
   - (Optional) Enable **Auto Summary**
   - (Optional) Add custom **Prompt Templates**

4. **Pin the Extension** to the toolbar for quick access.

### Notes

- No `npm install` or build step required — pure vanilla JS.
- The `icons/` folder with `icon16.png`, `icon48.png`, `icon128.png` must exist for the extension icon to display.
- All settings sync across Chrome profiles via `chrome.storage.sync`.

---

## Use Cases

### 1. Triage Production Incidents

Open a CI/CD failure page or Kubernetes event log → select the **DevOps Root Cause Analysis** template → click **TRANSMIT**. The AI identifies the root cause, ranks potential causes, and suggests validation steps.

### 2. Speed-Read Long Documentation

Reading a 20-page API reference or RFC? Enable **Auto Summary** for a hands-free bilingual overview on every page load. Or open the side panel and ask: *"What are the breaking changes in this document?"*

### 3. Analyze Bug Reports

Open a bug report on Jira, GitHub Issues, or NVBugs → the extension extracts all visible text (description, comments, metadata) → ask: *"Summarize the bug and suggest which component to investigate."*

### 4. Research & News Digests

Auto Summary provides bilingual bullet-point digests in a collapsible sidebar. For deeper analysis, open the side panel and ask follow-up questions against the page content.

### 5. Repeatable Workflows via Templates

Create a custom template (e.g., *"OWASP Top 10 Checklist"* or *"Code Review Checklist"*) in Options. Navigate to each target page → select the template → transmit. Consistent analysis every time.

### 6. Handle Extremely Long Pages

Pages with massive logs or thread discussions that exceed model context limits are handled automatically. The **Binary Split Strategy** splits content at natural boundaries (2→4→8→16 chunks), analyzes each, then merges into a unified response. Progress is shown in real time.

---

## Tech Stack

| Component | Detail |
|---|---|
| Platform | Chrome Extension, Manifest V3 |
| Language | Vanilla JavaScript (no framework, no bundler) |
| UI | Editorial minimal CSS (shadcn/ui-inspired), Inter + Noto Sans JP/SC fonts |
| i18n | English, Japanese, Chinese — UI, templates, system prompts |
| APIs | Ollama, OpenAI, Anthropic Claude, Google Gemini, SiliconFlow, any OpenAI-compatible router |
| Storage | `chrome.storage.sync` (settings persist across devices) |

---

## Version

**v1.4** · Manifest V3 · Side Panel Interface
# ask_all_ai
