
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StarIcon, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { type Job } from '@/types/job';
import { useNotes } from '@/context/notes/NotesContext';
import EditJobDialog from './EditJobDialog';

interface JobListItemProps {
  job: Job;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onUpdate: (job: Job) => void;
  onDelete: (id: string) => void;
}

const JobListItem: React.FC<JobListItemProps> = ({ 
  job, 
  isSelected, 
  onToggleSelect,
  onUpdate,
  onDelete
}) => {
  const navigate = useNavigate();
  const { getJobNotes } = useNotes();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const jobNotes = getJobNotes(job.id);

  // Handle star click to set rating
  const handleStarClick = (rating: number) => {
    const updatedJob: Job = {
      ...job,
      excitement: rating
    };
    onUpdate(updatedJob);
  };

  // Render interactive stars
  const renderExcitement = () => {
    return (
      <div 
        className="flex gap-0.5"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => {
          setIsHovering(false);
          setHoverRating(0);
        }}
      >
        {Array.from({ length: 5 }).map((_, i) => {
          const starIndex = i + 1;
          const currentRating = job.excitement || 0;
          const displayRating = isHovering ? hoverRating : currentRating;
          const isFilled = starIndex <= displayRating;
          
          return (
            <StarIcon 
              key={i} 
              size={16} 
              className={`cursor-pointer transition-all duration-200 ${
                isFilled 
                  ? "text-amber-400 fill-amber-400" 
                  : "text-gray-300 hover:text-amber-300"
              }`}
              onClick={() => handleStarClick(starIndex)}
              onMouseEnter={() => setHoverRating(starIndex)}
            />
          );
        })}
      </div>
    );
  };

  const handleNavigateToNotes = () => {
    navigate(`/jobs/${job.id}/notes`);
  };

  // Status badge styling
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      bookmarked: 'bg-blue-50 text-blue-700 border-blue-200',
      applying: 'bg-orange-50 text-orange-700 border-orange-200',
      applied: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      interviewing: 'bg-purple-50 text-purple-700 border-purple-200',
      accepted: 'bg-green-50 text-green-700 border-green-200',
      rejected: 'bg-red-50 text-red-700 border-red-200'
    };
    
    return statusConfig[status as keyof typeof statusConfig] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  return (
    <>
      <div className="grid grid-cols-12 py-4 px-6 hover:bg-gray-25 transition-colors duration-200 items-center text-sm">
        <div className="col-span-1 flex items-center gap-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(job.id)}
            className="rounded-md border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 h-4 w-4"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 hover:bg-gray-100 rounded-lg"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40">
              <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleNavigateToNotes}>
                Notes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(job.id)} className="text-red-600">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="col-span-3">
          <div className="font-semibold text-gray-900 mb-1">{job.title}</div>
          <div className="text-gray-500 text-xs">{job.company}</div>
        </div>
        
        <div className="col-span-1">
          <span className="font-medium text-gray-900">
            {job.salary || "—"}
          </span>
        </div>
        
        <div className="col-span-2">
          <span className="text-gray-700">{job.location}</span>
        </div>
        
        <div className="col-span-1">
          <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize border ${getStatusBadge(job.status)}`}>
            {job.status}
          </span>
        </div>
        
        <div className="col-span-1">
          <span className="text-gray-600 text-xs">
            {job.dateSaved || "—"}
          </span>
        </div>
        
        <div className="col-span-1">
          <span className="text-gray-600 text-xs">
            {job.deadline || "—"}
          </span>
        </div>
        
        <div className="col-span-1">
          {job.dateApplied ? (
            <span className="text-gray-600 text-xs">{job.dateApplied}</span>
          ) : (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-1 h-auto text-xs rounded-md"
              onClick={() => {
                const updatedJob = {
                  ...job,
                  dateApplied: new Date().toLocaleDateString(),
                  status: 'applied' as const
                };
                onUpdate(updatedJob);
              }}
            >
              Add date
            </Button>
          )}
        </div>
        
        <div className="col-span-1">
          {renderExcitement()}
        </div>

        <div className="col-span-1">
          <Button
            variant="outline"
            size="sm"
            className="text-xs px-3 py-1.5 h-7 rounded-lg border-gray-200 hover:bg-gray-50"
            onClick={handleNavigateToNotes}
          >
            Notes ({jobNotes.length})
          </Button>
        </div>
      </div>

      <EditJobDialog 
        job={job} 
        isOpen={isEditDialogOpen} 
        onClose={() => setIsEditDialogOpen(false)}
        onUpdateJob={onUpdate}
      />
    </>
  );
};

export default JobListItem;
