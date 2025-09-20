// API service layer with dummy functions for backend integration
// These functions will be replaced by real API calls when backend is ready

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

// Dummy data for development
const dummyTerminologyResults: TerminologyResult[] = [
  {
    id: "1",
    termName: "Jwara",
    namasteCode: "NAM001",
    icd11Code: "ICD11-001",
    description: "Fever in Ayurvedic terminology"
  },
  {
    id: "2", 
    termName: "Ajeerna",
    namasteCode: "NAM002",
    icd11Code: "ICD11-002",
    description: "Indigestion in Ayurvedic terminology"
  },
  {
    id: "3",
    termName: "Kasa",
    namasteCode: "NAM003", 
    icd11Code: "ICD11-003",
    description: "Cough in Ayurvedic terminology"
  },
  {
    id: "4",
    termName: "Shwasa",
    namasteCode: "NAM004",
    icd11Code: "ICD11-004", 
    description: "Breathing difficulty in Ayurvedic terminology"
  }
];

const dummyProblemList: ProblemListItem[] = [
  {
    id: "1",
    termName: "Jwara",
    namasteCode: "NAM001",
    icd11Code: "ICD11-001",
    addedAt: "2024-01-15T10:30:00Z"
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Authentication API
export async function login(abhaId: string): Promise<LoginResponse> {
  await delay(1000); // Simulate API call
  
  if (!abhaId || abhaId.length < 10) {
    throw new Error("Invalid ABHA ID");
  }
  
  return {
    token: `dummy-token-${Date.now()}`,
    user: {
      abhaId,
      name: `User ${abhaId.slice(-4)}`
    }
  };
}

export async function logout(): Promise<void> {
  await delay(500);
  // In real implementation, this would call logout endpoint
}

// Terminology Search API
export async function searchTerminology(query: string): Promise<TerminologyResult[]> {
  await delay(800); // Simulate API call
  
  if (!query || query.length < 2) {
    return [];
  }
  
  const filtered = dummyTerminologyResults.filter(term =>
    term.termName.toLowerCase().includes(query.toLowerCase()) ||
    term.namasteCode.toLowerCase().includes(query.toLowerCase()) ||
    term.icd11Code.toLowerCase().includes(query.toLowerCase())
  );
  
  return filtered;
}

// Problem List API
export async function getProblemList(): Promise<ProblemListItem[]> {
  await delay(600);
  return [...dummyProblemList];
}

export async function addProblem(term: TerminologyResult): Promise<ProblemListItem> {
  await delay(500);
  
  const newProblem: ProblemListItem = {
    id: `problem-${Date.now()}`,
    termName: term.termName,
    namasteCode: term.namasteCode,
    icd11Code: term.icd11Code,
    addedAt: new Date().toISOString()
  };
  
  dummyProblemList.push(newProblem);
  return newProblem;
}

export async function removeProblem(id: string): Promise<void> {
  await delay(400);
  
  const index = dummyProblemList.findIndex(problem => problem.id === id);
  if (index > -1) {
    dummyProblemList.splice(index, 1);
  }
}

// Analytics API
export async function getAnalyticsData(): Promise<AnalyticsData[]> {
  await delay(700);
  
  // Return dummy analytics data
  return [
    { term: "Jwara", count: 12 },
    { term: "Ajeerna", count: 8 },
    { term: "Kasa", count: 15 },
    { term: "Shwasa", count: 6 },
    { term: "Pandu", count: 4 },
    { term: "Kamala", count: 3 }
  ];
}

// Dashboard API
export async function getDashboardStats(): Promise<{
  totalPatients: number;
  totalTermsMapped: number;
  recentProblems: number;
}> {
  await delay(500);
  
  return {
    totalPatients: 1247,
    totalTermsMapped: 89,
    recentProblems: 23
  };
}
