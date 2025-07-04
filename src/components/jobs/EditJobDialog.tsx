import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, isValid, parse } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { JOB_STATUSES, type Job, type JobStatus } from '@/types/job';

interface EditJobDialogProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
  onUpdateJob: (job: Job) => void;
}

const EditJobDialog: React.FC<EditJobDialogProps> = ({ job, isOpen, onClose, onUpdateJob }) => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    status: 'bookmarked' as JobStatus,
    dateApplied: '',
    deadline: '',
    jobUrl: '',
    excitement: 0,
    description: ''
  });

  const [deadlineDate, setDeadlineDate] = useState<Date | undefined>(undefined);
  const [dateAppliedValue, setDateAppliedValue] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title,
        company: job.company,
        location: job.location,
        salary: job.salary || '',
        status: job.status,
        dateApplied: job.dateApplied || '',
        deadline: job.deadline || '',
        jobUrl: job.jobUrl || '',
        excitement: job.excitement || 0,
        description: job.description || ''
      });

      if (job.deadline) {
        setDeadlineDate(parse(job.deadline, 'MM/dd/yyyy', new Date()));
      }
      
      if (job.dateApplied) {
        setDateAppliedValue(parse(job.dateApplied, 'MM/dd/yyyy', new Date()));
      }
    }
  }, [job]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.company || !formData.location) {
      return;
    }
    
    const updatedJob: Job = {
      ...job,
      title: formData.title,
      company: formData.company,
      location: formData.location,
      salary: formData.salary || undefined,
      status: formData.status,
      dateApplied: formData.dateApplied || undefined,
      deadline: formData.deadline || undefined,
      jobUrl: formData.jobUrl || undefined,
      excitement: formData.excitement || 0,
      description: formData.description || undefined
    };
    
    onUpdateJob(updatedJob);
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'excitement' ? parseInt(value) || 0 : value
    }));
  };

  const handleDeadlineSelect = (date: Date | undefined) => {
    setDeadlineDate(date);
    if (date && isValid(date)) {
      setFormData(prev => ({
        ...prev,
        deadline: format(date, 'MM/dd/yyyy')
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        deadline: ''
      }));
    }
  };

  const handleDateAppliedSelect = (date: Date | undefined) => {
    setDateAppliedValue(date);
    if (date && isValid(date)) {
      setFormData(prev => ({
        ...prev,
        dateApplied: format(date, 'MM/dd/yyyy')
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        dateApplied: ''
      }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Job</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Job Title</Label>
              <Input 
                id="title" 
                name="title"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="company">Company</Label>
              <Input 
                id="company" 
                name="company"
                value={formData.company}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location"
                name="location" 
                value={formData.location}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="salary">Salary</Label>
              <Input 
                id="salary" 
                name="salary"
                value={formData.salary}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="jobUrl">Job URL</Label>
              <Input 
                id="jobUrl"
                name="jobUrl" 
                value={formData.jobUrl}
                onChange={handleInputChange}
                placeholder="https://"
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={formData.status}
                onChange={handleInputChange}
              >
                {JOB_STATUSES.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Date Applied</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateAppliedValue && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateAppliedValue ? format(dateAppliedValue, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateAppliedValue}
                    onSelect={handleDateAppliedSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
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
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="excitement">Excitement Level</Label>
              <select
                id="excitement"
                name="excitement"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={formData.excitement || ''}
                onChange={handleInputChange}
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
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Job description..."
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditJobDialog;
