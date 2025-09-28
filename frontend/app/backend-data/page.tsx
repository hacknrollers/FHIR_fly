'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, Code, Map, Activity, RefreshCw } from 'lucide-react';
import { 
  getCodeSystems, 
  getConcepts, 
  getConceptMaps, 
  type CodeSystem, 
  type Concept, 
  type ConceptMap 
} from '@/services/api';

export default function BackendDataPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [codeSystems, setCodeSystems] = useState<CodeSystem[]>([]);
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [conceptMaps, setConceptMaps] = useState<ConceptMap[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'codesystems' | 'concepts' | 'conceptmaps'>('codesystems');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      loadData();
    }
  }, [user, authLoading, router]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      const [codeSystemsResponse, conceptsResponse, conceptMapsResponse] = await Promise.all([
        getCodeSystems(1, 20),
        getConcepts(1, 20),
        getConceptMaps(1, 20)
      ]);
      
      setCodeSystems(codeSystemsResponse.items);
      setConcepts(conceptsResponse.items);
      setConceptMaps(conceptMapsResponse.items);
    } catch (error) {
      console.error('Failed to load backend data:', error);
      // Set empty arrays on error to show 0 counts
      setCodeSystems([]);
      setConcepts([]);
      setConceptMaps([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading backend data...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const tabs = [
    { id: 'codesystems', label: 'Code Systems', icon: Database, count: codeSystems.length },
    { id: 'concepts', label: 'Concepts', icon: Code, count: concepts.length },
    { id: 'conceptmaps', label: 'Concept Maps', icon: Map, count: conceptMaps.length }
  ];

  return (
    <Layout>
      <div className="p-4 sm:p-6 particle-bg">
        <div className="mb-6 sm:mb-8 animate-fade-in">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 animate-slide-up">
                Backend Data
              </h1>
              <p className="text-slate-900 mt-2 text-sm sm:text-base font-medium animate-slide-up" style={{ animationDelay: '0.1s' }}>
                View data from your FastAPI backend and Supabase database.
              </p>
            </div>
            <Button
              onClick={loadData}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="mr-2 h-4 w-4" />
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'codesystems' && (
            <Card className="card-hover hover-lift border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center text-lg sm:text-xl text-slate-800">
                  <Database className="mr-2 h-5 w-5" />
                  Code Systems ({codeSystems.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {codeSystems.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Database className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <p>No code systems found in the database.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {codeSystems.map((cs) => (
                      <div key={cs.id} className="p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-900">{cs.name || cs.title || 'Unnamed'}</h3>
                            <p className="text-sm text-gray-600 mt-1">{cs.url}</p>
                            {cs.version && (
                              <p className="text-xs text-gray-500 mt-1">Version: {cs.version}</p>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(cs.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'concepts' && (
            <Card className="card-hover hover-lift border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center text-lg sm:text-xl text-slate-800">
                  <Code className="mr-2 h-5 w-5" />
                  Concepts ({concepts.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {concepts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Code className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <p>No concepts found in the database.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {concepts.map((concept) => (
                      <div key={concept.id} className="p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-900">{concept.display || concept.code}</h3>
                            <p className="text-sm text-gray-600 mt-1">Code: {concept.code}</p>
                            {concept.definition && (
                              <p className="text-sm text-gray-600 mt-1">{concept.definition}</p>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(concept.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'conceptmaps' && (
            <Card className="card-hover hover-lift border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center text-lg sm:text-xl text-slate-800">
                  <Map className="mr-2 h-5 w-5" />
                  Concept Maps ({conceptMaps.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {conceptMaps.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Map className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <p>No concept maps found in the database.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {conceptMaps.map((cm) => (
                      <div key={cm.id} className="p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {cm.source_code} → {cm.target_code}
                            </h3>
                            {cm.equivalence && (
                              <p className="text-sm text-gray-600 mt-1">Equivalence: {cm.equivalence}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              Source: {cm.source_codesystem_id} | Target: {cm.target_codesystem_id}
                            </p>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(cm.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="mt-6 sm:mt-8">
          <Card className="card-hover hover-lift border-slate-200 animate-fade-in">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl text-slate-800">Backend Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">FastAPI Backend</h4>
                  <p className="text-gray-600">
                    Connected to your FastAPI backend at https://api.fhirfly.me
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Supabase Database</h4>
                  <p className="text-gray-600">
                    Data is stored in your Supabase PostgreSQL database
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Real-time Data</h4>
                  <p className="text-gray-600">
                    All data is fetched live from your backend API
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
