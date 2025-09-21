'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type AnalyticsData } from '@/services/api';

interface ChartsProps {
  data: AnalyticsData[];
  isLoading?: boolean;
}

export function Charts({ data, isLoading = false }: ChartsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-60 sm:h-80 flex items-center justify-center">
            <div className="text-gray-500 text-sm sm:text-base">Loading analytics data...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Terminology Usage Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-60 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="term" 
                angle={-45}
                textAnchor="end"
                height={60}
                fontSize={10}
                interval={0}
              />
              <YAxis fontSize={10} />
              <Tooltip 
                formatter={(value: number) => [value, 'Count']}
                labelFormatter={(label: string) => `Term: ${label}`}
                contentStyle={{
                  fontSize: '12px',
                  padding: '8px'
                }}
              />
              <Bar 
                dataKey="count" 
                fill="#3b82f6" 
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
