
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Trash2 } from 'lucide-react';
import { JOB_STATUSES, type Job, type JobStatus } from '@/types/job';
import { useForm } from 'react-hook-form';
import { format, isValid, parse } from 'date-fns';
import { cn } from '@/lib/utils';

interface JobNotesDialogProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
  onUpdateJob: (job: Job) => void;
  onDeleteJob: (jobId: string) => void;
}

interface JobFormData {
  title: string;
  company: string;
  location: string;
  salary?: string;
  status: JobStatus;
  dateApplied?: string;
  deadline?: string;
  jobUrl?: string;
  excitement?: number;
}

const JobNotesDialog: React.FC<JobNotesDialogProps> = ({
  job,
  isOpen,
  onClose,
  onUpdateJob,
  onDeleteJob
}) => {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<JobFormData>({
    defaultValues: {
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary,
      status: job.status,
      dateApplied: job.dateApplied,
      deadline: job.deadline,
      jobUrl: job.jobUrl,
      excitement: job.excitement
    }
  });

  const [deadlineDate, setDeadlineDate] = React.useState<Date | undefined>(
    job.deadline ? parse(job.deadline, 'MM/dd/yyyy', new Date()) : undefined
  );

  const [dateApplied, setDateApplied] = React.useState<Date | undefined>(
    job.dateApplied ? parse(job.dateApplied, 'MM/dd/yyyy', new Date()) : undefined
  );

  React.useEffect(() => {
    if (isOpen) {
      reset({
        title: job.title,
        company: job.company,
        location: job.location,
        salary: job.salary,
        status: job.status,
        dateApplied: job.dateApplied,
        deadline: job.deadline,
        jobUrl: job.jobUrl,
        excitement: job.excitement
      });

      setDeadlineDate(job.deadline ? parse(job.deadline, 'MM/dd/yyyy', new Date()) : undefined);
      setDateApplied(job.dateApplied ? parse(job.dateApplied, 'MM/dd/yyyy', new Date()) : undefined);
    }
  }, [isOpen, job, reset]);

  const handleDeadlineSelect = (date: Date | undefined) => {
    setDeadlineDate(date);
    if (date && isValid(date)) {
      setValue('deadline', format(date, 'MM/dd/yyyy'));
    } else {
      setValue('deadline', undefined);
    }
  };

  const handleDateAppliedSelect = (date: Date | undefined) => {
    setDateApplied(date);
    if (date && isValid(date)) {
      setValue('dateApplied', format(date, 'MM/dd/yyyy'));
    } else {
      setValue('dateApplied', undefined);
    }
  };

  const onSubmit = (data: JobFormData) => {
    const updatedJob: Job = {
      ...job,
      ...data,
    };
    
    onUpdateJob(updatedJob);
    onClose();
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      onDeleteJob(job.id);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Job Details</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title</Label>
              <Input 
                id="title" 
                {...register('title', { required: 'Title is required' })} 
              />
              {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input 
                  id="company" 
                  {...register('company', { required: 'Company is required' })}
                />
                {errors.company && <p className="text-red-500 text-xs">{errors.company.message}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  {...register('location', { required: 'Location is required' })}
                />
                {errors.location && <p className="text-red-500 text-xs">{errors.location.message}</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salary">Salary</Label>
                <Input 
                  id="salary" 
                  {...register('salary')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="jobUrl">Job URL</Label>
                <Input 
                  id="jobUrl" 
                  {...register('jobUrl')}
                  placeholder="https://"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  {...register('status', { required: 'Status is required' })}
                >
                  {JOB_STATUSES.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
                {errors.status && <p className="text-red-500 text-xs">{errors.status.message}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="excitement">Excitement</Label>
                <select
                  id="excitement"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  {...register('excitement', { valueAsNumber: true })}
                >
                  <option value="">Select rating</option>
                  <option value="1">1 star</option>
                  <option value="2">2 stars</option>
                  <option value="3">3 stars</option>
                  <option value="4">4 stars</option>
                  <option value="5">5 stars</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date Applied</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateApplied && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateApplied ? format(dateApplied, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateApplied}
                      onSelect={handleDateAppliedSelect}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label>Deadline</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !deadlineDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {deadlineDate ? format(deadlineDate, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={deadlineDate}
                      onSelect={handleDeadlineSelect}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            {job.dateSaved && (
              <div className="text-xs text-gray-500 pt-2">
                <p>Date Added: {job.dateSaved}</p>
              </div>
            )}
          </div>
          
          <DialogFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="destructive"
              onClick={handleDelete}
              className="flex items-center gap-1"
            >
              <Trash2 size={16} />
              Delete Job
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JobNotesDialog;
