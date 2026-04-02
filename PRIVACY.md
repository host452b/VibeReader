# VibeReader Privacy Policy

Last updated: 2026-03-21

---

## 1. What Data We Collect

VibeReader processes the following data **locally on your device**:

- **Page content** — visible text, title, URL, and metadata of web pages you choose to analyze
- **User preferences** — language, selected AI provider, model, prompt templates (stored in Chrome sync storage)
- **API key** — your AI provider credentials (stored **only in local device storage**, never synced to cloud)

We do **not** collect analytics, telemetry, browsing history, or any data beyond what you explicitly interact with.

## 2. How Data Is Transmitted

When you use a **cloud AI provider**, page content and your prompt are sent to the provider's API endpoint via HTTPS. This only happens when you explicitly click "Send" or enable Auto Summary.

**Local providers** (Ollama, LM Studio) process everything on your machine. No data leaves your device.

### Supported Cloud Providers

| Provider | Data Sent To | Privacy Policy |
|---|---|---|
| OpenAI | api.openai.com | [Link](https://openai.com/privacy) |
| Anthropic Claude | api.anthropic.com | [Link](https://www.anthropic.com/privacy) |
| Google Gemini | generativelanguage.googleapis.com | [Link](https://policies.google.com/privacy) |
| DeepSeek | api.deepseek.com | [Link](https://www.deepseek.com/privacy) |
| Groq | api.groq.com | [Link](https://groq.com/privacy-policy/) |
| Mistral AI | api.mistral.ai | [Link](https://mistral.ai/terms/#privacy-policy) |
| xAI Grok | api.x.ai | [Link](https://x.ai/legal/privacy-policy) |
| OpenRouter | openrouter.ai | [Link](https://openrouter.ai/privacy) |
| Together AI | api.together.xyz | [Link](https://www.together.ai/privacy) |
| SiliconFlow | api.siliconflow.cn | [Link](https://siliconflow.cn/privacy) |
| Moonshot / Kimi | api.moonshot.cn | [Link](https://www.moonshot.cn/privacy) |
| Zhipu AI | open.bigmodel.cn | [Link](https://www.zhipuai.cn/privacy) |
| Alibaba Tongyi | dashscope.aliyuncs.com | [Link](https://terms.alicdn.com/legal-agreement/terms/privacy_policy.html) |
| Doubao / Volcengine | ark.cn-beijing.volces.com | [Link](https://www.volcengine.com/docs/legal/privacy-policy) |
| Custom Endpoint | User-configured URL | User's responsibility |

## 3. Data Storage

| Data | Storage Location | Synced to Cloud? |
|---|---|---|
| API Key | chrome.storage.local | No — device only |
| Preferences (language, provider, model) | chrome.storage.sync | Yes — via Chrome Sync |
| Prompt templates | chrome.storage.sync | Yes — via Chrome Sync |
| Page content | In-memory only | No — discarded on close |

## 4. Your Control

- **Choose local-only:** Select Ollama or LM Studio — zero data leaves your device
- **Review before sending:** Use the RAW_TXT editor to inspect extracted content before any API call
- **Disable Auto Summary:** Turn off in Settings to prevent automatic API calls
- **Delete all data:** Uninstall the extension or clear extension data in Chrome settings

## 5. Third Parties

VibeReader does not use analytics, advertising, or tracking services. No data is shared with any party other than your chosen AI provider.

## 6. Contact

For questions about this policy, please open an issue on the project repository.

---

# VibeReader 隐私政策

最后更新: 2026-03-21

---

## 1. 我们收集的数据

VibeReader 在**您的本地设备上**处理以下数据：

- **页面内容** — 您选择分析的网页的可见文本、标题、URL 和元数据
- **用户偏好** — 语言、AI 服务商、模型、提示词模板（存储在 Chrome 同步存储中）
- **API 密钥** — 您的 AI 服务商凭据（**仅存储在本地设备**，绝不同步到云端）

我们**不**收集分析数据、遥测数据、浏览历史或任何您未明确交互的数据。

## 2. 数据如何传输

当您使用**云端 AI 服务商**时，页面内容和提示词会通过 HTTPS 发送到服务商的 API 端点。这仅在您点击"发送"或启用自动摘要时发生。

**本地服务商**（Ollama、LM Studio）在您的机器上处理所有内容，数据不会离开您的设备。

## 3. 数据存储

| 数据 | 存储位置 | 是否同步到云端 |
|---|---|---|
| API 密钥 | chrome.storage.local | 否 — 仅限本机 |
| 偏好设置（语言、服务商、模型） | chrome.storage.sync | 是 — 通过 Chrome 同步 |
| 提示词模板 | chrome.storage.sync | 是 — 通过 Chrome 同步 |
| 页面内容 | 仅内存 | 否 — 关闭即销毁 |

## 4. 您的控制权

- **选择纯本地模式:** 选择 Ollama 或 LM Studio — 数据完全不离开设备
- **发送前审查:** 使用 RAW_TXT 编辑器在 API 调用前检查提取的内容
- **禁用自动摘要:** 在设置中关闭以防止自动 API 调用
- **删除所有数据:** 卸载扩展或在 Chrome 设置中清除扩展数据

## 5. 第三方

VibeReader 不使用任何分析、广告或追踪服务。除您选择的 AI 服务商外，不与任何第三方共享数据。

## 6. 联系方式

如对本政策有疑问，请在项目仓库中创建 issue。
