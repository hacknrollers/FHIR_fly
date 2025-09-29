// API service layer for FastAPI backend integration

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.fhirfly.me';

// Backend API Types
export interface CodeSystem {
  id: string;
  external_id?: string;
  url?: string;
  version?: string;
  name?: string;
  title?: string;
  status?: string;
  publisher?: string;
  content?: string;
  meta?: any;
  resource?: any;
  created_at: string;
  updated_at: string;
}

export interface Concept {
  id: string;
  codesystem_id: string;
  code: string;
  display?: string;
  definition?: string;
  properties?: any;
  raw?: any;
  created_at: string;
  updated_at: string;
}

export interface ConceptMap {
  id: string;
  source_codesystem_id: string;
  target_codesystem_id: string;
  source_code: string;
  target_code: string;
  equivalence?: string;
  meta_data?: any;
  created_at: string;
  updated_at: string;
}

export interface TranslationRequest {
  source_codesystem: string;
  target_codesystem: string;
  source_code: string;
}

export interface TranslationResponse {
  target_code?: string;
  equivalence?: string;
  found: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// Legacy interfaces for compatibility
export interface LoginResponse {
  token: string;
  user: {
    abhaId: string;
    name: string;
  };
}

export interface TerminologyResult {
  id: string;
  termName: string;
  namasteCode: string;
  icd11Code: string;
  description?: string;
}

export interface ProblemListItem {
  id: string;
  termName: string;
  namasteCode: string;
  icd11Code: string;
  addedAt: string;
}

export interface AnalyticsData {
  term: string;
  count: number;
}

// API Helper Functions
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  console.log(`API Request: ${url}`); // Debug log

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      mode: 'cors',
      credentials: 'omit',
      ...options,
    });

    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error(`Error details: ${errorText}`);
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error(`Network error: ${error}`);
    throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Helper function to convert Concept to TerminologyResult
function conceptToTerminologyResult(concept: Concept, codesystem?: CodeSystem): TerminologyResult {
  const icd11Mapping = concept.properties?.find((prop: any) => prop.code === 'icd11Mapping');
  const icd11Code = icd11Mapping?.valueCode || concept.code;

  return {
    id: concept.id,
    termName: concept.display || concept.code,
    namasteCode: concept.code,
    icd11Code: icd11Code,
    description: concept.definition || codesystem?.title,
  };
}

// Authentication API (Legacy)
export async function login(abhaId: string): Promise<LoginResponse> {
  if (!abhaId || abhaId.length < 10) {
    throw new Error("Invalid ABHA ID");
  }

  return {
    token: `dummy-token-${Date.now()}`,
    user: {
      abhaId,
      name: `User ${abhaId.slice(-4)}`,
    },
  };
}

export async function logout(): Promise<void> {}

// Backend API Functions

// CodeSystem API
export async function getCodeSystems(page: number = 1, size: number = 10, search?: string): Promise<PaginatedResponse<CodeSystem>> {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    ...(search && { search }),
  });

  return apiRequest<PaginatedResponse<CodeSystem>>(`/api/v1/codesystems/?${params}`);
}

export async function getCodeSystem(id: string): Promise<CodeSystem> {
  return apiRequest<CodeSystem>(`/api/v1/codesystems/${id}`);
}

// Concept API
export async function getConcepts(page: number = 1, size: number = 10, codesystemId?: string, search?: string): Promise<PaginatedResponse<Concept>> {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    ...(codesystemId && { codesystem_id: codesystemId }),
    ...(search && { search }),
  });

  return apiRequest<PaginatedResponse<Concept>>(`/api/v1/concepts/?${params}`);
}

export async function getConcept(id: string): Promise<Concept> {
  return apiRequest<Concept>(`/api/v1/concepts/${id}`);
}

// ConceptMap API
export async function getConceptMaps(page: number = 1, size: number = 10, sourceCodesystemId?: string, targetCodesystemId?: string, search?: string): Promise<PaginatedResponse<ConceptMap>> {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    ...(sourceCodesystemId && { source_codesystem_id: sourceCodesystemId }),
    ...(targetCodesystemId && { target_codesystem_id: targetCodesystemId }),
    ...(search && { search }),
  });

  return apiRequest<PaginatedResponse<ConceptMap>>(`/api/v1/conceptmaps/?${params}`);
}

