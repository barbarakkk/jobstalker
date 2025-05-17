
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import JobStatusColumn from '@/components/jobs/JobStatusColumn';
import JobListItem from '@/components/jobs/JobListItem';
import JobsKanbanView from '@/components/jobs/JobsKanbanView';
import AddJobDialog from '@/components/jobs/AddJobDialog';
import { JOB_STATUSES, type Job, type JobStatus } from '@/types/job';
import JobsNavbar from '@/components/DashboardNavbar';
import { Kanban } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const Jobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJobIds, setSelectedJobIds] = useState<Set<string>>(new Set());
  const [isAddJobDialogOpen, setIsAddJobDialogOpen] = useState(false);
  const [groupBy, setGroupBy] = useState<string>('none');
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const { toast } = useToast();

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

  const handleAddJob = async (job: Job) => {
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
    } finally {
      setIsAddJobDialogOpen(false);
    }
  };

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

  const handleUpdateJob = async (updatedJob: Job) => {
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

  const handleDeleteJob = async (jobId: string) => {
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
    <div className="min-h-screen bg-blue-50">
      <JobsNavbar />
      
      <main className="container mx-auto py-6 px-6 pt-20">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Job Tracker</h1>
        
        {/* Status Columns Summary */}
        <div className="flex flex-wrap justify-between mb-6 gap-4">
          {JOB_STATUSES.filter(status => status !== 'rejected').map((status) => (
            <JobStatusColumn 
              key={status}
              status={status} 
              count={statusCounts[status]} 
            />
          ))}
        </div>

        {/* Control Bar */}
        <div className="bg-white p-4 rounded-lg shadow mb-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div className="flex items-center gap-2">
            {viewMode === 'list' && (
              <>
                <input
                  type="checkbox"
                  checked={selectedJobIds.size > 0 && selectedJobIds.size === jobs.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-gray-600">
                  {selectedJobIds.size} selected
                </span>
              </>
            )}
            
            {/* View Toggle */}
            <div className="ml-4 md:ml-6">
              <Tabs 
                defaultValue="list" 
                value={viewMode} 
                onValueChange={(value) => setViewMode(value as 'list' | 'kanban')}
                className="w-[240px]"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="list">List View</TabsTrigger>
                  <TabsTrigger value="kanban" className="flex items-center gap-2">
                    <Kanban size={16} />
                    <span>Kanban</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            {viewMode === 'list' && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Group by:</span>
                <select
                  value={groupBy}
                  onChange={(e) => setGroupBy(e.target.value)}
                  className="rounded border p-1 text-sm"
                >
                  <option value="none">None</option>
                  <option value="company">Company</option>
                  <option value="location">Location</option>
                </select>
              </div>
            )}

            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-1"
            >
              Columns
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-1"
            >
              Menu
            </Button>
            
            <Button 
              onClick={() => setIsAddJobDialogOpen(true)} 
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Add a New Job
            </Button>
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your job applications...</p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && jobs.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 mb-4">No jobs found. Add your first job application!</p>
            <Button 
              onClick={() => setIsAddJobDialogOpen(true)} 
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Add a New Job
            </Button>
          </div>
        )}

        {/* Job Content - Conditional Rendering based on view mode */}
        {!isLoading && jobs.length > 0 && (
          viewMode === 'list' ? (
            /* List View */
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <div className="grid grid-cols-12 py-2 px-4 bg-gray-50 rounded-t-lg border-b text-sm font-medium text-gray-600">
                <div className="col-span-1"></div>
                <div className="col-span-3">Job Title / Company</div>
                <div className="col-span-1">Salary</div>
                <div className="col-span-2">Location</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-1">Date Saved</div>
                <div className="col-span-1">Deadline</div>
                <div className="col-span-1">Date Applied</div>
                <div className="col-span-1">Excitement</div>
              </div>
              
              {jobs.map(job => (
                <JobListItem 
                  key={job.id} 
                  job={job} 
                  isSelected={selectedJobIds.has(job.id)}
                  onToggleSelect={handleToggleSelect}
                  onUpdate={handleUpdateJob}
                  onDelete={handleDeleteJob}
                />
              ))}
            </div>
          ) : (
            /* Kanban View */
            <JobsKanbanView 
              jobs={jobs}
              onUpdateJob={handleUpdateJob}
              onDeleteJob={handleDeleteJob}
            />
          )
        )}
      </main>

      <AddJobDialog 
        isOpen={isAddJobDialogOpen} 
        onClose={() => setIsAddJobDialogOpen(false)} 
        onAddJob={handleAddJob}
      />
    </div>
  );
};

export default Jobs;
