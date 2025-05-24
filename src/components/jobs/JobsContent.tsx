
import React from 'react';
import JobListItem from '@/components/jobs/JobListItem';
import JobsKanbanView from '@/components/jobs/JobsKanbanView';
import { useJobs } from '@/context/jobs/JobsContext';
import { Loader2 } from 'lucide-react';

interface JobsContentProps {
  viewMode: 'list' | 'kanban';
}

const JobsContent: React.FC<JobsContentProps> = ({ viewMode }) => {
  const { jobs, isLoading, selectedJobIds, handleToggleSelect, updateJob, deleteJob } = useJobs();

  if (isLoading) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg shadow-gray-900/5 p-12 text-center border border-gray-200/60">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Loading your applications</h3>
            <p className="text-gray-600 font-medium">Please wait while we fetch your job data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg shadow-gray-900/5 p-12 text-center border border-gray-200/60">
        <p className="text-gray-600 mb-4 font-medium">No jobs found. Add your first job application!</p>
      </div>
    );
  }

  return (
    <>
      {viewMode === 'list' ? (
        /* List View */
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg shadow-gray-900/5 overflow-hidden border border-gray-200/60">
          <div className="grid grid-cols-12 py-4 px-6 bg-gray-50/80 backdrop-blur-sm border-b border-gray-200/60 text-sm font-bold text-gray-700">
            <div className="col-span-1"></div>
            <div className="col-span-3">Job Title / Company</div>
            <div className="col-span-1">Salary</div>
            <div className="col-span-2">Location</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1">Date Saved</div>
            <div className="col-span-1">Deadline</div>
            <div className="col-span-1">Date Applied</div>
            <div className="col-span-1">Excitement</div>
            <div className="col-span-1">Notes</div>
          </div>
          
          {jobs.map(job => (
            <JobListItem 
              key={job.id} 
              job={job} 
              isSelected={selectedJobIds.has(job.id)}
              onToggleSelect={handleToggleSelect}
              onUpdate={updateJob}
              onDelete={deleteJob}
            />
          ))}
        </div>
      ) : (
        /* Kanban View */
        <JobsKanbanView 
          jobs={jobs}
          onUpdateJob={updateJob}
          onDeleteJob={deleteJob}
        />
      )}
    </>
  );
};

export default JobsContent;
