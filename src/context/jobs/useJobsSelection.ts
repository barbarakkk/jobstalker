
import { useState } from 'react';
import { Job } from '@/types/job';

export const useJobsSelection = (jobs: Job[]) => {
  const [selectedJobIds, setSelectedJobIds] = useState<Set<string>>(new Set());

  const handleToggleSelect = (jobId: string) => {
    const newSelected = new Set(selectedJobIds);
    if (newSelected.has(jobId)) {
      newSelected.delete(jobId);
    } else {
      newSelected.add(jobId);
    }
    setSelectedJobIds(newSelected);
  };

  const handleSelectAll = (select: boolean) => {
    if (select) {
      setSelectedJobIds(new Set(jobs.map(job => job.id)));
    } else {
      setSelectedJobIds(new Set());
    }
  };

  return {
    selectedJobIds,
    setSelectedJobIds,
    handleToggleSelect,
    handleSelectAll
  };
};
