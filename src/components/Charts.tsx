'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';
import { AnalyticsData } from '@/lib/api';

interface ChartsProps {
  data: AnalyticsData[];
  isLoading?: boolean;
}

export function Charts({ data, isLoading = false }: ChartsProps) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500">
          <p>No analytics data available.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Terminology Usage Analytics</h3>
        <p className="text-sm text-gray-600">Frequency of terms in problem lists</p>
      </div>
      <div className="p-6">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="term" 
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={12}
            />
            <YAxis 
              label={{ value: 'Count', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value: number) => [value, 'Usage Count']}
              labelFormatter={(label: string) => `Term: ${label}`}
            />
            <Bar 
              dataKey="count" 
              fill="#3b82f6" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
