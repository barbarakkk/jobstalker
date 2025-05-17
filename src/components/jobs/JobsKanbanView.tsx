
import React from 'react';
import { Job } from '@/types/job';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { StarIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface JobsKanbanViewProps {
  jobs: Job[];
  onUpdateJob: (job: Job) => void;
  onDeleteJob: (id: string) => void;
}

const JobsKanbanView: React.FC<JobsKanbanViewProps> = ({ 
  jobs,
  onUpdateJob,
  onDeleteJob
}) => {
  const columns = [
    { id: 'bookmarked', title: 'BOOKMARKED', color: 'border-blue-400 bg-blue-50' },
    { id: 'applying', title: 'APPLYING', color: 'border-orange-400 bg-orange-50' },
    { id: 'applied', title: 'APPLIED', color: 'border-yellow-400 bg-yellow-50' },
    { id: 'interviewing', title: 'INTERVIEWING', color: 'border-purple-400 bg-purple-50' },
    { id: 'accepted', title: 'ACCEPTED', color: 'border-green-400 bg-green-50' },
    { id: 'rejected', title: 'REJECTED', color: 'border-red-400 bg-red-50' }
  ];
  
  const { toast } = useToast();

  // Render excitement stars
  const renderExcitement = (excitement?: number) => {
    if (!excitement) return null;
    
    return (
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon 
            key={i} 
            size={14}
            className={i < excitement ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
          />
        ))}
      </div>
    );
  };

  // Handle job card drag
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, job: Job) => {
    e.dataTransfer.setData('jobId', job.id);
  };

  // Handle drop on column
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, status: string) => {
    e.preventDefault();
    const jobId = e.dataTransfer.getData('jobId');
    const job = jobs.find(j => j.id === jobId);
    
    if (job && job.status !== status) {
      const updatedJob = {
        ...job,
        status: status as any
      };
      
      onUpdateJob(updatedJob);
      
      toast({
        title: "Job status updated",
        description: `${job.title} moved to ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      });
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-nowrap gap-4 overflow-x-auto pb-6 pt-2" style={{ minHeight: '70vh' }}>
      {columns.map(column => {
        const columnJobs = jobs.filter(job => job.status === column.id);
        
        return (
          <div 
            key={column.id}
            className={`flex-shrink-0 w-72 flex flex-col rounded-lg ${column.color} border`}
            onDrop={(e) => handleDrop(e, column.id)}
            onDragOver={handleDragOver}
          >
            <div className="p-3 border-b font-medium flex justify-between items-center">
              <span>{column.title}</span>
              <span className="bg-white text-gray-700 h-6 w-6 rounded-full flex items-center justify-center text-sm">
                {columnJobs.length}
              </span>
            </div>
            
            <div className="p-2 flex-grow overflow-y-auto">
              {columnJobs.map(job => (
                <Card 
                  key={job.id}
                  className="mb-3 cursor-pointer" 
                  draggable
                  onDragStart={(e) => handleDragStart(e, job)}
                >
                  <CardContent className="p-3">
                    <div className="font-medium text-gray-900 truncate">{job.title}</div>
                    <div className="text-sm text-gray-600 mb-2">{job.company}</div>
                    
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <div className="truncate max-w-[100px]">{job.location}</div>
                      {renderExcitement(job.excitement)}
                    </div>
                    
                    <div className="flex justify-between items-center mt-2 text-xs">
                      <div className="text-gray-600">
                        {job.deadline ? `Due: ${job.deadline}` : "No deadline"}
                      </div>
                      
                      <div className="flex gap-2">
                        <button 
                          onClick={() => onUpdateJob({ ...job })}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => onDeleteJob(job.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {columnJobs.length === 0 && (
                <div className="text-center py-8 text-gray-400 text-sm italic">
                  No jobs in this status
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default JobsKanbanView;
