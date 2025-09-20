// API service layer for FHIR-fly
// These functions use dummy data now but match the expected backend contracts

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

// Authentication API
export async function login(abhaId: string): Promise<LoginResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Dummy validation - accept any non-empty ABHA ID
  if (!abhaId || abhaId.trim().length === 0) {
    throw new Error('ABHA ID is required');
  }
  
  return {
    token: `dummy-token-${Date.now()}`,
    user: {
      abhaId: abhaId.trim(),
      name: `User ${abhaId.slice(-4)}`
    }
  };
}

export async function logout(): Promise<void> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  // In real implementation, this would call the backend logout endpoint
}

// Terminology Search API
export async function searchTerminology(query: string): Promise<TerminologyResult[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  if (!query || query.trim().length === 0) {
    return [];
  }
  
  // Dummy terminology data
  const dummyTerms: TerminologyResult[] = [
    {
      id: '1',
      termName: 'Jwara',
      namasteCode: 'NAM-001',
      icd11Code: 'ICD11-AB01',
      description: 'Fever or elevated body temperature'
    },
    {
      id: '2',
      termName: 'Ajeerna',
      namasteCode: 'NAM-002',
      icd11Code: 'ICD11-DD90',
      description: 'Indigestion or dyspepsia'
    },
    {
      id: '3',
      termName: 'Kasa',
      namasteCode: 'NAM-003',
      icd11Code: 'ICD11-CA40',
      description: 'Cough or respiratory condition'
    },
    {
      id: '4',
      termName: 'Shwasa',
      namasteCode: 'NAM-004',
      icd11Code: 'ICD11-CB40',
      description: 'Breathing difficulty or dyspnea'
    },
    {
      id: '5',
      termName: 'Hridroga',
      namasteCode: 'NAM-005',
      icd11Code: 'ICD11-BA00',
      description: 'Heart disease or cardiac condition'
    }
  ];
  
  // Filter results based on query
  const filteredTerms = dummyTerms.filter(term => 
    term.termName.toLowerCase().includes(query.toLowerCase()) ||
    term.namasteCode.toLowerCase().includes(query.toLowerCase()) ||
    term.icd11Code.toLowerCase().includes(query.toLowerCase())
  );
  
  return filteredTerms;
}

// Problem List API
export async function getProblemList(): Promise<ProblemListItem[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Dummy problem list data
  return [
    {
      id: '1',
      termName: 'Jwara',
      namasteCode: 'NAM-001',
      icd11Code: 'ICD11-AB01',
      addedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      termName: 'Ajeerna',
      namasteCode: 'NAM-002',
      icd11Code: 'ICD11-DD90',
      addedAt: '2024-01-14T14:20:00Z'
    }
  ];
}

export async function addProblem(term: TerminologyResult): Promise<ProblemListItem> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newProblem: ProblemListItem = {
    id: `problem-${Date.now()}`,
    termName: term.termName,
    namasteCode: term.namasteCode,
    icd11Code: term.icd11Code,
    addedAt: new Date().toISOString()
  };
  
  return newProblem;
}

export async function removeProblem(id: string): Promise<void> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // In real implementation, this would call DELETE /problem-list/:id
}

// Analytics API
export async function getAnalyticsData(): Promise<AnalyticsData[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Dummy analytics data
  return [
    { term: 'Jwara', count: 12 },
    { term: 'Ajeerna', count: 8 },
    { term: 'Kasa', count: 15 },
    { term: 'Shwasa', count: 6 },
    { term: 'Hridroga', count: 4 },
    { term: 'Pandu', count: 9 },
    { term: 'Kamala', count: 3 },
    { term: 'Mutrakrichra', count: 7 }
  ];
}

// Dashboard Stats API
export async function getDashboardStats(): Promise<{
  totalPatients: number;
  totalTermsMapped: number;
  recentProblems: number;
}> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    totalPatients: 1247,
    totalTermsMapped: 89,
    recentProblems: 23
  };
}
