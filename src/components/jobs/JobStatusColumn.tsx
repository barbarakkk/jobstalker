
import React from 'react';
import { cn } from '@/lib/utils';
import { type JobStatus } from '@/types/job';

interface JobStatusColumnProps {
  status: JobStatus;
  count: number;
}

const StatusConfig: Record<JobStatus, { label: string, colorClass: string }> = {
  bookmarked: { 
    label: 'BOOKMARKED', 
    colorClass: 'bg-white border-blue-200' 
  },
  applying: { 
    label: 'APPLYING', 
    colorClass: 'bg-white border-orange-200' 
  },
  applied: { 
    label: 'APPLIED', 
    colorClass: 'bg-white border-yellow-200' 
  },
  interviewing: { 
    label: 'INTERVIEWING', 
    colorClass: 'bg-white border-purple-200' 
  },
  accepted: { 
    label: 'ACCEPTED', 
    colorClass: 'bg-white border-green-200' 
  },
  rejected: { 
    label: 'REJECTED', 
    colorClass: 'bg-white border-red-200' 
  }
};

const JobStatusColumn: React.FC<JobStatusColumnProps> = ({ status, count }) => {
  const config = StatusConfig[status];
  
  return (
    <div className={cn(
      "flex-1 text-center p-5 rounded-lg shadow border-t-4",
      config.colorClass
    )}>
      <div className="text-xl font-bold text-gray-700">{count}</div>
      <div className="text-xs font-medium text-gray-500 mt-1">{config.label}</div>
    </div>
  );
};

export default JobStatusColumn;
