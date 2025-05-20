
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Job, JobStatus } from '@/types/job';

export const useJobsActions = (
  jobs: Job[],
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>,
  setSelectedJobIds: React.Dispatch<React.SetStateAction<Set<string>>>
) => {
  const { toast } = useToast();

  const addJob = async (job: Job) => {
    try {
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

  return {
    addJob,
    updateJob,
    deleteJob
  };
};
