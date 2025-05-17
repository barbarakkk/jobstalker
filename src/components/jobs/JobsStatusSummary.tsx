
import React from 'react';
import { JOB_STATUSES, type JobStatus } from '@/types/job';
import JobStatusColumn from '@/components/jobs/JobStatusColumn';
import { useJobs } from '@/context/jobs/JobsContext';

const JobsStatusSummary: React.FC = () => {
  const { jobs } = useJobs();

  // Get counts by status
  const statusCounts = JOB_STATUSES.reduce<Record<JobStatus, number>>((acc, status) => {
    acc[status] = jobs.filter(job => job.status === status).length;
    return acc;
  }, {
    bookmarked: 0,
    applying: 0, 
    applied: 0, 
    interviewing: 0, 
    accepted: 0,
    rejected: 0
  });

  return (
    <div className="flex flex-wrap justify-between mb-6 gap-4">
      {JOB_STATUSES.filter(status => status !== 'rejected').map((status) => (
        <JobStatusColumn 
          key={status}
          status={status} 
          count={statusCounts[status]} 
        />
      ))}
    </div>
  );
};

export default JobsStatusSummary;