// Translation API
export async function translateConcept(request: TranslationRequest): Promise<TranslationResponse> {
  return apiRequest<TranslationResponse>('/api/v1/conceptmaps/translate', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

// Terminology Search API (Updated)
export async function searchTerminology(query: string): Promise<TerminologyResult[]> {
  if (!query || query.length < 2) {
    return [];
  }

  try {
    // First try conceptmaps (for Namaste ↔ ICD-11)
    const conceptMapsResponse = await getConceptMaps(1, 20, undefined, undefined, query);
    if (conceptMapsResponse.items.length > 0) {
      return conceptMapsResponse.items.map(map => ({
        id: map.id,
        termName: map.meta_data?.display || map.source_code,
        namasteCode: map.source_code,
        icd11Code: map.target_code,
        description: map.meta_data?.definition || "",
      }));
    }

    // Fallback: use concepts if no mappings found
    const conceptsResponse = await getConcepts(1, 20, undefined, query);
    const concepts = conceptsResponse.items;
    const codesystemsResponse = await getCodeSystems(1, 100);
    const codesystems = codesystemsResponse.items;

    return concepts.map(concept => {
      const codesystem = codesystems.find(cs => cs.id === concept.codesystem_id);
      return conceptToTerminologyResult(concept, codesystem);
    });
  } catch (error) {
    console.error('Failed to search terminology:', error);
    return [];
  }
}


// Problem List API
export async function getProblemList(): Promise<ProblemListItem[]> {
  try {
    const conceptsResponse = await getConcepts(1, 50);
    const concepts = conceptsResponse.items;

    const codesystemsResponse = await getCodeSystems(1, 100);
    const codesystems = codesystemsResponse.items;

    return concepts.map(concept => {
      const codesystem = codesystems.find(cs => cs.id === concept.codesystem_id);
      const termResult = conceptToTerminologyResult(concept, codesystem);

      return {
        id: concept.id,
        termName: termResult.termName,
        namasteCode: termResult.namasteCode,
        icd11Code: termResult.icd11Code,
        addedAt: concept.created_at,
      };
    });
  } catch (error) {
    console.error('Failed to get problem list:', error);
    return [];
  }
}

export async function addProblem(term: TerminologyResult): Promise<ProblemListItem> {
  return {
    id: `problem-${Date.now()}`,
    termName: term.termName,
    namasteCode: term.namasteCode,
    icd11Code: term.icd11Code,
    addedAt: new Date().toISOString(),
  };
}

export async function removeProblem(id: string): Promise<void> {
  console.log(`Removing problem: ${id}`);
}

// Analytics API
export async function getAnalyticsData(): Promise<AnalyticsData[]> {
  try {
    const conceptsResponse = await getConcepts(1, 100);
    const concepts = conceptsResponse.items;

    const termCounts: { [key: string]: number } = {};
    concepts.forEach(concept => {
      const term = concept.display || concept.code;
      termCounts[term] = (termCounts[term] || 0) + 1;
    });

    return Object.entries(termCounts).map(([term, count]) => ({ term, count }));
  } catch (error) {
    console.error('Failed to get analytics data:', error);
    return [];
  }
}

// Dashboard API
export async function getDashboardStats(): Promise<{
  totalPatients: number;
  totalTermsMapped: number;
  recentProblems: number;
}> {
  try {
    const [conceptsResponse, codesystemsResponse] = await Promise.all([
      getConcepts(1, 1),
      getCodeSystems(1, 1),
    ]);

    return {
      totalPatients: 1247,
      totalTermsMapped: conceptsResponse.total,
      recentProblems: Math.min(conceptsResponse.total, 23),
    };
  } catch (error) {
    console.error('Failed to get dashboard stats:', error);
    return {
      totalPatients: 0,
      totalTermsMapped: 0,
      recentProblems: 0,
    };
  }
}