
import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/context/auth';
import { JobsContextType } from './types';
import { useJobsSelection } from './useJobsSelection';
import { useJobsActions } from './useJobsActions';
import { useJobsFetching } from './useJobsFetching';

const JobsContext = createContext<JobsContextType | undefined>(undefined);

export const JobsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { jobs, setJobs, isLoading } = useJobsFetching(user?.id);
  const { selectedJobIds, setSelectedJobIds, handleToggleSelect, handleSelectAll } = useJobsSelection(jobs);
  const { addJob, updateJob, deleteJob } = useJobsActions(jobs, setJobs, setSelectedJobIds);

  return (
    <JobsContext.Provider value={{
      jobs,
      isLoading,
      selectedJobIds,
      setSelectedJobIds,
      handleToggleSelect,
      handleSelectAll,
      addJob,
      updateJob,
      deleteJob,
    }}>
      {children}
    </JobsContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobsContext);
  if (context === undefined) {
    throw new Error('useJobs must be used within a JobsProvider');
  }
  return context;
};
