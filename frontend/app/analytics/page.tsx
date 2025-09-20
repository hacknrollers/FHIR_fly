'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { Charts } from '@/components/Charts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Activity, Users } from 'lucide-react';
import { getAnalyticsData, type AnalyticsData } from '@/services/api';

export default function AnalyticsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      loadAnalyticsData();
    }
  }, [user, authLoading, router]);

  const loadAnalyticsData = async () => {
    try {
      setIsLoading(true);
      const data = await getAnalyticsData();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const totalUsage = analyticsData.reduce((sum, item) => sum + item.count, 0);
  const topTerm = analyticsData.reduce((max, item) => 
    item.count > max.count ? item : max, 
    { term: '', count: 0 }
  );

  const summaryCards = [
    {
      title: 'Total Usage',
      value: totalUsage,
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Unique Terms',
      value: analyticsData.length,
      icon: BarChart3,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Most Used',
      value: topTerm.term || 'N/A',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Avg. Usage',
      value: analyticsData.length > 0 ? Math.round(totalUsage / analyticsData.length) : 0,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-2">
            Analyze terminology usage patterns and system performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {summaryCards.map((card, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${card.bgColor}`}>
                  <card.icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {card.title === 'Most Used' ? 'Term name' : 'Total count'}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Charts data={analyticsData} isLoading={isLoading} />
          
          <Card>
            <CardHeader>
              <CardTitle>Top Terms</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {analyticsData
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 5)
                    .map((item, index) => (
                      <div key={item.term} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                            {index + 1}
                          </div>
                          <span className="font-medium">{item.term}</span>
                        </div>
                        <div className="text-sm text-gray-600">{item.count} uses</div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Usage Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading...</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {analyticsData.map((item) => {
                    const percentage = totalUsage > 0 ? (item.count / totalUsage) * 100 : 0;
                    return (
                      <div key={item.term} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{item.term}</span>
                          <span className="text-gray-600">{item.count}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Most Active Term</h4>
                  <p className="text-gray-600">
                    {topTerm.term} is used {topTerm.count} times, representing{' '}
                    {totalUsage > 0 ? Math.round((topTerm.count / totalUsage) * 100) : 0}% of all usage.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Usage Pattern</h4>
                  <p className="text-gray-600">
                    {analyticsData.length} unique terms have been used with an average of{' '}
                    {analyticsData.length > 0 ? Math.round(totalUsage / analyticsData.length) : 0} uses per term.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Data Source</h4>
                  <p className="text-gray-600">
                    Analytics are generated from problem list entries and terminology searches.
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
