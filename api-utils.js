// shared API utility functions for VibeReader
// loaded by both background.js (importScripts) and popup.html (<script>)

// provider presets: local-first, then China cloud, then international, then routers
var API_PROVIDERS = {

  // ── local ──────────────────────────────────────────────────
  ollama: {
    label: 'Ollama',
    baseUrl: 'http://localhost:11434/v1',
    apiFormat: 'openai',
    requiresKey: false,
    models: [
      'llama3.2',
      'qwen2.5:7b',
      'deepseek-r1:8b',
      'mistral',
      'gemma2:9b',
      'phi3:mini'
    ],
    defaultModel: 'llama3.2',
    hint: 'Runs entirely on your machine. Install from ollama.com and run "ollama serve".'
  },
  lmstudio: {
    label: 'LM Studio',
    baseUrl: 'http://localhost:1234/v1',
    apiFormat: 'openai',
    requiresKey: false,
    models: [],
    defaultModel: '',
    hint: 'Local inference GUI. Download models inside LM Studio, then start the server.'
  },
  jan: {
    label: 'Jan',
    baseUrl: 'http://localhost:1337/v1',
    apiFormat: 'openai',
    requiresKey: false,
    models: [],
    defaultModel: '',
    hint: 'Open-source local AI. Download from jan.ai, load a model, then start the server.'
  },
  gpt4all: {
    label: 'GPT4All',
    baseUrl: 'http://localhost:4891/v1',
    apiFormat: 'openai',
    requiresKey: false,
    models: [],
    defaultModel: '',
    hint: 'Privacy-first local AI. Download from gpt4all.io, enable API server in settings.'
  },
  localai: {
    label: 'LocalAI',
    baseUrl: 'http://localhost:8080/v1',
    apiFormat: 'openai',
    requiresKey: false,
    models: [],
    defaultModel: '',
    hint: 'Self-hosted OpenAI-compatible server. See localai.io for setup instructions.'
  },
  vllm: {
    label: 'vLLM',
    baseUrl: 'http://localhost:8000/v1',
    apiFormat: 'openai',
    requiresKey: false,
    models: [],
    defaultModel: '',
    hint: 'High-throughput serving engine. See docs.vllm.ai for setup instructions.'
  },
  textgenwebui: {
    label: 'text-generation-webui',
    baseUrl: 'http://localhost:5000/v1',
    apiFormat: 'openai',
    requiresKey: false,
    models: [],
    defaultModel: '',
    hint: 'Gradio web UI for LLMs. Enable --api flag. See github.com/oobabooga/text-generation-webui'
  },

  // ── china cloud ────────────────────────────────────────────
  deepseek: {
    label: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/v1',
    apiFormat: 'openai',
    requiresKey: true,
    models: [
      'deepseek-chat',
      'deepseek-reasoner'
    ],
    defaultModel: 'deepseek-chat',
    hint: 'Get your API key from platform.deepseek.com'
  },
  siliconflow: {
    label: 'SiliconFlow',
    baseUrl: 'https://api.siliconflow.cn/v1',
    apiFormat: 'openai',
    requiresKey: true,
    models: [
      'Qwen/Qwen2.5-72B-Instruct',
      'deepseek-ai/DeepSeek-V3',
      'deepseek-ai/DeepSeek-R1',
      'Qwen/Qwen2.5-7B-Instruct',
      'THUDM/glm-4-9b-chat'
    ],
    defaultModel: 'Qwen/Qwen2.5-7B-Instruct',
    hint: 'AI model aggregator. Get your key from siliconflow.cn'
  },
  moonshot: {
    label: 'Moonshot / Kimi',
    baseUrl: 'https://api.moonshot.cn/v1',
    apiFormat: 'openai',
    requiresKey: true,
    models: [
      'moonshot-v1-128k',
      'moonshot-v1-32k',
      'moonshot-v1-8k'
    ],
    defaultModel: 'moonshot-v1-32k',
    hint: 'Get your key from platform.moonshot.cn'
  },
  zhipu: {
    label: 'Zhipu AI',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    apiFormat: 'openai',
    requiresKey: true,
    models: [
      'glm-4-plus',
      'glm-4-flash',
      'glm-4-long',
      'glm-4-air'
    ],
    defaultModel: 'glm-4-flash',
    hint: 'Get your key from open.bigmodel.cn'
  },
  dashscope: {
    label: 'Alibaba Tongyi',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    apiFormat: 'openai',
    requiresKey: true,
    models: [
      'qwen-max',
      'qwen-plus',
      'qwen-turbo',
      'qwen-long'
    ],
    defaultModel: 'qwen-turbo',
    hint: 'DashScope OpenAI-compatible mode. Get your key from dashscope.console.aliyun.com'
  },
  doubao: {
    label: 'Doubao / Volcengine',
    baseUrl: 'https://ark.cn-beijing.volces.com/api/v3',
    apiFormat: 'openai',
    requiresKey: true,
    models: [],
    defaultModel: '',
    hint: 'Use your Ark endpoint ID as the model name. Get your key from console.volcengine.com'
  },

  // ── international cloud ────────────────────────────────────
  cohere: {
    label: 'Cohere',
    baseUrl: 'https://api.cohere.com/compatibility/v1',
    apiFormat: 'openai',
    requiresKey: true,
    models: [
      'command-r-plus',
      'command-r',
      'command-a-03-2025'
    ],
    defaultModel: 'command-r',
    hint: 'RAG-optimized models. Get your key from dashboard.cohere.com'
  },
  perplexity: {
    label: 'Perplexity',
    baseUrl: 'https://api.perplexity.ai',
    apiFormat: 'openai',
    requiresKey: true,
    models: [
      'sonar-pro',
      'sonar',
      'sonar-reasoning-pro',
      'sonar-reasoning'
    ],
    defaultModel: 'sonar',
    hint: 'Search-augmented AI. Get your key from perplexity.ai/settings/api'
  },
  ai21: {
    label: 'AI21 Labs',
    baseUrl: 'https://api.ai21.com/studio/v1',
    apiFormat: 'openai',
    requiresKey: true,
    models: [
      'jamba-1.5-large',
      'jamba-1.5-mini'
    ],
    defaultModel: 'jamba-1.5-mini',
    hint: 'Jamba model family. Get your key from studio.ai21.com'
  },
  fireworks: {
    label: 'Fireworks AI',
    baseUrl: 'https://api.fireworks.ai/inference/v1',
    apiFormat: 'openai',
    requiresKey: true,
    models: [
      'accounts/fireworks/models/firefunction-v2',
      'accounts/fireworks/models/llama-v3p1-70b-instruct',
      'accounts/fireworks/models/llama-v3p1-8b-instruct'
    ],
    defaultModel: 'accounts/fireworks/models/llama-v3p1-8b-instruct',
    hint: 'Fast open-model inference. Get your key from fireworks.ai/account/api-keys'
  },
  cerebras: {
    label: 'Cerebras',
    baseUrl: 'https://api.cerebras.ai/v1',
    apiFormat: 'openai',
    requiresKey: true,
    models: [
      'llama-3.3-70b',
      'llama-4-scout-17b-16e'
    ],
    defaultModel: 'llama-3.3-70b',
    hint: 'Ultra-fast wafer-scale inference. Get your key from cloud.cerebras.ai'
  },
  lambda: {
    label: 'Lambda',
    baseUrl: 'https://api.lambdalabs.com/v1',
    apiFormat: 'openai',
    requiresKey: true,
    models: [
      'llama-3.3-70b-instruct'
    ],
    defaultModel: 'llama-3.3-70b-instruct',
    hint: 'GPU cloud + inference API. Get your key from cloud.lambda.ai'
  },
  replicate: {
    label: 'Replicate',
    baseUrl: 'https://openai-proxy.replicate.com/v1',
    apiFormat: 'openai',
    requiresKey: true,
    models: [
      'meta/llama-3-70b-instruct'
    ],
    defaultModel: 'meta/llama-3-70b-instruct',
    hint: 'Open-source model hosting. Get your key from replicate.com/account/api-tokens'
  },
  openai: {
    label: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    apiFormat: 'openai',
    requiresKey: true,
    models: [
      'gpt-4o',
      'gpt-4o-mini',
      'o1-mini',
      'gpt-3.5-turbo'
    ],
    defaultModel: 'gpt-4o-mini',
    hint: 'Get your key from platform.openai.com'
  },
  anthropic: {
    label: 'Anthropic Claude',
    baseUrl: 'https://api.anthropic.com/v1',
    apiFormat: 'anthropic',
    requiresKey: true,
    models: [
      'claude-sonnet-4-20250514',
      'claude-3-5-haiku-20241022',
      'claude-3-opus-20240229'
    ],
    defaultModel: 'claude-sonnet-4-20250514',
    hint: 'Get your key from console.anthropic.com'
  },
  gemini: {
    label: 'Google Gemini',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
    apiFormat: 'openai',
    requiresKey: true,
    models: [
      'gemini-2.0-flash',
      'gemini-1.5-pro',
      'gemini-1.5-flash'
    ],
    defaultModel: 'gemini-2.0-flash',
    hint: 'OpenAI-compatible endpoint. Get your key from aistudio.google.com'
  },
  groq: {
    label: 'Groq',
    baseUrl: 'https://api.groq.com/openai/v1',
    apiFormat: 'openai',
    requiresKey: true,
    models: [
      'llama-3.3-70b-versatile',
      'mixtral-8x7b-32768',
      'gemma2-9b-it'
    ],
    defaultModel: 'llama-3.3-70b-versatile',
    hint: 'Ultra-fast inference. Get your key from console.groq.com'
  },
  mistral: {
    label: 'Mistral AI',
    baseUrl: 'https://api.mistral.ai/v1',
    apiFormat: 'openai',
    requiresKey: true,
    models: [
      'mistral-large-latest',
      'mistral-small-latest',
      'open-mistral-nemo'
    ],
    defaultModel: 'mistral-small-latest',
    hint: 'Get your key from console.mistral.ai'
  },
  xai: {
    label: 'xAI Grok',
    baseUrl: 'https://api.x.ai/v1',
    apiFormat: 'openai',
    requiresKey: true,
    models: [
      'grok-2',
      'grok-2-mini'
    ],
    defaultModel: 'grok-2-mini',
    hint: 'Get your key from console.x.ai'
  },

  // ── routers / aggregators ──────────────────────────────────
  openrouter: {
    label: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    apiFormat: 'openai',
    requiresKey: true,
    models: [
      'openai/gpt-4o',
      'anthropic/claude-sonnet-4-20250514',
      'google/gemini-2.0-flash-001',
      'meta-llama/llama-3.3-70b-instruct',
      'deepseek/deepseek-r1'
    ],
    defaultModel: 'openai/gpt-4o',
    hint: 'Universal AI router — access 200+ models with one key. Get your key from openrouter.ai'
  },
  together: {
    label: 'Together AI',
    baseUrl: 'https://api.together.xyz/v1',
    apiFormat: 'openai',
    requiresKey: true,
    models: [
      'meta-llama/Llama-3.3-70B-Instruct-Turbo',
      'Qwen/Qwen2.5-72B-Instruct-Turbo',
      'deepseek-ai/DeepSeek-R1',
      'mistralai/Mixtral-8x22B-Instruct-v0.1'
    ],
    defaultModel: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
    hint: 'Open-source model cloud. Get your key from api.together.xyz'
  },

  // ── enterprise ────────────────────────────────────────────
  azure_openai: {
    label: 'Azure OpenAI',
    baseUrl: '',
    apiFormat: 'azure-openai',
    requiresKey: true,
    models: [],
    defaultModel: '',
    hint: 'Enter your Azure endpoint as Base URL (e.g. https://{resource}.openai.azure.com/openai/deployments/{deployment}). Get your key from portal.azure.com'
  },

  // ── NVIDIA ───────────────────────────────────────────────
  nvidia_nim: {
    label: 'NVIDIA NIM',
    baseUrl: 'https://integrate.api.nvidia.com/v1',
    apiFormat: 'openai',
    requiresKey: true,
    models: [
      'deepseek-ai/deepseek-v3.2',
      'qwen/qwen3.5-122b-a10b',
      'minimaxai/minimax-m2.1',
      'nvidia/nemotron-3-nano-30b-a3b',
      'moonshotai/kimi-k2-instruct',
      'moonshotai/kimi-k2.5'
    ],
    defaultModel: 'deepseek-ai/deepseek-v3.2',
    hint: 'NVIDIA hosted models. Free credits available — register at build.nvidia.com'
  },

  // ── custom ─────────────────────────────────────────────────
  custom: {
    label: 'Custom Endpoint',
    baseUrl: '',
    apiFormat: 'openai',
    requiresKey: true,
    models: [],
    defaultModel: '',
    hint: 'Any OpenAI / Anthropic / Responses API compatible endpoint.'
  }
};

