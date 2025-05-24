
import { Job } from '@/types/job';
import { TimeRange } from '@/pages/Statistics';

export const filterJobsByTimeRange = (jobs: Job[], timeRange: TimeRange): Job[] => {
  if (timeRange === 'alltime') {
    return jobs;
  }

  const now = new Date();
  let cutoffDate: Date;

  switch (timeRange) {
    case 'last30days':
      cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case 'last6months':
      cutoffDate = new Date(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000);
      break;
    default:
      return jobs;
  }

  return jobs.filter(job => {
    // Use dateSaved as the primary filter date, fallback to dateApplied if available
    const jobDate = job.dateSaved ? new Date(job.dateSaved) : 
                    job.dateApplied ? new Date(job.dateApplied) : null;
    
    if (!jobDate) return false;
    
    return jobDate >= cutoffDate;
  });
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
