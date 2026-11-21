import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding OneAtlas database...");

  // 1. Clear existing data
  await prisma.modelBenchmark.deleteMany({});
  await prisma.modelCapability.deleteMany({});
  await prisma.modelProvider.deleteMany({});
  await prisma.benchmark.deleteMany({});
  await prisma.capability.deleteMany({});
  await prisma.model.deleteMany({});
  await prisma.provider.deleteMany({});
  await prisma.company.deleteMany({});

  // 2. Seed Companies (Labs)
  const companiesData = [
    {
      name: "OpenAI",
      slug: "openai",
      description: "Pioneer in artificial general intelligence research and creator of GPT-4o, o1, and ChatGPT.",
      website: "https://openai.com",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg",
    },
    {
      name: "Anthropic",
      slug: "anthropic",
      description: "AI safety and research company, creators of Claude 3.5 Sonnet, Claude 3.5 Haiku, and Claude 3 Opus.",
      website: "https://anthropic.com",
      logo: "https://upload.wikimedia.org/wikipedia/commons/7/78/Anthropic_logo.svg",
    },
    {
      name: "Google DeepMind",
      slug: "google",
      description: "Frontier AI research lab behind Gemini 1.5 Pro, Gemini 1.5 Flash, and Gemma open models.",
      website: "https://deepmind.google",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    },
    {
      name: "Meta AI",
      slug: "meta",
      description: "Open source foundation model research lab developing the Llama 3 family of open weights models.",
      website: "https://ai.meta.com",
      logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
    },
    {
      name: "DeepSeek",
      slug: "deepseek",
      description: "Frontier open-weights research lab specializing in cost-efficient reasoning, math, and coding models like DeepSeek V3 and R1.",
      website: "https://deepseek.com",
      logo: "https://chat.deepseek.com/favicon.ico",
    },
    {
      name: "Mistral AI",
      slug: "mistral",
      description: "European frontier lab providing both open weights and high-performance commercial models like Mistral Large 2.",
      website: "https://mistral.ai",
      logo: "https://mistral.ai/favicon.ico",
    },
    {
      name: "xAI",
      slug: "xai",
      description: "AI research lab founded by Elon Musk developing Grok 2 and frontier reasoning systems.",
      website: "https://x.ai",
      logo: "https://x.ai/favicon.ico",
    },
    {
      name: "Alibaba Cloud",
      slug: "alibaba",
      description: "Creator of Qwen 2.5 open foundation and coder models supporting up to 128k context and high multilingual performance.",
      website: "https://aliyun.com",
      logo: "https://upload.wikimedia.org/wikipedia/en/8/80/Alibaba_Group_logo.svg",
    },
  ];

  const companies: Record<string, any> = {};
  for (const c of companiesData) {
    companies[c.slug] = await prisma.company.create({ data: c });
  }

  // 3. Seed Providers (Inference Platforms)
  const providersData = [
    {
      name: "OpenRouter",
      slug: "openrouter",
      description: "Unified AI API aggregator routing to dozens of inference providers with dynamic pricing and uptime failover.",
      website: "https://openrouter.ai",
      logo: "https://openrouter.ai/favicon.ico",
    },
    {
      name: "Together AI",
      slug: "together-ai",
      description: "Leading cloud platform for high-throughput fine-tuning and inference for open-source AI models.",
      website: "https://together.ai",
      logo: "https://together.ai/favicon.ico",
    },
    {
      name: "Groq",
      slug: "groq",
      description: "Ultra-fast LPU inference engine achieving groundbreaking tokens-per-second generation speeds.",
      website: "https://groq.com",
      logo: "https://groq.com/favicon.ico",
    },
    {
      name: "Fireworks AI",
      slug: "fireworks",
      description: "Fast production AI platform optimized for low-latency serving and function calling.",
      website: "https://fireworks.ai",
      logo: "https://fireworks.ai/favicon.ico",
    },
    {
      name: "Google AI Studio",
      slug: "google-ai",
      description: "Direct API platform from Google offering Gemini native multimodal and long-context inference.",
      website: "https://aistudio.google.com",
      logo: "https://www.gstatic.com/lamda/images/favicon_v1_150160cddff7fcd8cfbe.svg",
    },
    {
      name: "Amazon Bedrock",
      slug: "amazon-bedrock",
      description: "Enterprise foundation model managed service by AWS with enterprise privacy and SLA guarantees.",
      website: "https://aws.amazon.com/bedrock",
      logo: "https://aws.amazon.com/favicon.ico",
    },
    {
      name: "Azure AI",
      slug: "azure-ai",
      description: "Enterprise cloud AI infrastructure platform by Microsoft hosting OpenAI, Mistral, and Meta models.",
      website: "https://azure.microsoft.com",
      logo: "https://azure.microsoft.com/favicon.ico",
    },
    {
      name: "DeepInfra",
      slug: "deepinfra",
      description: "Pay-as-you-go serverless inference API for popular open-source LLMs and embeddings.",
      website: "https://deepinfra.com",
      logo: "https://deepinfra.com/favicon.ico",
    },
  ];

  const providers: Record<string, any> = {};
  for (const p of providersData) {
    providers[p.slug] = await prisma.provider.create({ data: p });
  }

  // 4. Seed Capabilities
  const capabilitiesData = [
    { name: "Reasoning", slug: "reasoning", category: "cognition" },
    { name: "Tool calling", slug: "tool-calling", category: "agentic" },
    { name: "Structured output", slug: "structured-output", category: "developer" },
    { name: "Vision", slug: "vision", category: "modality" },
    { name: "Open weights", slug: "open-weights", category: "licensing" },
    { name: "1M+ context", slug: "1m-context", category: "architecture" },
    { name: "Free tier", slug: "free", category: "pricing" },
    { name: "Code generation", slug: "code-generation", category: "domain" },
    { name: "Math problem solving", slug: "math", category: "cognition" },
    { name: "Multilingual", slug: "multilingual", category: "domain" },
  ];

  const capabilities: Record<string, any> = {};
  for (const cap of capabilitiesData) {
    capabilities[cap.slug] = await prisma.capability.create({ data: cap });
  }

  // 5. Seed Benchmarks
  const benchmarksData = [
    {
      name: "Chatbot Arena Elo",
      slug: "arena-elo",
      category: "overall",
      description: "Crowdsourced human preference evaluation benchmark via blind pairwise model comparisons (LMSYS).",
    },
    {
      name: "MMLU-Pro",
      slug: "mmlu-pro",
      category: "knowledge",
      description: "Massive Multitask Language Understanding Pro with rigorous reasoning and 10 options per question.",
    },
    {
      name: "HumanEval",
      slug: "humaneval",
      category: "coding",
      description: "OpenAI benchmark evaluating Python coding and algorithmic problem-solving accuracy (pass@1).",
    },
    {
      name: "GSM8K",
      slug: "gsm8k",
      category: "mathematics",
      description: "Grade School Math 8K benchmark measuring multi-step mathematical word problem reasoning.",
    },
    {
      name: "MATH 500",
      slug: "math-500",
      category: "mathematics",
      description: "Challenging high school and Olympiad competition mathematics evaluation.",
    },
    {
      name: "GPQA Diamond",
      slug: "gpqa-diamond",
      category: "reasoning",
      description: "Graduate-Level Google-Proof Q&A benchmark tested against domain experts with PhDs.",
    },
    {
      name: "SWE-bench Verified",
      slug: "swe-bench-verified",
      category: "coding",
      description: "Real-world GitHub software engineering issues resolved end-to-end with unit test verification.",
    },
  ];

  const benchmarks: Record<string, any> = {};
  for (const b of benchmarksData) {
    benchmarks[b.slug] = await prisma.benchmark.create({ data: b });
  }

  // 6. Seed Models (22 models covering all frontier labs and open weights)
  const modelsData = [
    {
      name: "o1",
      slug: "openai-o1",
      modelId: "openai/o1",
      companySlug: "openai",
      description: "Flagship reasoning model that uses Chain-of-Thought deliberation to solve complex STEM, coding, and scientific research challenges.",
      modelType: "reasoning",
      contextLength: 200000,
      maxOutput: 100000,
      inputModalities: ["text", "image"],
      outputModalities: ["text"],
      reasoning: true,
      toolCalling: true,
      structuredOutput: true,
      supportsTemperature: false,
      openWeights: false,
      deprecated: false,
      releasedAt: new Date("2024-12-17"),
      caps: ["reasoning", "tool-calling", "structured-output", "vision", "code-generation", "math"],
      providers: [
        { providerSlug: "openrouter", inputPrice: 15.0, outputPrice: 60.0, cachePrice: 7.5 },
        { providerSlug: "azure-ai", inputPrice: 15.0, outputPrice: 60.0, cachePrice: 7.5 },
      ],
      benchmarks: [
        { benchmarkSlug: "arena-elo", score: 1358, source: "LMArena Leaderboard" },
        { benchmarkSlug: "math-500", score: 96.4, source: "OpenAI Research" },
        { benchmarkSlug: "gpqa-diamond", score: 75.7, source: "OpenAI Technical Report" },
        { benchmarkSlug: "swe-bench-verified", score: 48.9, source: "OpenAI Evaluations" },
      ],
    },
    {
      name: "o1-mini",
      slug: "openai-o1-mini",
      modelId: "openai/o1-mini",
      companySlug: "openai",
      description: "Fast, cost-efficient reasoning model optimized especially for STEM, coding, and mathematical proofs.",
      modelType: "reasoning",
      contextLength: 128000,
      maxOutput: 65536,
      inputModalities: ["text"],
      outputModalities: ["text"],
      reasoning: true,
      toolCalling: false,
      structuredOutput: true,
      supportsTemperature: false,
      openWeights: false,
      deprecated: false,
      releasedAt: new Date("2024-09-12"),
      caps: ["reasoning", "structured-output", "code-generation", "math"],
      providers: [
        { providerSlug: "openrouter", inputPrice: 3.0, outputPrice: 12.0, cachePrice: 1.5 },
        { providerSlug: "azure-ai", inputPrice: 3.0, outputPrice: 12.0, cachePrice: 1.5 },
      ],
      benchmarks: [
        { benchmarkSlug: "arena-elo", score: 1290, source: "LMArena Leaderboard" },
        { benchmarkSlug: "math-500", score: 90.0, source: "OpenAI Technical Report" },
        { benchmarkSlug: "gpqa-diamond", score: 60.0, source: "OpenAI Research" },
      ],
    },
    {
      name: "GPT-4o",
      slug: "openai-gpt-4o",
      modelId: "openai/gpt-4o",
      companySlug: "openai",
      description: "Omni-modal flagship model with balanced high intelligence, rapid latency, and audio/vision capabilities.",
      modelType: "chat",
      contextLength: 128000,
      maxOutput: 16384,
      inputModalities: ["text", "image", "audio"],
      outputModalities: ["text", "audio"],
      reasoning: false,
      toolCalling: true,
      structuredOutput: true,
      supportsTemperature: true,
      openWeights: false,
      deprecated: false,
      releasedAt: new Date("2024-05-13"),
      caps: ["tool-calling", "structured-output", "vision", "code-generation", "multilingual"],
      providers: [
        { providerSlug: "openrouter", inputPrice: 2.5, outputPrice: 10.0, cachePrice: 1.25 },
        { providerSlug: "azure-ai", inputPrice: 2.5, outputPrice: 10.0, cachePrice: 1.25 },
      ],
      benchmarks: [
        { benchmarkSlug: "arena-elo", score: 1315, source: "LMArena Leaderboard" },
        { benchmarkSlug: "mmlu-pro", score: 72.5, source: "Official Report" },
        { benchmarkSlug: "humaneval", score: 90.2, source: "Artificial Analysis" },
        { benchmarkSlug: "gsm8k", score: 95.8, source: "OpenAI" },
      ],
    },
    {
      name: "GPT-4o mini",
      slug: "openai-gpt-4o-mini",
      modelId: "openai/gpt-4o-mini",
      companySlug: "openai",
      description: "Affordable small model delivering near-frontier intelligence at an ultra-low price point.",
      modelType: "chat",
      contextLength: 128000,
      maxOutput: 16384,
      inputModalities: ["text", "image"],
      outputModalities: ["text"],
      reasoning: false,
      toolCalling: true,
      structuredOutput: true,
      supportsTemperature: true,
      openWeights: false,
      deprecated: false,
      releasedAt: new Date("2024-07-18"),
      caps: ["tool-calling", "structured-output", "vision", "multilingual"],
      providers: [
        { providerSlug: "openrouter", inputPrice: 0.15, outputPrice: 0.6, cachePrice: 0.075 },
        { providerSlug: "azure-ai", inputPrice: 0.15, outputPrice: 0.6, cachePrice: 0.075 },
      ],
      benchmarks: [
        { benchmarkSlug: "arena-elo", score: 1262, source: "LMArena Leaderboard" },
        { benchmarkSlug: "humaneval", score: 87.2, source: "OpenAI Evaluations" },
        { benchmarkSlug: "gsm8k", score: 91.3, source: "OpenAI" },
      ],
    },
    {
      name: "Claude 3.5 Sonnet",
      slug: "claude-3-5-sonnet",
      modelId: "anthropic/claude-3.5-sonnet",
      companySlug: "anthropic",
      description: "Industry standard for programming, agentic reasoning, computer use, and sophisticated nuance.",
      modelType: "chat",
      contextLength: 200000,
      maxOutput: 8192,
      inputModalities: ["text", "image"],
      outputModalities: ["text"],
      reasoning: false,
      toolCalling: true,
      structuredOutput: true,
      supportsTemperature: true,
      openWeights: false,
      deprecated: false,
      releasedAt: new Date("2024-10-22"),
      caps: ["tool-calling", "structured-output", "vision", "code-generation", "multilingual"],
      providers: [
        { providerSlug: "openrouter", inputPrice: 3.0, outputPrice: 15.0, cachePrice: 0.3 },
        { providerSlug: "amazon-bedrock", inputPrice: 3.0, outputPrice: 15.0, cachePrice: 0.3 },
        { providerSlug: "together-ai", inputPrice: 3.0, outputPrice: 15.0, cachePrice: 0.3 },
      ],
      benchmarks: [
        { benchmarkSlug: "arena-elo", score: 1335, source: "LMArena Leaderboard" },
        { benchmarkSlug: "humaneval", score: 93.7, source: "Anthropic Model Card" },
        { benchmarkSlug: "swe-bench-verified", score: 49.0, source: "SWE-bench Official" },
        { benchmarkSlug: "gpqa-diamond", score: 65.0, source: "Anthropic" },
      ],
    },
    {
      name: "Claude 3.5 Haiku",
      slug: "claude-3-5-haiku",
      modelId: "anthropic/claude-3.5-haiku",
      companySlug: "anthropic",
      description: "Anthropic's fastest model, outperforming earlier frontier model Claude 3 Opus across coding and reasoning benchmarks.",
      modelType: "chat",
      contextLength: 200000,
      maxOutput: 8192,
      inputModalities: ["text"],
      outputModalities: ["text"],
      reasoning: false,
      toolCalling: true,
      structuredOutput: true,
      supportsTemperature: true,
      openWeights: false,
      deprecated: false,
      releasedAt: new Date("2024-11-04"),
      caps: ["tool-calling", "structured-output", "code-generation"],
      providers: [
        { providerSlug: "openrouter", inputPrice: 0.8, outputPrice: 4.0, cachePrice: 0.08 },
        { providerSlug: "amazon-bedrock", inputPrice: 0.8, outputPrice: 4.0, cachePrice: 0.08 },
      ],
      benchmarks: [
        { benchmarkSlug: "arena-elo", score: 1278, source: "LMArena Leaderboard" },
        { benchmarkSlug: "humaneval", score: 88.9, source: "Anthropic Evaluation" },
        { benchmarkSlug: "gsm8k", score: 89.2, source: "Anthropic" },
      ],
    },
    {
      name: "Claude 3 Opus",
      slug: "claude-3-opus",
      modelId: "anthropic/claude-3-opus",
      companySlug: "anthropic",
      description: "High-intelligence model specialized in deep qualitative research, philosophy, and creative writing.",
      modelType: "chat",
      contextLength: 200000,
      maxOutput: 4096,
      inputModalities: ["text", "image"],
      outputModalities: ["text"],
      reasoning: false,
      toolCalling: true,
      structuredOutput: true,
      supportsTemperature: true,
      openWeights: false,
      deprecated: false,
      releasedAt: new Date("2024-03-04"),
      caps: ["tool-calling", "vision", "multilingual"],
      providers: [
        { providerSlug: "openrouter", inputPrice: 15.0, outputPrice: 75.0, cachePrice: 1.5 },
        { providerSlug: "amazon-bedrock", inputPrice: 15.0, outputPrice: 75.0, cachePrice: 1.5 },
      ],
      benchmarks: [
        { benchmarkSlug: "arena-elo", score: 1256, source: "LMArena Leaderboard" },
        { benchmarkSlug: "mmlu-pro", score: 68.4, source: "Artificial Analysis" },
        { benchmarkSlug: "gsm8k", score: 95.0, source: "Anthropic Report" },
      ],
    },
    {
      name: "Gemini 1.5 Pro",
      slug: "gemini-1-5-pro",
      modelId: "google/gemini-1.5-pro",
      companySlug: "google",
      description: "Industry-leading 2M token context window model with native audio, video, and cross-modal reasoning capabilities.",
      modelType: "multimodal",
      contextLength: 2000000,
      maxOutput: 8192,
      inputModalities: ["text", "image", "audio", "video"],
      outputModalities: ["text"],
      reasoning: false,
      toolCalling: true,
      structuredOutput: true,
      supportsTemperature: true,
      openWeights: false,
      deprecated: false,
      releasedAt: new Date("2024-09-24"),
      caps: ["tool-calling", "structured-output", "vision", "1m-context", "code-generation", "multilingual"],
      providers: [
        { providerSlug: "google-ai", inputPrice: 1.25, outputPrice: 5.0, cachePrice: 0.3125 },
        { providerSlug: "openrouter", inputPrice: 1.25, outputPrice: 5.0, cachePrice: 0.3125 },
      ],
      benchmarks: [
        { benchmarkSlug: "arena-elo", score: 1308, source: "LMArena Leaderboard" },
        { benchmarkSlug: "mmlu-pro", score: 72.8, source: "Google DeepMind" },
        { benchmarkSlug: "math-500", score: 86.5, source: "Google Technical Report" },
      ],
    },
    {
      name: "Gemini 1.5 Flash",
      slug: "gemini-1-5-flash",
      modelId: "google/gemini-1.5-flash",
      companySlug: "google",
      description: "High-frequency, lightweight multimodal model with 1M context designed for efficiency at scale.",
      modelType: "multimodal",
      contextLength: 1000000,
      maxOutput: 8192,
      inputModalities: ["text", "image", "audio", "video"],
      outputModalities: ["text"],
      reasoning: false,
      toolCalling: true,
      structuredOutput: true,
      supportsTemperature: true,
      openWeights: false,
      deprecated: false,
      releasedAt: new Date("2024-09-24"),
      caps: ["tool-calling", "structured-output", "vision", "1m-context", "free"],
      providers: [
        { providerSlug: "google-ai", inputPrice: 0.075, outputPrice: 0.3, cachePrice: 0.01875 },
        { providerSlug: "openrouter", inputPrice: 0.075, outputPrice: 0.3, cachePrice: 0.01875 },
      ],
      benchmarks: [
        { benchmarkSlug: "arena-elo", score: 1264, source: "LMArena Leaderboard" },
        { benchmarkSlug: "humaneval", score: 82.5, source: "Google DeepMind" },
      ],
    },
    {
      name: "DeepSeek V3",
      slug: "deepseek-v3",
      modelId: "deepseek/deepseek-chat",
      companySlug: "deepseek",
      description: "671B parameter Mixture-of-Experts frontier open weights model delivering top-tier performance at disruptive cost.",
      modelType: "chat",
      contextLength: 64000,
      maxOutput: 8192,
      inputModalities: ["text"],
      outputModalities: ["text"],
      reasoning: false,
      toolCalling: true,
      structuredOutput: true,
      supportsTemperature: true,
      openWeights: true,
      deprecated: false,
      releasedAt: new Date("2024-12-26"),
      caps: ["open-weights", "tool-calling", "structured-output", "code-generation", "math"],
      providers: [
        { providerSlug: "openrouter", inputPrice: 0.14, outputPrice: 0.28, cachePrice: 0.014 },
        { providerSlug: "together-ai", inputPrice: 0.14, outputPrice: 0.28, cachePrice: 0.014 },
        { providerSlug: "fireworks", inputPrice: 0.14, outputPrice: 0.28, cachePrice: 0.014 },
        { providerSlug: "deepinfra", inputPrice: 0.14, outputPrice: 0.28, cachePrice: 0.014 },
      ],
      benchmarks: [
        { benchmarkSlug: "arena-elo", score: 1318, source: "LMArena Leaderboard" },
        { benchmarkSlug: "mmlu-pro", score: 75.9, source: "DeepSeek Official Evaluation" },
        { benchmarkSlug: "humaneval", score: 89.6, source: "DeepSeek Team" },
        { benchmarkSlug: "math-500", score: 90.2, source: "DeepSeek Benchmark" },
      ],
    },
    {
      name: "DeepSeek R1",
      slug: "deepseek-r1",
      modelId: "deepseek/deepseek-r1",
      companySlug: "deepseek",
      description: "Open-weights reasoning model developed via large-scale reinforcement learning, matching proprietary reasoning systems.",
      modelType: "reasoning",
      contextLength: 64000,
      maxOutput: 8192,
      inputModalities: ["text"],
      outputModalities: ["text"],
      reasoning: true,
      toolCalling: false,
      structuredOutput: true,
      supportsTemperature: true,
      openWeights: true,
      deprecated: false,
      releasedAt: new Date("2025-01-20"),
      caps: ["open-weights", "reasoning", "structured-output", "code-generation", "math"],
      providers: [
        { providerSlug: "openrouter", inputPrice: 0.55, outputPrice: 2.19, cachePrice: 0.14 },
        { providerSlug: "together-ai", inputPrice: 0.55, outputPrice: 2.19, cachePrice: 0.14 },
        { providerSlug: "groq", inputPrice: 0.75, outputPrice: 2.5, cachePrice: 0.2 },
        { providerSlug: "fireworks", inputPrice: 0.55, outputPrice: 2.19, cachePrice: 0.14 },
      ],
      benchmarks: [
        { benchmarkSlug: "arena-elo", score: 1364, source: "LMArena Leaderboard" },
        { benchmarkSlug: "math-500", score: 97.3, source: "DeepSeek Technical Report" },
        { benchmarkSlug: "gpqa-diamond", score: 71.5, source: "DeepSeek Team" },
        { benchmarkSlug: "swe-bench-verified", score: 49.2, source: "Community Evaluation" },
      ],
    },
    {
      name: "Llama 3.1 405B",
      slug: "llama-3-1-405b",
      modelId: "meta-llama/llama-3.1-405b-instruct",
      companySlug: "meta",
      description: "Meta's flagship 405B open-weights model capable of state-of-the-art general intelligence, synthetic data generation, and distillation.",
      modelType: "chat",
      contextLength: 128000,
      maxOutput: 4096,
      inputModalities: ["text"],
      outputModalities: ["text"],
      reasoning: false,
      toolCalling: true,
      structuredOutput: true,
      supportsTemperature: true,
      openWeights: true,
      deprecated: false,
      releasedAt: new Date("2024-07-23"),
      caps: ["open-weights", "tool-calling", "structured-output", "code-generation", "multilingual"],
      providers: [
        { providerSlug: "openrouter", inputPrice: 1.8, outputPrice: 1.8, cachePrice: 0.9 },
        { providerSlug: "together-ai", inputPrice: 1.75, outputPrice: 1.75, cachePrice: 0.8 },
        { providerSlug: "fireworks", inputPrice: 1.8, outputPrice: 1.8, cachePrice: 0.9 },
        { providerSlug: "deepinfra", inputPrice: 1.5, outputPrice: 1.5, cachePrice: 0.75 },
      ],
      benchmarks: [
        { benchmarkSlug: "arena-elo", score: 1289, source: "LMArena Leaderboard" },
        { benchmarkSlug: "mmlu-pro", score: 73.3, source: "Meta AI Paper" },
        { benchmarkSlug: "humaneval", score: 89.0, source: "Meta AI" },
        { benchmarkSlug: "gsm8k", score: 96.8, source: "Meta AI" },
      ],
    },
    {
      name: "Llama 3.3 70B",
      slug: "llama-3-3-70b",
      modelId: "meta-llama/llama-3.3-70b-instruct",
      companySlug: "meta",
      description: "Updated 70B parameter open weights model matching the intelligence of earlier 405B models at standard 70B operational efficiency.",
      modelType: "chat",
      contextLength: 128000,
      maxOutput: 4096,
      inputModalities: ["text"],
      outputModalities: ["text"],
      reasoning: false,
      toolCalling: true,
      structuredOutput: true,
      supportsTemperature: true,
      openWeights: true,
      deprecated: false,
      releasedAt: new Date("2024-12-06"),
      caps: ["open-weights", "tool-calling", "structured-output", "code-generation"],
      providers: [
        { providerSlug: "groq", inputPrice: 0.59, outputPrice: 0.79, cachePrice: 0.3 },
        { providerSlug: "openrouter", inputPrice: 0.4, outputPrice: 0.4, cachePrice: 0.2 },
        { providerSlug: "together-ai", inputPrice: 0.4, outputPrice: 0.4, cachePrice: 0.2 },
        { providerSlug: "deepinfra", inputPrice: 0.23, outputPrice: 0.4, cachePrice: 0.12 },
      ],
      benchmarks: [
        { benchmarkSlug: "arena-elo", score: 1292, source: "LMArena Leaderboard" },
        { benchmarkSlug: "mmlu-pro", score: 70.2, source: "Meta AI Release" },
        { benchmarkSlug: "humaneval", score: 88.4, source: "Meta AI" },
      ],
    },
    {
      name: "Llama 3.1 8B",
      slug: "llama-3-1-8b",
      modelId: "meta-llama/llama-3.1-8b-instruct",
      companySlug: "meta",
      description: "High-speed, compact open model capable of edge execution, fast agent loops, and zero-cost local inference.",
      modelType: "chat",
      contextLength: 128000,
      maxOutput: 4096,
      inputModalities: ["text"],
      outputModalities: ["text"],
      reasoning: false,
      toolCalling: true,
      structuredOutput: true,
      supportsTemperature: true,
      openWeights: true,
      deprecated: false,
      releasedAt: new Date("2024-07-23"),
      caps: ["open-weights", "tool-calling", "free"],
      providers: [
        { providerSlug: "groq", inputPrice: 0.05, outputPrice: 0.08, cachePrice: 0.02 },
        { providerSlug: "openrouter", inputPrice: 0.04, outputPrice: 0.04, cachePrice: 0.02 },
        { providerSlug: "deepinfra", inputPrice: 0.03, outputPrice: 0.05, cachePrice: 0.01 },
      ],
      benchmarks: [
        { benchmarkSlug: "arena-elo", score: 1184, source: "LMArena Leaderboard" },
        { benchmarkSlug: "humaneval", score: 72.6, source: "Meta AI" },
        { benchmarkSlug: "gsm8k", score: 84.5, source: "Meta AI" },
      ],
    },
    {
      name: "Mistral Large 2",
      slug: "mistral-large-2",
      modelId: "mistralai/mistral-large-2407",
      companySlug: "mistral",
      description: "123B parameter flagship model from Mistral AI with top-tier multilingual capabilities, coding proficiencies, and reasoning.",
      modelType: "chat",
      contextLength: 128000,
      maxOutput: 4096,
      inputModalities: ["text"],
      outputModalities: ["text"],
      reasoning: false,
      toolCalling: true,
      structuredOutput: true,
      supportsTemperature: true,
      openWeights: true,
      deprecated: false,
      releasedAt: new Date("2024-07-24"),
      caps: ["open-weights", "tool-calling", "structured-output", "code-generation", "multilingual"],
      providers: [
        { providerSlug: "openrouter", inputPrice: 2.0, outputPrice: 6.0, cachePrice: 1.0 },
        { providerSlug: "together-ai", inputPrice: 2.0, outputPrice: 6.0, cachePrice: 1.0 },
      ],
      benchmarks: [
        { benchmarkSlug: "arena-elo", score: 1275, source: "LMArena Leaderboard" },
        { benchmarkSlug: "mmlu-pro", score: 68.9, source: "Mistral AI Blog" },
        { benchmarkSlug: "humaneval", score: 92.1, source: "Mistral AI" },
      ],
    },
    {
      name: "Codestral 2501",
      slug: "codestral-2501",
      modelId: "mistralai/codestral-2501",
      companySlug: "mistral",
      description: "Dedicated coding model with state-of-the-art Fill-in-the-Middle (FIM) and support for over 80 programming languages.",
      modelType: "chat",
      contextLength: 256000,
      maxOutput: 4096,
      inputModalities: ["text"],
      outputModalities: ["text"],
      reasoning: false,
      toolCalling: true,
      structuredOutput: true,
      supportsTemperature: true,
      openWeights: true,
      deprecated: false,
      releasedAt: new Date("2025-01-15"),
      caps: ["open-weights", "code-generation", "tool-calling"],
      providers: [
        { providerSlug: "openrouter", inputPrice: 0.3, outputPrice: 0.9, cachePrice: 0.15 },
        { providerSlug: "together-ai", inputPrice: 0.3, outputPrice: 0.9, cachePrice: 0.15 },
      ],
      benchmarks: [
        { benchmarkSlug: "humaneval", score: 94.2, source: "Mistral Release Notes" },
        { benchmarkSlug: "swe-bench-verified", score: 39.5, source: "Mistral AI Benchmarks" },
      ],
    },
    {
      name: "Qwen 2.5 72B Instruct",
      slug: "qwen-2-5-72b",
      modelId: "qwen/qwen-2.5-72b-instruct",
      companySlug: "alibaba",
      description: "Flagship open weights LLM from Alibaba Cloud excelling at coding, mathematics, Chinese & English bilingual reasoning.",
      modelType: "chat",
      contextLength: 131072,
      maxOutput: 8192,
      inputModalities: ["text"],
      outputModalities: ["text"],
      reasoning: false,
      toolCalling: true,
      structuredOutput: true,
      supportsTemperature: true,
      openWeights: true,
      deprecated: false,
      releasedAt: new Date("2024-09-19"),
      caps: ["open-weights", "tool-calling", "structured-output", "code-generation", "math", "multilingual"],
      providers: [
        { providerSlug: "openrouter", inputPrice: 0.35, outputPrice: 0.4, cachePrice: 0.18 },
        { providerSlug: "together-ai", inputPrice: 0.35, outputPrice: 0.4, cachePrice: 0.18 },
        { providerSlug: "fireworks", inputPrice: 0.35, outputPrice: 0.4, cachePrice: 0.18 },
        { providerSlug: "deepinfra", inputPrice: 0.23, outputPrice: 0.4, cachePrice: 0.12 },
      ],
      benchmarks: [
        { benchmarkSlug: "arena-elo", score: 1297, source: "LMArena Leaderboard" },
        { benchmarkSlug: "mmlu-pro", score: 71.6, source: "Alibaba Cloud Qwen Team" },
        { benchmarkSlug: "humaneval", score: 86.6, source: "Qwen 2.5 Technical Report" },
        { benchmarkSlug: "math-500", score: 83.1, source: "Qwen Evaluation" },
      ],
    },
    {
      name: "Qwen 2.5 Coder 32B",
      slug: "qwen-2-5-coder-32b",
      modelId: "qwen/qwen-2.5-coder-32b-instruct",
      companySlug: "alibaba",
      description: "State-of-the-art specialized code intelligence open weights model rivaling GPT-4o in software engineering tasks.",
      modelType: "chat",
      contextLength: 131072,
      maxOutput: 8192,
      inputModalities: ["text"],
      outputModalities: ["text"],
      reasoning: false,
      toolCalling: true,
      structuredOutput: true,
      supportsTemperature: true,
      openWeights: true,
      deprecated: false,
      releasedAt: new Date("2024-11-12"),
      caps: ["open-weights", "code-generation", "tool-calling", "structured-output"],
      providers: [
        { providerSlug: "openrouter", inputPrice: 0.15, outputPrice: 0.15, cachePrice: 0.08 },
        { providerSlug: "together-ai", inputPrice: 0.15, outputPrice: 0.15, cachePrice: 0.08 },
        { providerSlug: "deepinfra", inputPrice: 0.1, outputPrice: 0.15, cachePrice: 0.05 },
      ],
      benchmarks: [
        { benchmarkSlug: "humaneval", score: 92.7, source: "Qwen Team Benchmark" },
        { benchmarkSlug: "swe-bench-verified", score: 41.2, source: "SWE-bench Leaderboard" },
      ],
    },
    {
      name: "Grok 2",
      slug: "grok-2",
      modelId: "xai/grok-2",
      companySlug: "xai",
      description: "xAI's flagship conversational model powered by real-time information access and strong multimodal reasoning.",
      modelType: "multimodal",
      contextLength: 131072,
      maxOutput: 4096,
      inputModalities: ["text", "image"],
      outputModalities: ["text"],
      reasoning: false,
      toolCalling: true,
      structuredOutput: true,
      supportsTemperature: true,
      openWeights: false,
      deprecated: false,
      releasedAt: new Date("2024-08-13"),
      caps: ["vision", "tool-calling", "structured-output"],
      providers: [
        { providerSlug: "openrouter", inputPrice: 2.0, outputPrice: 10.0, cachePrice: 1.0 },
      ],
      benchmarks: [
        { benchmarkSlug: "arena-elo", score: 1296, source: "LMArena Leaderboard" },
        { benchmarkSlug: "mmlu-pro", score: 71.0, source: "xAI Announcement" },
        { benchmarkSlug: "humaneval", score: 88.4, source: "xAI" },
      ],
    },
    {
      name: "GPT-3.5 Turbo",
      slug: "openai-gpt-3-5-turbo",
      modelId: "openai/gpt-3.5-turbo",
      companySlug: "openai",
      description: "Legacy fast model superseded by GPT-4o mini. Maintained for legacy backward compatibility.",
      modelType: "chat",
      contextLength: 16385,
      maxOutput: 4096,
      inputModalities: ["text"],
      outputModalities: ["text"],
      reasoning: false,
      toolCalling: true,
      structuredOutput: false,
      supportsTemperature: true,
      openWeights: false,
      deprecated: true,
      releasedAt: new Date("2023-03-01"),
      caps: ["tool-calling"],
      providers: [
        { providerSlug: "openrouter", inputPrice: 0.5, outputPrice: 1.5, cachePrice: 0.5 },
      ],
      benchmarks: [
        { benchmarkSlug: "arena-elo", score: 1115, source: "LMArena Leaderboard" },
        { benchmarkSlug: "humaneval", score: 68.0, source: "OpenAI Research" },
      ],
    },
  ];

  for (const m of modelsData) {
    const company = companies[m.companySlug];
    if (!company) continue;

    const createdModel = await prisma.model.create({
      data: {
        name: m.name,
        slug: m.slug,
        modelId: m.modelId,
        companyId: company.id,
        description: m.description,
        modelType: m.modelType,
        contextLength: m.contextLength,
        maxOutput: m.maxOutput,
        inputModalities: m.inputModalities,
        outputModalities: m.outputModalities,
        reasoning: m.reasoning,
        toolCalling: m.toolCalling,
        structuredOutput: m.structuredOutput,
        supportsTemperature: m.supportsTemperature,
        openWeights: m.openWeights,
        deprecated: m.deprecated,
        releasedAt: m.releasedAt,
      },
    });

    // Link providers
    for (const p of m.providers) {
      const provider = providers[p.providerSlug];
      if (provider) {
        await prisma.modelProvider.create({
          data: {
            modelId: createdModel.id,
            providerId: provider.id,
            inputPrice: p.inputPrice,
            outputPrice: p.outputPrice,
            cachePrice: p.cachePrice,
            availability: "available",
          },
        });
      }
    }

    // Link capabilities
    for (const capSlug of m.caps) {
      const capability = capabilities[capSlug];
      if (capability) {
        await prisma.modelCapability.create({
          data: {
            modelId: createdModel.id,
            capabilityId: capability.id,
          },
        });
      }
    }

    // Link benchmarks
    for (const bm of m.benchmarks) {
      const benchmark = benchmarks[bm.benchmarkSlug];
      if (benchmark) {
        await prisma.modelBenchmark.create({
          data: {
            modelId: createdModel.id,
            benchmarkId: benchmark.id,
            score: bm.score,
            source: bm.source,
            isDemo: false,
          },
        });
      }
    }
  }

  console.log(`Successfully seeded database with:`);
  console.log(`- ${companiesData.length} Companies (Labs)`);
  console.log(`- ${providersData.length} Providers`);
  console.log(`- ${capabilitiesData.length} Capabilities`);
  console.log(`- ${benchmarksData.length} Benchmarks`);
  console.log(`- ${modelsData.length} Frontier & Open Models`);
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
