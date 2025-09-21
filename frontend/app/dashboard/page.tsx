'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, List, TrendingUp } from 'lucide-react';
import { getDashboardStats } from '@/services/api';

interface DashboardStats {
  totalPatients: number;
  totalTermsMapped: number;
  recentProblems: number;
}

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      loadStats();
    }
  }, [user, authLoading, router]);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const statCards = [
    {
      title: 'Total Patients',
      value: stats?.totalPatients || 0,
      description: 'Registered patients in system',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Terms Mapped',
      value: stats?.totalTermsMapped || 0,
      description: 'Terminology mappings completed',
      icon: BookOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Recent Problems',
      value: stats?.recentProblems || 0,
      description: 'Problems added this week',
      icon: List,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Growth Rate',
      value: '+12%',
      description: 'Month over month growth',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  return (
    <Layout>
      <div className="p-4 sm:p-6 lg:p-8 particle-bg">
        <div className="mb-6 sm:mb-8 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Dashboard
          </h1>
          <p className="text-slate-900 mt-2 text-sm sm:text-base font-medium">
            Welcome to FHIR-fly terminology management system.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {statCards.map((card, index) => (
            <Card 
              key={index} 
              className={`card-hover hover-lift border-slate-200 animate-slide-up`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-slate-600">
                  {card.title}
                </CardTitle>
                <div className={`p-2 sm:p-2.5 rounded-lg ${card.bgColor}`}>
                  <card.icon className={`h-3 w-3 sm:h-4 sm:w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold text-slate-800">
                  {card.value}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Card className="card-hover hover-lift border-slate-200 animate-slide-in-left">
            <CardHeader>
              <CardTitle className="text-slate-800 text-lg sm:text-xl">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 sm:space-y-3">
                <button
                  onClick={() => router.push('/terminology')}
                  className="w-full flex items-center justify-between p-3 sm:p-4 rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 hover-scale"
                >
                  <div className="text-left">
                    <div className="font-medium text-slate-800 text-sm sm:text-base">Search Terminology</div>
                    <div className="text-xs sm:text-sm text-slate-500">Find and map medical terms</div>
                  </div>
                  <div className="text-blue-600 font-medium text-sm sm:text-base">Go →</div>
                </button>
                <button
                  onClick={() => router.push('/problems')}
                  className="w-full flex items-center justify-between p-3 sm:p-4 rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 hover-scale"
                >
                  <div className="text-left">
                    <div className="font-medium text-slate-800 text-sm sm:text-base">View Problem List</div>
                    <div className="text-xs sm:text-sm text-slate-500">Manage patient problems</div>
                  </div>
                  <div className="text-blue-600 font-medium text-sm sm:text-base">Go →</div>
                </button>
                <button
                  onClick={() => router.push('/analytics')}
                  className="w-full flex items-center justify-between p-3 sm:p-4 rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 hover-scale"
                >
                  <div className="text-left">
                    <div className="font-medium text-slate-800 text-sm sm:text-base">View Analytics</div>
                    <div className="text-xs sm:text-sm text-slate-500">Terminology usage insights</div>
                  </div>
                  <div className="text-blue-600 font-medium text-sm sm:text-base">Go →</div>
                </button>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover hover-lift border-slate-200 animate-slide-in-right">
            <CardHeader>
              <CardTitle className="text-slate-800 text-lg sm:text-xl">System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between py-2">
                  <span className="text-xs sm:text-sm font-medium text-slate-700">API Status</span>
                  <span className="text-green-600 font-medium text-xs sm:text-sm">Online</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-xs sm:text-sm font-medium text-slate-700">Database</span>
                  <span className="text-green-600 font-medium text-xs sm:text-sm">Connected</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-xs sm:text-sm font-medium text-slate-700">FHIR Server</span>
                  <span className="text-orange-600 font-medium text-xs sm:text-sm">Mock Mode</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-xs sm:text-sm font-medium text-slate-700">Last Sync</span>
                  <span className="text-slate-600 font-medium text-xs sm:text-sm">2 minutes ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
