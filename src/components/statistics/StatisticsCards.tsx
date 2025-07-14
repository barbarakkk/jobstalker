
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Job } from '@/types/job';
import { TrendingUp, Users, Clock, Target } from 'lucide-react';

interface StatisticsCardsProps {
  jobs: Job[];
}

const StatisticsCards: React.FC<StatisticsCardsProps> = ({ jobs }) => {
  const metrics = React.useMemo(() => {
    const totalJobs = jobs.length;
    const appliedJobs = jobs.filter(job => job.status === 'applied').length;
    const interviewingJobs = jobs.filter(job => job.status === 'interviewing').length;
    const acceptedJobs = jobs.filter(job => job.status === 'accepted').length;
    const rejectedJobs = jobs.filter(job => job.status === 'rejected').length;

    // Conversion rate: Accepted / (Applied + Interviewing + Accepted + Rejected)
    const totalProcessedJobs = appliedJobs + interviewingJobs + acceptedJobs + rejectedJobs;
    const conversionRate = totalProcessedJobs > 0 ? (acceptedJobs / totalProcessedJobs) * 100 : 0;

    // Average response time calculation (simplified - using date applied to current date)
    const jobsWithDates = jobs.filter(job => job.dateApplied && job.status !== 'bookmarked');
    let avgResponseTime = 0;
    
    if (jobsWithDates.length > 0) {
      const totalDays = jobsWithDates.reduce((sum, job) => {
        if (!job.dateApplied) return sum;
        const appliedDate = new Date(job.dateApplied);
        const now = new Date();
        const daysDiff = Math.floor((now.getTime() - appliedDate.getTime()) / (1000 * 60 * 60 * 24));
        return sum + daysDiff;
      }, 0);
      avgResponseTime = Math.round(totalDays / jobsWithDates.length);
    }

    return {
      totalApplications: appliedJobs + interviewingJobs + acceptedJobs + rejectedJobs,
      conversionRate: conversionRate.toFixed(1),
      avgResponseTime,
      activeApplications: appliedJobs + interviewingJobs
    };
  }, [jobs]);

  const cards = [
    {
      title: 'Total Applications',
      value: metrics.totalApplications.toString(),
      icon: Target,
      description: 'Jobs actively pursued',
      color: 'text-blue-600'
    },
    {
      title: 'Conversion Rate',
      value: `${metrics.conversionRate}%`,
      icon: TrendingUp,
      description: 'Acceptance rate',
      color: 'text-green-600'
    },
    {
      title: 'Avg Response Time',
      value: `${metrics.avgResponseTime} days`,
      icon: Clock,
      description: 'Average days since applied',
      color: 'text-purple-600'
    },
    {
      title: 'Active Applications',
      value: metrics.activeApplications.toString(),
      icon: Users,
      description: 'Currently in progress',
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {card.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{card.value}</div>
              <p className="text-xs text-gray-500 mt-1">{card.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatisticsCards;