// construct the API endpoint URL from settings
function constructApiUrl(cfg) {
  var base = cfg.baseUrl || '';
  if (base.endsWith('/')) {
    base = base.slice(0, -1);
  }

  var format = cfg.apiFormat || 'openai';

  if (format === 'anthropic') {
    return base + '/messages';
  }
  if (format === 'responses') {
    return base + '/responses';
  }
  if (format === 'azure-openai') {
    return base + '/chat/completions?api-version=2024-10-21';
  }
  return base + '/chat/completions';
}

// build request headers based on provider/format
function buildApiHeaders(cfg) {
  var headers = { 'Content-Type': 'application/json' };
  var format = cfg.apiFormat || 'openai';

  if (format === 'anthropic') {
    if (cfg.apiKey) {
      headers['x-api-key'] = cfg.apiKey;
    }
    headers['anthropic-version'] = '2023-06-01';
    return headers;
  }

  // azure-openai: api-key header
  if (format === 'azure-openai') {
    if (cfg.apiKey) {
      headers['api-key'] = cfg.apiKey;
    }
    return headers;
  }

  // openai / responses / default: Bearer token
  if (cfg.apiKey) {
    var auth = cfg.apiKey;
    if (!auth.startsWith('Bearer ')) {
      auth = 'Bearer ' + auth;
    }
    headers['Authorization'] = auth;
  }

  return headers;
}

