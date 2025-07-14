
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Job } from '@/types/job';

interface StatisticsChartsProps {
  jobs: Job[];
}

const STATUS_COLORS = {
  bookmarked: '#3B82F6',
  applying: '#F97316', 
  applied: '#EAB308',
  interviewing: '#A855F7',
  accepted: '#10B981',
  rejected: '#EF4444'
};

const STATUS_LABELS = {
  bookmarked: 'Bookmarked',
  applying: 'Applying',
  applied: 'Applied',
  interviewing: 'Interviewing', 
  accepted: 'Accepted',
  rejected: 'Rejected'
};

const StatisticsCharts: React.FC<StatisticsChartsProps> = ({ jobs }) => {
  const statusData = React.useMemo(() => {
    const statusCounts = jobs.reduce((acc, job) => {
      acc[job.status] = (acc[job.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: STATUS_LABELS[status as keyof typeof STATUS_LABELS] || status,
      value: count,
      color: STATUS_COLORS[status as keyof typeof STATUS_COLORS] || '#6B7280'
    }));
  }, [jobs]);

  const totalJobs = jobs.length;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / totalJobs) * 100).toFixed(1);
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-gray-600">
            {data.value} jobs ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-col space-y-2 ml-4">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm font-medium text-gray-700">{entry.value}</span>
            <span className="text-sm text-gray-500">
              ({statusData.find(d => d.name === entry.value)?.value || 0})
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row items-center justify-center">
          <div className="relative w-full lg:w-2/3">
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={160}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{totalJobs}</div>
                <div className="text-sm font-medium text-gray-600">Total Jobs</div>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/3 mt-4 lg:mt-0">
            <CustomLegend payload={statusData.map(d => ({ value: d.name, color: d.color }))} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatisticsCharts;
