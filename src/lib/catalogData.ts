export interface CatalogModel {
  id: string;
  name: string;
  slug: string;
  modelId: string;
  description: string;
  company: {
    id: string;
    name: string;
    slug: string;
    logo?: string;
  };
  modelType: string;
  contextLength: number;
  maxOutput: number;
  inputModalities: string[];
  outputModalities: string[];
  reasoning: boolean;
  toolCalling: boolean;
  structuredOutput: boolean;
  supportsTemperature: boolean;
  openWeights: boolean;
  deprecated: boolean;
  releasedAt: string;
  updatedAt: string;
  providers: {
    id: string;
    provider: {
      id: string;
      name: string;
      slug: string;
    };
    inputPrice?: number | null;
    outputPrice?: number | null;
    cachePrice?: number | null;
  }[];
  capabilities: {
    capability: {
      name: string;
      slug: string;
    };
  }[];
  benchmarks: {
    benchmark: {
      name: string;
      slug: string;
      category: string;
    };
    score: number;
  }[];
  isNew?: boolean;
}

export const INITIAL_MODELS: CatalogModel[] = [
  {
    id: "m-1",
    name: "DeepSeek V3",
    slug: "deepseek-v3",
    modelId: "deepseek/deepseek-chat",
    description: "671B parameter Mixture-of-Experts frontier open weights model delivering top-tier performance at disruptive cost.",
    company: { id: "c-1", name: "DeepSeek", slug: "deepseek" },
    modelType: "chat",
    contextLength: 64000,
    maxOutput: 8192,
    inputModalities: ["T"],
    outputModalities: ["T"],
    reasoning: false,
    toolCalling: true,
    structuredOutput: true,
    supportsTemperature: true,
    openWeights: true,
    deprecated: false,
    releasedAt: "2024-12-26T00:00:00.000Z",
    updatedAt: "2026-11-18T00:00:00.000Z",
    isNew: true,
    providers: [
      { id: "mp-1", provider: { id: "p-1", name: "OpenRouter", slug: "openrouter" }, inputPrice: 0.14, outputPrice: 0.28, cachePrice: 0.014 },
      { id: "mp-2", provider: { id: "p-2", name: "Together AI", slug: "together-ai" }, inputPrice: 0.14, outputPrice: 0.28, cachePrice: 0.014 },
      { id: "mp-3", provider: { id: "p-4", name: "Fireworks AI", slug: "fireworks" }, inputPrice: 0.14, outputPrice: 0.28, cachePrice: 0.014 },
      { id: "mp-4", provider: { id: "p-8", name: "DeepInfra", slug: "deepinfra" }, inputPrice: 0.14, outputPrice: 0.28, cachePrice: 0.014 },
    ],
    capabilities: [
      { capability: { name: "Open weights", slug: "open-weights" } },
      { capability: { name: "Tool calling", slug: "tool-calling" } },
      { capability: { name: "Structured output", slug: "structured-output" } },
    ],
    benchmarks: [
      { benchmark: { name: "Chatbot Arena Elo", slug: "arena-elo", category: "overall" }, score: 1318 },
      { benchmark: { name: "MMLU-Pro", slug: "mmlu-pro", category: "knowledge" }, score: 75.9 },
      { benchmark: { name: "HumanEval", slug: "humaneval", category: "coding" }, score: 89.6 },
    ],
  },
  {
    id: "m-2",
    name: "DeepSeek R1",
    slug: "deepseek-r1",
    modelId: "deepseek/deepseek-r1",
    description: "Frontier open-weights reasoning model with emergent deliberation, matching closed reasoning leaders.",
    company: { id: "c-1", name: "DeepSeek", slug: "deepseek" },
    modelType: "reasoning",
    contextLength: 64000,
    maxOutput: 8192,
    inputModalities: ["T"],
    outputModalities: ["T"],
    reasoning: true,
    toolCalling: false,
    structuredOutput: true,
    supportsTemperature: true,
    openWeights: true,
    deprecated: false,
    releasedAt: "2025-01-20T00:00:00.000Z",
    updatedAt: "2026-11-19T00:00:00.000Z",
    isNew: true,
    providers: [
      { id: "mp-5", provider: { id: "p-1", name: "OpenRouter", slug: "openrouter" }, inputPrice: 0.55, outputPrice: 2.19, cachePrice: 0.14 },
      { id: "mp-6", provider: { id: "p-3", name: "Groq", slug: "groq" }, inputPrice: 0.75, outputPrice: 2.50, cachePrice: 0.20 },
      { id: "mp-7", provider: { id: "p-2", name: "Together AI", slug: "together-ai" }, inputPrice: 0.55, outputPrice: 2.19, cachePrice: 0.14 },
    ],
    capabilities: [
      { capability: { name: "Open weights", slug: "open-weights" } },
      { capability: { name: "Reasoning", slug: "reasoning" } },
      { capability: { name: "Structured output", slug: "structured-output" } },
    ],
    benchmarks: [
      { benchmark: { name: "Chatbot Arena Elo", slug: "arena-elo", category: "overall" }, score: 1364 },
      { benchmark: { name: "MATH 500", slug: "math-500", category: "mathematics" }, score: 97.3 },
      { benchmark: { name: "GPQA Diamond", slug: "gpqa-diamond", category: "reasoning" }, score: 71.5 },
    ],
  },
  {
    id: "m-3",
    name: "Claude 3.5 Sonnet",
    slug: "claude-3-5-sonnet",
    modelId: "anthropic/claude-3.5-sonnet",
    description: "Industry standard for programming, agentic reasoning, computer use, and nuanced communication.",
    company: { id: "c-2", name: "Anthropic", slug: "anthropic" },
    modelType: "chat",
    contextLength: 200000,
    maxOutput: 8192,
    inputModalities: ["T", "I"],
    outputModalities: ["T"],
    reasoning: false,
    toolCalling: true,
    structuredOutput: true,
    supportsTemperature: true,
    openWeights: false,
    deprecated: false,
    releasedAt: "2024-10-22T00:00:00.000Z",
    updatedAt: "2026-11-15T00:00:00.000Z",
    isNew: false,
    providers: [
      { id: "mp-8", provider: { id: "p-1", name: "OpenRouter", slug: "openrouter" }, inputPrice: 3.00, outputPrice: 15.00, cachePrice: 0.30 },
      { id: "mp-9", provider: { id: "p-6", name: "Amazon Bedrock", slug: "amazon-bedrock" }, inputPrice: 3.00, outputPrice: 15.00, cachePrice: 0.30 },
    ],
    capabilities: [
      { capability: { name: "Tool calling", slug: "tool-calling" } },
      { capability: { name: "Structured output", slug: "structured-output" } },
      { capability: { name: "Vision", slug: "vision" } },
    ],
    benchmarks: [
      { benchmark: { name: "Chatbot Arena Elo", slug: "arena-elo", category: "overall" }, score: 1335 },
      { benchmark: { name: "HumanEval", slug: "humaneval", category: "coding" }, score: 93.7 },
      { benchmark: { name: "SWE-bench Verified", slug: "swe-bench-verified", category: "coding" }, score: 49.0 },
    ],
  },
  {
    id: "m-4",
    name: "o1",
    slug: "openai-o1",
    modelId: "openai/o1",
    description: "Flagship reasoning model that deliberates via chain-of-thought to solve complex science, math, and code problems.",
    company: { id: "c-3", name: "OpenAI", slug: "openai" },
    modelType: "reasoning",
    contextLength: 200000,
    maxOutput: 100000,
    inputModalities: ["T", "I"],
    outputModalities: ["T"],
    reasoning: true,
    toolCalling: true,
    structuredOutput: true,
    supportsTemperature: false,
    openWeights: false,
    deprecated: false,
    releasedAt: "2024-12-17T00:00:00.000Z",
    updatedAt: "2026-11-17T00:00:00.000Z",
    isNew: true,
    providers: [
      { id: "mp-10", provider: { id: "p-1", name: "OpenRouter", slug: "openrouter" }, inputPrice: 15.00, outputPrice: 60.00, cachePrice: 7.50 },
      { id: "mp-11", provider: { id: "p-7", name: "Azure AI", slug: "azure-ai" }, inputPrice: 15.00, outputPrice: 60.00, cachePrice: 7.50 },
    ],
    capabilities: [
      { capability: { name: "Reasoning", slug: "reasoning" } },
      { capability: { name: "Tool calling", slug: "tool-calling" } },
      { capability: { name: "Structured output", slug: "structured-output" } },
      { capability: { name: "Vision", slug: "vision" } },
    ],
    benchmarks: [
      { benchmark: { name: "Chatbot Arena Elo", slug: "arena-elo", category: "overall" }, score: 1358 },
      { benchmark: { name: "MATH 500", slug: "math-500", category: "mathematics" }, score: 96.4 },
      { benchmark: { name: "GPQA Diamond", slug: "gpqa-diamond", category: "reasoning" }, score: 75.7 },
    ],
  },
  {
    id: "m-5",
    name: "GPT-4o",
    slug: "openai-gpt-4o",
    modelId: "openai/gpt-4o",
    description: "High-intelligence flagship omni-model supporting multi-modal input and fast response generation.",
    company: { id: "c-3", name: "OpenAI", slug: "openai" },
    modelType: "chat",
    contextLength: 128000,
    maxOutput: 16384,
    inputModalities: ["T", "I", "A"],
    outputModalities: ["T", "A"],
    reasoning: false,
    toolCalling: true,
    structuredOutput: true,
    supportsTemperature: true,
    openWeights: false,
    deprecated: false,
    releasedAt: "2024-05-13T00:00:00.000Z",
    updatedAt: "2026-11-12T00:00:00.000Z",
    isNew: false,
    providers: [
      { id: "mp-12", provider: { id: "p-1", name: "OpenRouter", slug: "openrouter" }, inputPrice: 2.50, outputPrice: 10.00, cachePrice: 1.25 },
      { id: "mp-13", provider: { id: "p-7", name: "Azure AI", slug: "azure-ai" }, inputPrice: 2.50, outputPrice: 10.00, cachePrice: 1.25 },
    ],
    capabilities: [
      { capability: { name: "Tool calling", slug: "tool-calling" } },
      { capability: { name: "Structured output", slug: "structured-output" } },
      { capability: { name: "Vision", slug: "vision" } },
    ],
    benchmarks: [
      { benchmark: { name: "Chatbot Arena Elo", slug: "arena-elo", category: "overall" }, score: 1315 },
      { benchmark: { name: "MMLU-Pro", slug: "mmlu-pro", category: "knowledge" }, score: 72.5 },
      { benchmark: { name: "HumanEval", slug: "humaneval", category: "coding" }, score: 90.2 },
    ],
  },
  {
    id: "m-6",
    name: "Gemini 1.5 Pro",
    slug: "gemini-1-5-pro",
    modelId: "google/gemini-1.5-pro",
    description: "Leading 2M token context window model with native audio, video, and cross-modal reasoning capabilities.",
    company: { id: "c-4", name: "Google", slug: "google" },
    modelType: "multimodal",
    contextLength: 2000000,
    maxOutput: 8192,
    inputModalities: ["T", "I", "A", "V"],
    outputModalities: ["T"],
    reasoning: false,
    toolCalling: true,
    structuredOutput: true,
    supportsTemperature: true,
    openWeights: false,
    deprecated: false,
    releasedAt: "2024-09-24T00:00:00.000Z",
    updatedAt: "2026-11-14T00:00:00.000Z",
    isNew: false,
    providers: [
      { id: "mp-14", provider: { id: "p-5", name: "Google AI Studio", slug: "google-ai" }, inputPrice: 1.25, outputPrice: 5.00, cachePrice: 0.3125 },
      { id: "mp-15", provider: { id: "p-1", name: "OpenRouter", slug: "openrouter" }, inputPrice: 1.25, outputPrice: 5.00, cachePrice: 0.3125 },
    ],
    capabilities: [
      { capability: { name: "Tool calling", slug: "tool-calling" } },
      { capability: { name: "Structured output", slug: "structured-output" } },
      { capability: { name: "Vision", slug: "vision" } },
      { capability: { name: "1M+ context", slug: "1m-context" } },
    ],
    benchmarks: [
      { benchmark: { name: "Chatbot Arena Elo", slug: "arena-elo", category: "overall" }, score: 1308 },
      { benchmark: { name: "MMLU-Pro", slug: "mmlu-pro", category: "knowledge" }, score: 72.8 },
    ],
  },
  {
    id: "m-7",
    name: "Gemini 1.5 Flash",
    slug: "gemini-1-5-flash",
    modelId: "google/gemini-1.5-flash",
    description: "High-frequency, lightweight multimodal model with 1M context designed for efficiency at scale.",
    company: { id: "c-4", name: "Google", slug: "google" },
    modelType: "multimodal",
    contextLength: 1000000,
    maxOutput: 8192,
    inputModalities: ["T", "I", "A", "V"],
    outputModalities: ["T"],
    reasoning: false,
    toolCalling: true,
    structuredOutput: true,
    supportsTemperature: true,
    openWeights: false,
    deprecated: false,
    releasedAt: "2024-09-24T00:00:00.000Z",
    updatedAt: "2026-11-10T00:00:00.000Z",
    isNew: false,
    providers: [
      { id: "mp-16", provider: { id: "p-5", name: "Google AI Studio", slug: "google-ai" }, inputPrice: 0.075, outputPrice: 0.30, cachePrice: 0.01875 },
      { id: "mp-17", provider: { id: "p-1", name: "OpenRouter", slug: "openrouter" }, inputPrice: 0.075, outputPrice: 0.30, cachePrice: 0.01875 },
    ],
    capabilities: [
      { capability: { name: "Tool calling", slug: "tool-calling" } },
      { capability: { name: "Structured output", slug: "structured-output" } },
      { capability: { name: "Vision", slug: "vision" } },
      { capability: { name: "1M+ context", slug: "1m-context" } },
      { capability: { name: "Free", slug: "free" } },
    ],
    benchmarks: [
      { benchmark: { name: "Chatbot Arena Elo", slug: "arena-elo", category: "overall" }, score: 1264 },
      { benchmark: { name: "HumanEval", slug: "humaneval", category: "coding" }, score: 82.5 },
    ],
  },
  {
    id: "m-8",
    name: "Llama 3.3 70B",
    slug: "llama-3-3-70b",
    modelId: "meta-llama/llama-3.3-70b-instruct",
    description: "Meta's latest 70B open weights model matching 405B capabilities at a fraction of the inference cost.",
    company: { id: "c-5", name: "Meta", slug: "meta" },
    modelType: "chat",
    contextLength: 128000,
    maxOutput: 4096,
    inputModalities: ["T"],
    outputModalities: ["T"],
    reasoning: false,
    toolCalling: true,
    structuredOutput: true,
    supportsTemperature: true,
    openWeights: true,
    deprecated: false,
    releasedAt: "2024-12-06T00:00:00.000Z",
    updatedAt: "2026-11-16T00:00:00.000Z",
    isNew: true,
    providers: [
      { id: "mp-18", provider: { id: "p-3", name: "Groq", slug: "groq" }, inputPrice: 0.59, outputPrice: 0.79, cachePrice: 0.30 },
      { id: "mp-19", provider: { id: "p-1", name: "OpenRouter", slug: "openrouter" }, inputPrice: 0.40, outputPrice: 0.40, cachePrice: 0.20 },
      { id: "mp-20", provider: { id: "p-2", name: "Together AI", slug: "together-ai" }, inputPrice: 0.40, outputPrice: 0.40, cachePrice: 0.20 },
    ],
    capabilities: [
      { capability: { name: "Open weights", slug: "open-weights" } },
      { capability: { name: "Tool calling", slug: "tool-calling" } },
      { capability: { name: "Structured output", slug: "structured-output" } },
    ],
    benchmarks: [
      { benchmark: { name: "Chatbot Arena Elo", slug: "arena-elo", category: "overall" }, score: 1292 },
      { benchmark: { name: "MMLU-Pro", slug: "mmlu-pro", category: "knowledge" }, score: 70.2 },
    ],
  },
  {
    id: "m-9",
    name: "Qwen 2.5 Coder 32B",
    slug: "qwen-2-5-coder-32b",
    modelId: "qwen/qwen-2.5-coder-32b-instruct",
    description: "State-of-the-art open weights code intelligence model rivaling frontier proprietary systems.",
    company: { id: "c-6", name: "Alibaba", slug: "alibaba" },
    modelType: "chat",
    contextLength: 131072,
    maxOutput: 8192,
    inputModalities: ["T"],
    outputModalities: ["T"],
    reasoning: false,
    toolCalling: true,
    structuredOutput: true,
    supportsTemperature: true,
    openWeights: true,
    deprecated: false,
    releasedAt: "2024-11-12T00:00:00.000Z",
    updatedAt: "2026-11-13T00:00:00.000Z",
    isNew: false,
    providers: [
      { id: "mp-21", provider: { id: "p-1", name: "OpenRouter", slug: "openrouter" }, inputPrice: 0.15, outputPrice: 0.15, cachePrice: 0.08 },
      { id: "mp-22", provider: { id: "p-2", name: "Together AI", slug: "together-ai" }, inputPrice: 0.15, outputPrice: 0.15, cachePrice: 0.08 },
    ],
    capabilities: [
      { capability: { name: "Open weights", slug: "open-weights" } },
      { capability: { name: "Tool calling", slug: "tool-calling" } },
      { capability: { name: "Structured output", slug: "structured-output" } },
    ],
    benchmarks: [
      { benchmark: { name: "HumanEval", slug: "humaneval", category: "coding" }, score: 92.7 },
      { benchmark: { name: "SWE-bench Verified", slug: "swe-bench-verified", category: "coding" }, score: 41.2 },
    ],
  },
  {
    id: "m-10",
    name: "Mistral Large 2",
    slug: "mistral-large-2",
    modelId: "mistralai/mistral-large-2407",
    description: "123B parameter flagship model from Mistral AI with advanced reasoning, coding, and multilingual fluency.",
    company: { id: "c-7", name: "Mistral AI", slug: "mistral" },
    modelType: "chat",
    contextLength: 128000,
    maxOutput: 4096,
    inputModalities: ["T"],
    outputModalities: ["T"],
    reasoning: false,
    toolCalling: true,
    structuredOutput: true,
    supportsTemperature: true,
    openWeights: true,
    deprecated: false,
    releasedAt: "2024-07-24T00:00:00.000Z",
    updatedAt: "2026-11-08T00:00:00.000Z",
    isNew: false,
    providers: [
      { id: "mp-23", provider: { id: "p-1", name: "OpenRouter", slug: "openrouter" }, inputPrice: 2.00, outputPrice: 6.00, cachePrice: 1.00 },
      { id: "mp-24", provider: { id: "p-2", name: "Together AI", slug: "together-ai" }, inputPrice: 2.00, outputPrice: 6.00, cachePrice: 1.00 },
    ],
    capabilities: [
      { capability: { name: "Open weights", slug: "open-weights" } },
      { capability: { name: "Tool calling", slug: "tool-calling" } },
      { capability: { name: "Structured output", slug: "structured-output" } },
    ],
    benchmarks: [
      { benchmark: { name: "Chatbot Arena Elo", slug: "arena-elo", category: "overall" }, score: 1275 },
      { benchmark: { name: "HumanEval", slug: "humaneval", category: "coding" }, score: 92.1 },
    ],
  },
  {
    id: "m-11",
    name: "GPT-3.5 Turbo",
    slug: "openai-gpt-3-5-turbo",
    modelId: "openai/gpt-3.5-turbo",
    description: "Legacy fast model superseded by GPT-4o mini. Maintained for legacy compatibility.",
    company: { id: "c-3", name: "OpenAI", slug: "openai" },
    modelType: "chat",
    contextLength: 16385,
    maxOutput: 4096,
    inputModalities: ["T"],
    outputModalities: ["T"],
    reasoning: false,
    toolCalling: true,
    structuredOutput: false,
    supportsTemperature: true,
    openWeights: false,
    deprecated: true,
    releasedAt: "2023-03-01T00:00:00.000Z",
    updatedAt: "2026-10-15T00:00:00.000Z",
    isNew: false,
    providers: [
      { id: "mp-25", provider: { id: "p-1", name: "OpenRouter", slug: "openrouter" }, inputPrice: 0.50, outputPrice: 1.50, cachePrice: 0.50 },
    ],
    capabilities: [
      { capability: { name: "Tool calling", slug: "tool-calling" } },
    ],
    benchmarks: [
      { benchmark: { name: "Chatbot Arena Elo", slug: "arena-elo", category: "overall" }, score: 1115 },
    ],
  },
];