// build request payload from messages array and settings
function buildApiPayload(messages, cfg) {
  var format = cfg.apiFormat || 'openai';
  var model = cfg.model || '';

  if (format === 'anthropic') {
    var systemParts = [];
    var userMessages = [];
    for (var i = 0; i < messages.length; i++) {
      if (messages[i].role === 'system') {
        systemParts.push(messages[i].content);
      } else {
        userMessages.push({
          role: messages[i].role,
          content: messages[i].content
        });
      }
    }
    var payload = {
      model: model,
      max_tokens: 16384,
      messages: userMessages
    };
    if (systemParts.length > 0) {
      payload.system = systemParts.join('\n\n');
    }
    return payload;
  }

  if (format === 'responses') {
    return {
      model: model,
      input: messages,
      max_output_tokens: 16384,
      reasoning: { effort: cfg.reasoningEffort || 'high' }
    };
  }

  // default: openai chat completions
  return {
    model: model,
    messages: messages,
    max_tokens: 16384,
    temperature: 0.7
  };
}

// extract text content from any supported API response format.
// detection order: anthropic → responses API → openai → fallback
function extractApiResponse(data) {
  if (!data) return null;

  // anthropic Messages API: {type:"message", content:[{type:"text", text:"..."}]}
  if (data.type === 'message' && Array.isArray(data.content)) {
    var texts = [];
    for (var i = 0; i < data.content.length; i++) {
      if (data.content[i].text) {
        texts.push(data.content[i].text);
      }
    }
    if (texts.length > 0) return texts.join('');
  }

  // Responses API: {output:[{type:"message", content:[{..., text:"..."}]}]}
  if (data.output && Array.isArray(data.output)) {
    for (var i = 0; i < data.output.length; i++) {
      var item = data.output[i];
      if (item.type === 'message' && item.content) {
        if (Array.isArray(item.content)) {
          for (var j = 0; j < item.content.length; j++) {
            if (item.content[j].text) {
              return item.content[j].text;
            }
          }
        }
        if (typeof item.content === 'string') {
          return item.content;
        }
      }
    }
  }

  // OpenAI Chat Completions: {choices:[{message:{content:"..."}}]}
  if (data.choices && Array.isArray(data.choices) && data.choices.length > 0) {
    var choice = data.choices[0];
    if (choice.message && choice.message.content) return choice.message.content;
    if (choice.delta && choice.delta.content) return choice.delta.content;
    if (choice.text) return choice.text;
    if (typeof choice.content === 'string') return choice.content;
  }

  // fallback: common direct fields from various providers
  if (data.output && typeof data.output === 'string') return data.output;
  if (data.content && typeof data.content === 'string') return data.content;
  if (data.content && Array.isArray(data.content)) {
    return data.content.map(function(c) { return c.text || c.content || ''; }).join('');
  }
  if (data.result) return data.result;
  if (data.text) return data.text;
  if (data.response) return data.response;

  return null;
}

// default storage values for settings (used by all consumers)
var API_DEFAULTS = {
  provider: 'ollama',
  apiFormat: 'openai',
  baseUrl: 'http://localhost:11434/v1',
  apiKey: '',
  model: 'llama3.2',
  reasoningEffort: 'high'
};

// backward-compatible alias: templates now live in i18n.js per language.
// evaluated lazily since i18n.js loads after api-utils.js.
var BUILTIN_TEMPLATES = [];
