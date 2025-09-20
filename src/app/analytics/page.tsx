'use client';

import { useQuery } from '@tanstack/react-query';
import { Layout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Charts } from '@/components/Charts';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getAnalyticsData, getProblemList } from '@/lib/api';
import { BarChart3, TrendingUp, Users, BookOpen, Activity } from 'lucide-react';

export default function AnalyticsPage() {
  const { data: analyticsData = [], isLoading: analyticsLoading } = useQuery({
    queryKey: ['analytics-data'],
    queryFn: getAnalyticsData,
  });

  const { data: problemList = [] } = useQuery({
    queryKey: ['problem-list'],
    queryFn: getProblemList,
  });

  // Calculate additional metrics
  const totalTerms = analyticsData.reduce((sum, item) => sum + item.count, 0);
  const mostUsedTerm = analyticsData.reduce((max, item) => 
    item.count > max.count ? item : max, 
    { term: 'N/A', count: 0 }
  );
  const uniqueTerms = analyticsData.length;
  const averageUsage = totalTerms > 0 ? Math.round(totalTerms / uniqueTerms * 10) / 10 : 0;

  return (
    <ProtectedRoute>
      <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-2">Terminology usage insights and system metrics</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-500">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Usage</p>
                <p className="text-2xl font-semibold text-gray-900">{totalTerms}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-500">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Unique Terms</p>
                <p className="text-2xl font-semibold text-gray-900">{uniqueTerms}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-orange-500">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Most Used</p>
                <p className="text-lg font-semibold text-gray-900">{mostUsedTerm.term}</p>
                <p className="text-xs text-gray-500">{mostUsedTerm.count} times</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-500">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Usage</p>
                <p className="text-2xl font-semibold text-gray-900">{averageUsage}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Chart */}
        <Charts data={analyticsData} isLoading={analyticsLoading} />

        {/* Detailed Statistics */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Terms by Usage</h3>
            <div className="space-y-3">
              {analyticsData
                .sort((a, b) => b.count - a.count)
                .slice(0, 10)
                .map((item, index) => (
                  <div key={item.term} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-medium flex items-center justify-center mr-3">
                        {index + 1}
                      </div>
                      <span className="font-medium text-gray-900">{item.term}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(item.count / mostUsedTerm.count) * 100}%` }}
                        />
                      </div>
                      <Badge variant="secondary">{item.count}</Badge>
                    </div>
                  </div>
                ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Problem List Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Problems</span>
                <span className="font-semibold">{problemList.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">NAMASTE Codes</span>
                <span className="font-semibold">
                  {new Set(problemList.map(p => p.namasteCode)).size}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">ICD-11 Codes</span>
                <span className="font-semibold">
                  {new Set(problemList.map(p => p.icd11Code)).size}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Recent Additions</span>
                <span className="font-semibold">
                  {problemList.filter(p => {
                    const addedDate = new Date(p.addedAt);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return addedDate > weekAgo;
                  }).length}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Usage Trends */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Distribution</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { range: '1-5 times', count: analyticsData.filter(item => item.count >= 1 && item.count <= 5).length },
              { range: '6-10 times', count: analyticsData.filter(item => item.count >= 6 && item.count <= 10).length },
              { range: '11+ times', count: analyticsData.filter(item => item.count >= 11).length },
            ].map((category) => (
              <div key={category.range} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{category.count}</div>
                <div className="text-sm text-gray-600">{category.range}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* System Health */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="text-center">
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mb-2">
                Online
              </div>
              <div className="text-sm text-gray-600">API Status</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mb-2">
                Active
              </div>
              <div className="text-sm text-gray-600">Database</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mb-2">
                Mock Mode
              </div>
              <div className="text-sm text-gray-600">FHIR Server</div>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
    </ProtectedRoute>
  );
}
