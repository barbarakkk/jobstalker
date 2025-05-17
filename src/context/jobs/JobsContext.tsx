
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Job, JobStatus } from '@/types/job';
import { useAuth } from '@/context/auth';

type JobsContextType = {
  jobs: Job[];
  isLoading: boolean;
  selectedJobIds: Set<string>;
  setSelectedJobIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  handleToggleSelect: (jobId: string) => void;
  handleSelectAll: (select: boolean) => void;
  addJob: (job: Job) => Promise<void>;
  updateJob: (updatedJob: Job) => Promise<void>;
  deleteJob: (jobId: string) => Promise<void>;
};

const JobsContext = createContext<JobsContextType | undefined>(undefined);

export const JobsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJobIds, setSelectedJobIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  // Fetch jobs from Supabase
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        if (!user) return;
        
        setIsLoading(true);
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching jobs:', error);
          toast({
            title: 'Error fetching jobs',
            description: error.message,
            variant: 'destructive'
          });
          return;
        }

        // Transform database records to match our Job type
        const transformedJobs: Job[] = data.map(job => ({
          id: job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          salary: job.salary || undefined,
          description: job.description || undefined,
          jobUrl: job.job_url || undefined,
          status: job.status as JobStatus,
          dateSaved: new Date(job.date_saved).toLocaleDateString(),
          dateApplied: job.date_applied ? new Date(job.date_applied).toLocaleDateString() : undefined,
          deadline: job.deadline ? new Date(job.deadline).toLocaleDateString() : undefined,
          excitement: job.excitement || 0,
          notes: job.notes || undefined
        }));

        setJobs(transformedJobs);
      } catch (error) {
        console.error('Unexpected error:', error);
        toast({
          title: 'Failed to load jobs',
          description: 'An unexpected error occurred',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [user, toast]);

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

  const addJob = async (job: Job) => {
    try {
      if (!user) return;

      // Convert date strings to ISO format for database
      const dateAppliedIso = job.dateApplied ? new Date(job.dateApplied).toISOString() : null;
      const deadlineIso = job.deadline ? new Date(job.deadline).toISOString() : null;
      
      // Add job to Supabase
      const { data, error } = await supabase
        .from('jobs')
        .insert({
          title: job.title,
          company: job.company,
          location: job.location,
          salary: job.salary || null,
          description: job.description || null,
          job_url: job.jobUrl || null,
          status: job.status,
          date_applied: dateAppliedIso,
          deadline: deadlineIso,
          excitement: job.excitement || 0,
          notes: job.notes || null,
          user_id: user.id
        })
        .select();

      if (error) {
        console.error('Error adding job:', error);
        toast({
          title: 'Failed to add job',
          description: error.message,
          variant: 'destructive'
        });
        return;
      }

      // Transform the returned job to match our Job type
      const newJob: Job = {
        id: data[0].id,
        title: data[0].title,
        company: data[0].company,
        location: data[0].location,
        salary: data[0].salary || undefined,
        jobUrl: data[0].job_url || undefined,
        status: data[0].status as JobStatus,
        dateSaved: new Date(data[0].date_saved).toLocaleDateString(),
        dateApplied: data[0].date_applied ? new Date(data[0].date_applied).toLocaleDateString() : undefined,
        deadline: data[0].deadline ? new Date(data[0].deadline).toLocaleDateString() : undefined,
        excitement: data[0].excitement || 0,
        notes: data[0].notes || undefined
      };

      setJobs([newJob, ...jobs]);
      toast({
        title: 'Job added',
        description: `${job.title} at ${job.company} has been added`,
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: 'Failed to add job',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      });
    }
  };

  const updateJob = async (updatedJob: Job) => {
    try {
      if (!user) return;

      // Convert date strings to ISO format for database
      const dateAppliedIso = updatedJob.dateApplied ? new Date(updatedJob.dateApplied).toISOString() : null;
      const deadlineIso = updatedJob.deadline ? new Date(updatedJob.deadline).toISOString() : null;
      
      // Update job in Supabase
      const { error } = await supabase
        .from('jobs')
        .update({
          title: updatedJob.title,
          company: updatedJob.company,
          location: updatedJob.location,
          salary: updatedJob.salary || null,
          description: updatedJob.description || null,
          job_url: updatedJob.jobUrl || null,
          status: updatedJob.status,
          date_applied: dateAppliedIso,
          deadline: deadlineIso,
          excitement: updatedJob.excitement || 0,
          notes: updatedJob.notes || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedJob.id);

      if (error) {
        console.error('Error updating job:', error);
        toast({
          title: 'Failed to update job',
          description: error.message,
          variant: 'destructive'
        });
        return;
      }

      // Update local state
      setJobs(jobs.map(job => job.id === updatedJob.id ? updatedJob : job));
      toast({
        title: 'Job updated',
        description: `${updatedJob.title} has been updated`,
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: 'Failed to update job',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      });
    }
  };

  const deleteJob = async (jobId: string) => {
    try {
      if (!user) return;
      
      // Delete job from Supabase
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId);

      if (error) {
        console.error('Error deleting job:', error);
        toast({
          title: 'Failed to delete job',
          description: error.message,
          variant: 'destructive'
        });
        return;
      }

      // Update local state
      setJobs(jobs.filter(job => job.id !== jobId));
      setSelectedJobIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(jobId);
        return newSet;
      });
      
      toast({
        title: 'Job deleted',
        description: 'The job has been removed',
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: 'Failed to delete job',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      });
    }
  };

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
