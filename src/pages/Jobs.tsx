
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth';
import JobStatusColumn from '@/components/jobs/JobStatusColumn';
import JobListItem from '@/components/jobs/JobListItem';
import AddJobDialog from '@/components/jobs/AddJobDialog';
import { JOB_STATUSES, type Job, type JobStatus } from '@/types/job';
import { mockJobs } from '@/lib/mock-data';
import DashboardNavbar from '@/components/DashboardNavbar';

const Jobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [selectedJobIds, setSelectedJobIds] = useState<Set<string>>(new Set());
  const [isAddJobDialogOpen, setIsAddJobDialogOpen] = useState(false);
  const [groupBy, setGroupBy] = useState<string>('none');

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

  const handleAddJob = (job: Job) => {
    setJobs([job, ...jobs]);
    setIsAddJobDialogOpen(false);
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

  const handleUpdateJob = (updatedJob: Job) => {
    setJobs(jobs.map(job => job.id === updatedJob.id ? updatedJob : job));
  };

  const handleDeleteJob = (jobId: string) => {
    setJobs(jobs.filter(job => job.id !== jobId));
    setSelectedJobIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(jobId);
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <DashboardNavbar />
      
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
            <input
              type="checkbox"
              checked={selectedJobIds.size > 0 && selectedJobIds.size === jobs.length}
              onChange={(e) => handleSelectAll(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-gray-600">
              {selectedJobIds.size} selected
            </span>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
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

        {/* Job List */}
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
          
          {jobs.length > 0 ? (
            jobs.map(job => (
              <JobListItem 
                key={job.id} 
                job={job} 
                isSelected={selectedJobIds.has(job.id)}
                onToggleSelect={handleToggleSelect}
                onUpdate={handleUpdateJob}
                onDelete={handleDeleteJob}
              />
            ))
          ) : (
            <div className="py-8 text-center text-gray-500">
              No jobs found. Add your first job application!
            </div>
          )}
        </div>
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
