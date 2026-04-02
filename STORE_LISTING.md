# Chrome Web Store 提交材料

> 填写 Chrome Web Store Developer Dashboard 时直接复制粘贴以下内容。
> 扩展 ID：`ebpfolmileibaohakcjfilkboaakknba`

---

## 1. Store Listing — 商品详情

### 标题（软件包中已包含，无需修改）
```
VibeReader — AI Webpage Reader, Summarizer & Analyst
```

### 摘要（软件包中已包含，无需修改）
```
Read any webpage with AI. Local-first via Ollama, or cloud (OpenAI, Claude, Gemini). Auto summaries, smart chunking, templates.
```

### 说明（复制到"说明"文本框）
```
VibeReader is an AI-powered reading assistant that extracts and analyzes webpage content in seconds. Read any webpage with AI — run it entirely on your machine with Ollama or LM Studio, or connect to 31 cloud AI providers.

KEY FEATURES

• One-Click Page Analysis — Extract visible text, meta tags, and structure from any webpage
• Instant Auto Summaries — Get bullet-point digests automatically when you open a page
• Ask Anything — Query pages like documents: "What are the breaking changes?", "Summarize this report"
• Multi-Tab Context — Merge content from multiple tabs for cross-page analysis
• Smart Chunking — Automatically splits oversized content into optimal segments
• 15 Professional Templates — DevOps RCA, Code Review, Security Audit, Legal Analysis, Financial Analysis, and more
• RAW_TXT Editor — Inspect and edit extracted content before sending, with syntax highlighting and search
• Multi-Turn Context — Follow-up questions carry conversation history for deeper analysis
• 4 API Formats — OpenAI Chat Completions, Anthropic Messages, OpenAI Responses, Azure OpenAI
• i18n — Full UI in English, Japanese, and Chinese

SUPPORTED AI PROVIDERS (31)

Local (zero data leaves your device):
  Ollama, LM Studio

China Cloud:
  DeepSeek, SiliconFlow, Moonshot/Kimi, Zhipu AI, Alibaba Tongyi, Doubao/Volcengine

International Cloud:
  OpenAI, Anthropic Claude, Google Gemini, Groq, Mistral AI, xAI Grok

Routers & Aggregators:
  OpenRouter (200+ models), Together AI

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
• Security audit web applications with OWASP template
• Review legal documents and compare contract terms

Open source (MIT License). No account required. No subscriptions.
```

### 类别
```
Productivity
```

### 语言
```
English, Japanese, Chinese (Simplified)
```

---

## 2. 图片资源

### 商店图标 (128x128)
```
store-assets/store-icon-128x128.png
```

### 截图 (1280x800, 最少1张最多5张)
```
store-assets/screenshot-1-chat.png          — 主界面：AI 页面分析
store-assets/screenshot-2-autosum.png       — 自动摘要侧边栏
store-assets/screenshot-3-raw-editor.png    — RAW_TXT 编辑器
store-assets/screenshot-4-tab-picker.png    — 多标签页选择器
store-assets/screenshot-5-settings.png      — 设置页面
```

### 小型宣传图块 (440x280)
```
store-assets/promo-small-440x280.png
```

### 顶部宣传图块 (1400x560)
```
store-assets/promo-marquee-1400x560.png
```

---

## 3. Privacy — 隐私权

### 权限说明

> Developer Dashboard → 隐私权 → "权限说明"

#### `storage`
```
Required to save user preferences (language, AI provider, model selection, prompt templates) across browser sessions. API keys are stored in local-only storage and never synced.
```

#### `activeTab`
```
Required to access the content of the currently active tab when the user clicks the extension icon. Used to extract visible text, page title, URL, and metadata for AI analysis.
```

#### `scripting`
```
Required to inject the content extraction script (content.js) and auto-summary sidebar (autosum.js) into web pages. These scripts extract visible text from the page DOM for AI analysis.
```

#### `sidePanel`
```
Required to display the main VibeReader interface as a Chrome side panel, providing a persistent workspace for page analysis alongside the browsed content.
```

#### `tabs`
```
Required for the multi-tab context feature, which allows users to select and merge content from multiple open tabs for cross-page AI analysis.
```

#### Host permissions: `https://*/*` and `http://*/*`
```
Required because the extension needs to extract text content from any webpage the user chooses to analyze. The extension only accesses page content when explicitly triggered by the user (clicking Send or enabling Auto Summary). HTTP access is needed for local development servers (localhost) used with Ollama and LM Studio.
```

### 数据使用披露

> Developer Dashboard → 隐私权 → "隐私惯例"

#### 您的扩展程序是否会收集或使用用户数据？
```
是
```

#### 数据类型：网络历史记录
```
否 — 我们不会收集或存储浏览历史。网页 URL 仅在用户明确触发分析时包含在 AI 请求中。
```

#### 数据类型：网站内容
```
是 — 已收集

用途：功能
  扩展提取网页可见文本用于 AI 分析和摘要。内容仅在用户明确触发时发送到所选 AI 服务商。

是否传输给第三方：
  是 — 传输给用户选择的 AI 服务商（如 OpenAI、Anthropic、Google）。使用本地服务商（Ollama、LM Studio）时不传输任何数据。

不会出售给第三方。
保留期限：扩展不保留数据。内容仅在活跃会话期间保存在内存中，关闭侧边栏后即丢弃。
```

#### 数据类型：个人通信
```
否
```

#### 数据类型：身份验证信息
```
是 — 已收集

用途：功能
  AI 服务商的 API 密钥存储在设备本地（chrome.storage.local）用于请求认证。密钥从不同步到云端存储。

不会传输给第三方（密钥通过 HTTPS 直接发送到用户选择的 AI 服务商端点）。
不会出售给第三方。
```

#### 数据类型：用户活动
```
否 — 我们不追踪用户活动、点击或使用模式。无分析、无遥测。
```

#### 您的扩展程序是否使用远程代码？
```
否 — 所有 JavaScript 均打包在扩展包内。不加载远程脚本。
```

### 隐私政策 URL
```
chrome-extension://ebpfolmileibaohakcjfilkboaakknba/privacy.html
```

---

## 4. 分发

### 公开范围
```
公开
```

### 分发地区
```
所有地区
```

---

## 5. 成人内容
```
否 — 不包含少儿不宜的内容
```

---

## 6. Dashboard 填写步骤速查

1. **商品详情** → 说明：粘贴上面的 Description 内容
2. **商品详情** → 类别：选 `Productivity`
3. **商品详情** → 语言：选 `English`、`Japanese`、`Chinese (Simplified)`
4. **商品详情** → 图片资源：上传商店图标 + 5 张截图 + 宣传图块
5. **商品详情** → 成人内容：选"否"
6. **隐私权** → 权限说明：逐个粘贴上面每个权限的说明
7. **隐私权** → 隐私惯例：按上面数据类型逐项填写
8. **隐私权** → 隐私政策 URL：粘贴上面的 chrome-extension:// URL
9. **分发** → 公开范围：选"公开"
10. **分发** → 所有地区
11. **提交审核**
