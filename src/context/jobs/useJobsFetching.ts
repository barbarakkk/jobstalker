
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Job, JobStatus } from '@/types/job';

export const useJobsFetching = (userId: string | undefined) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch jobs from Supabase
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        if (!userId) return;
        
        setIsLoading(true);
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('user_id', userId) // Filter jobs by user ID
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
          excitement: job.excitement || 0
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
  }, [userId, toast]);

  return { jobs, setJobs, isLoading };
};
