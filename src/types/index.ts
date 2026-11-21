export interface Company {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  website?: string | null;
  logo?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  _count?: {
    models: number;
  };
}

export interface Provider {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  website?: string | null;
  logo?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  _count?: {
    models: number;
  };
}

export interface ModelProvider {
  id: string;
  modelId: string;
  providerId: string;
  provider: Provider;
  inputPrice?: number | null;
  outputPrice?: number | null;
  cachePrice?: number | null;
  availability: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Capability {
  id: string;
  name: string;
  slug: string;
  category: string;
}

export interface ModelCapability {
  id: string;
  modelId: string;
  capabilityId: string;
  capability: Capability;
}

export interface Benchmark {
  id: string;
  name: string;
  slug: string;
  category: string;
  description?: string | null;
}

export interface ModelBenchmark {
  id: string;
  modelId: string;
  benchmarkId: string;
  benchmark: Benchmark;
  score: number;
  source?: string | null;
  isDemo: boolean;
}

export interface Model {
  id: string;
  name: string;
  slug: string;
  modelId: string;
  description?: string | null;
  companyId: string;
  company: Company;
  modelType: string;
  contextLength?: number | null;
  maxOutput?: number | null;
  inputModalities: string[];
  outputModalities: string[];
  reasoning: boolean;
  toolCalling: boolean;
  structuredOutput: boolean;
  supportsTemperature: boolean;
  openWeights: boolean;
  deprecated: boolean;
  releasedAt?: string | Date | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  providers?: ModelProvider[];
  capabilities?: ModelCapability[];
  benchmarks?: ModelBenchmark[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: string;
}
