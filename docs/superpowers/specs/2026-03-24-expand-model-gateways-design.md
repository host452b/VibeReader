# Expand Model Gateway Support

**Date:** 2026-03-24
**Status:** Approved

## Summary

Add 14 new model gateways to VibeReader, covering international cloud services, enterprise (Azure OpenAI), local/self-hosted, and NVIDIA NIM. Each gateway includes an official link in its hint text for user reference.

## New Providers

### International Cloud (7)

| Key | Label | Base URL | Format | Models |
|-----|-------|----------|--------|--------|
| cohere | Cohere | `https://api.cohere.com/compatibility/v1` | openai | command-r-plus, command-r, command-a-03-2025 |
| perplexity | Perplexity | `https://api.perplexity.ai` | openai | sonar-pro, sonar, sonar-reasoning-pro |
| ai21 | AI21 Labs | `https://api.ai21.com/studio/v1` | openai | jamba-1.5-large, jamba-1.5-mini |
| fireworks | Fireworks AI | `https://api.fireworks.ai/inference/v1` | openai | firefunction-v2, llama-v3p1-70b-instruct |
| cerebras | Cerebras | `https://api.cerebras.ai/v1` | openai | llama-3.3-70b, llama-4-scout-17b-16e |
| lambda | Lambda | `https://api.lambdalabs.com/v1` | openai | llama-3.3-70b-instruct |
| replicate | Replicate | `https://openai-proxy.replicate.com/v1` | openai | meta/llama-3-70b-instruct |

### Enterprise (1)

| Key | Label | Base URL | Format | Notes |
|-----|-------|----------|--------|-------|
| azure_openai | Azure OpenAI | (user fills in) | azure-openai | New format: appends `?api-version=2024-10-21`, uses `api-key` header |

### Local/Self-hosted (5)

| Key | Label | Base URL | Models |
|-----|-------|----------|--------|
| jan | Jan | `http://localhost:1337/v1` | [] (user fills) |
| gpt4all | GPT4All | `http://localhost:4891/v1` | [] |
| localai | LocalAI | `http://localhost:8080/v1` | [] |
| vllm | vLLM | `http://localhost:8000/v1` | [] |
| textgenwebui | text-generation-webui | `http://localhost:5000/v1` | [] |

### NVIDIA NIM (1)

| Key | Label | Base URL | Format | Models |
|-----|-------|----------|--------|--------|
| nvidia_nim | NVIDIA NIM | `https://integrate.api.nvidia.com/v1` | openai | meta/llama-3.1-8b-instruct, nvidia/llama-3.1-nemotron-70b-instruct |

Hint: Free credits available at build.nvidia.com upon registration.

## Code Changes

### 1. `api-utils.js`

- Add 14 provider entries to `API_PROVIDERS`
- Add `azure-openai` format handling in `constructApiUrl()`: append `?api-version=2024-10-21`
- Add `azure-openai` format handling in `buildApiHeaders()`: use `api-key` header instead of `Authorization: Bearer`
- `buildApiPayload()`: azure-openai uses same payload as openai, no change needed
- `extractApiResponse()`: azure-openai returns same format as openai, no change needed

### 2. `options.html`

- Add 14 `<option>` entries in appropriate `<optgroup>` sections
- Add new `<optgroup label="Enterprise">` for Azure OpenAI
- Add new `<optgroup label="NVIDIA">` for NVIDIA NIM
- Update badge count from "18 providers" to "32 providers"
- Add `azure-openai` to API format dropdown

### 3. `options.js`

- Show API format selector for `azure_openai` (same as `custom`)
- Add base URL hint for azure-openai format: `"/chat/completions?api-version=..." is appended automatically`
