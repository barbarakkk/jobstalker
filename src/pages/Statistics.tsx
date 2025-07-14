
import React, { useState, useMemo } from 'react';
import { useJobs } from '@/context/jobs/JobsContext';
import DashboardNavbar from '@/components/DashboardNavbar';
import StatisticsCharts from '@/components/statistics/StatisticsCharts';
import StatisticsCards from '@/components/statistics/StatisticsCards';
import TimeRangeFilter from '@/components/statistics/TimeRangeFilter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { filterJobsByTimeRange } from '@/utils/dateUtils';

export type TimeRange = 'last30days' | 'last6months' | 'alltime';

const Statistics: React.FC = () => {
  const { jobs, isLoading } = useJobs();
  const [timeRange, setTimeRange] = useState<TimeRange>('alltime');

  const filteredJobs = useMemo(() => {
    return filterJobsByTimeRange(jobs, timeRange);
  }, [jobs, timeRange]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardNavbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Job Application Statistics</h1>
            <p className="text-gray-600 mt-2">Track your job search progress and metrics</p>
          </div>
          <TimeRangeFilter timeRange={timeRange} onTimeRangeChange={setTimeRange} />
        </div>

        {filteredJobs.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
                <p className="text-gray-500">
                  {timeRange === 'alltime' 
                    ? 'Start adding jobs to see your statistics'
                    : 'No jobs found for the selected time range'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            <StatisticsCards jobs={filteredJobs} />
            <StatisticsCharts jobs={filteredJobs} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Statistics;
