
import React from 'react';
import JobListItem from '@/components/jobs/JobListItem';
import JobsKanbanView from '@/components/jobs/JobsKanbanView';
import { useJobs } from '@/context/jobs/JobsContext';

interface JobsContentProps {
  viewMode: 'list' | 'kanban';
}

const JobsContent: React.FC<JobsContentProps> = ({ viewMode }) => {
  const { jobs, isLoading, selectedJobIds, handleToggleSelect, updateJob, deleteJob } = useJobs();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your job applications...</p>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-600 mb-4">No jobs found. Add your first job application!</p>
      </div>
    );
  }

  return (
    <>
      {viewMode === 'list' ? (
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
