# Chrome Web Store 提交材料

> 填写 Chrome Web Store Developer Dashboard 时直接复制粘贴以下内容。

---

## 1. Store Listing — 基本信息

### Name (名称)
```
VibeReader — AI Page Analyst & Summarizer
```

### Summary (简短描述, ≤132 字符)
```
Read any webpage with AI. Local-first via Ollama, or cloud (OpenAI, Claude, Gemini). Auto summaries, smart chunking, templates.
```

### Description (详细描述)
```
VibeReader is an AI-powered reading assistant that extracts and analyzes webpage content in seconds. Run it entirely on your machine with Ollama, or connect to 17+ cloud AI providers.

KEY FEATURES

• One-Click Page Analysis — Extract visible text, meta tags, and structure from any webpage
• Instant Auto Summaries — Get bullet-point digests automatically when you open a page
• Ask Anything — Query pages like documents: "What are the breaking changes?", "Summarize this report"
• Multi-Tab Context — Merge content from multiple tabs for cross-page analysis
• Smart Chunking — Automatically splits oversized content into optimal segments
• 15 Professional Templates — DevOps RCA, Code Review, Security Audit, Legal Analysis, Financial Analysis, and more
• RAW_TXT Editor — Inspect and edit extracted content before sending, with syntax highlighting and search
• Multi-Turn Context — Follow-up questions carry conversation history for deeper analysis
• Request Timer — Live elapsed time with ETA prediction
• i18n — Full UI in English, Japanese, and Chinese

SUPPORTED AI PROVIDERS (17+)

Local (zero data leaves your device):
  Ollama, LM Studio

Cloud:
  OpenAI, Anthropic Claude, Google Gemini, DeepSeek, Groq, Mistral AI, xAI Grok, OpenRouter, Together AI, SiliconFlow, Moonshot/Kimi, Zhipu AI, Alibaba Tongyi, Doubao/Volcengine

Or connect any OpenAI/Anthropic-compatible endpoint.

PRIVACY-FIRST DESIGN

• Local-first: Ollama and LM Studio process everything on your machine
• API keys stored only on your local device — never synced to cloud
• No analytics, no tracking, no telemetry
• You choose when and where your data is sent
• Full transparency: review extracted content in the RAW_TXT editor before any API call

USE CASES

• Triage production incidents with DevOps RCA template
• Speed-read long documentation with auto-summary
• Analyze bug reports and get root cause analysis
• Cross-tab research by merging multiple pages
• Create custom templates for repeatable workflows

Open source. No account required. No subscriptions.
```

### Category (分类)
```
Productivity
```

### Language (语言)
```
English, Japanese, Chinese (Simplified)
```

---

## 2. Permission Justifications — 权限说明

> Developer Dashboard → Privacy tab → "Permission justifications"

### `storage`
```
Required to save user preferences (language, AI provider, model selection, prompt templates) across browser sessions. API keys are stored in local-only storage and never synced.
```

### `activeTab`
```
Required to access the content of the currently active tab when the user clicks the extension icon. Used to extract visible text, page title, URL, and metadata for AI analysis.
```

### `scripting`
```
Required to inject the content extraction script (content.js) and auto-summary sidebar (autosum.js) into web pages. These scripts extract visible text from the page DOM for AI analysis.
```

### `sidePanel`
```
Required to display the main VibeReader interface as a Chrome side panel, providing a persistent workspace for page analysis alongside the browsed content.
```

### `tabs`
```
Required for the multi-tab context feature, which allows users to select and merge content from multiple open tabs for cross-page AI analysis.
```

### Host permissions: `https://*/*` and `http://*/*`
```
Required because the extension needs to extract text content from any webpage the user chooses to analyze. The extension only accesses page content when explicitly triggered by the user (clicking Send or enabling Auto Summary). HTTP access is needed for local development servers (localhost) used with Ollama and LM Studio.
```

---

## 3. Privacy Practices — 数据使用披露

> Developer Dashboard → Privacy tab → "Privacy practices"

### Does your extension collect or use user data?
```
Yes
```

### Data type: Web History
```
No — We do not collect or store browsing history. Page URLs are only included in the AI request payload when the user explicitly triggers analysis.
```

### Data type: Website Content
```
Yes — Collected

Purpose: Functionality
  The extension extracts visible text content from web pages for AI-powered analysis and summarization. Content is sent to the user's selected AI provider only when explicitly triggered.

Transferred to third parties:
  Yes — to the AI provider selected by the user (e.g., OpenAI, Anthropic, Google). When using local providers (Ollama, LM Studio), no data is transferred.

Not sold to third parties.
Retention: Not retained by the extension. Content is held in memory only during the active session and discarded when the side panel is closed.
```

### Data type: Personal Communications
```
No
```

### Data type: Authentication Information
```
Yes — Collected

Purpose: Functionality
  API keys for AI providers are stored locally on the device (chrome.storage.local) to authenticate requests. Keys are never synced to cloud storage.

Not transferred to third parties (keys are sent directly to the user's chosen AI provider endpoint via HTTPS).
Not sold to third parties.
```

### Data type: User Activity
```
No — We do not track user activity, clicks, or usage patterns. No analytics or telemetry.
```

### Does your extension use remote code?
```
No — All JavaScript is bundled within the extension package. No remote scripts are loaded.
```

### Does your extension load external resources?
```
No — All fonts use system font stacks. No external CDN, fonts, or stylesheet resources are loaded.
```

---

## 4. Privacy Policy URL

> 可选择以下方案之一：

### 方案 A：使用扩展内置页面
```
chrome-extension://<YOUR_EXTENSION_ID>/privacy.html
```
注意：提交后从 Developer Dashboard 获取扩展 ID 填入。

### 方案 B：托管到 GitHub Pages
将 `privacy.html` 部署到 GitHub Pages，使用类似以下 URL：
```
https://<username>.github.io/vibe-reader/privacy.html
```
推荐方案 B，因为 Chrome Web Store 要求隐私政策 URL 可公开访问。

---

## 5. Screenshots — 截图要求

> 需要至少 1 张，最多 5 张。推荐尺寸：1280×800 或 640×400。

### 建议截图内容：
1. **主界面** — Side Panel 打开状态，展示聊天界面和页面分析结果
2. **Auto Summary** — 页面上的自动摘要侧边栏
3. **RAW_TXT Editor** — 展示原始文本编辑器和搜索功能
4. **Multi-Tab Picker** — 多标签页选择器浮窗
5. **Settings** — 设置页面，展示 17+ 提供商和模板管理

### 截图生成方法：
```bash
# 在 Chrome 中加载扩展后，使用 DevTools 截图：
# 1. 打开扩展 Side Panel
# 2. Cmd+Shift+P → "Capture screenshot" (或 "Capture full size screenshot")
# 3. 调整窗口大小为 1280x800 后截图
```

---

## 6. Promotional Tile — 宣传图（可选）

### Small tile: 440×280
### Large tile: 920×680
### Marquee: 1400×560

建议内容：
- 扩展 logo + 名称
- "17+ AI Providers | Local-First | Auto Summary"
- 简洁的 UI 截图作为背景
