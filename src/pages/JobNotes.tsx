
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, isValid, parse } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { JOB_STATUSES, type Job, type JobStatus } from '@/types/job';
import JobsNavbar from '@/components/DashboardNavbar';
import { useJobs } from '@/context/jobs';

const JobNotes = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { jobs, updateJob, deleteJob } = useJobs();
  
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    status: 'bookmarked' as JobStatus,
    dateApplied: '',
    deadline: '',
    jobUrl: '',
    notes: '',
    excitement: 0
  });

  const [deadlineDate, setDeadlineDate] = useState<Date | undefined>(undefined);
  const [dateAppliedValue, setDateAppliedValue] = useState<Date | undefined>(undefined);

  useEffect(() => {
    const currentJob = jobs.find(j => j.id === jobId);
    
    if (currentJob) {
      setJob(currentJob);
      setFormData({
        title: currentJob.title,
        company: currentJob.company,
        location: currentJob.location,
        salary: currentJob.salary || '',
        status: currentJob.status,
        dateApplied: currentJob.dateApplied || '',
        deadline: currentJob.deadline || '',
        jobUrl: currentJob.jobUrl || '',
        notes: currentJob.notes || '',
        excitement: currentJob.excitement || 0
      });

      if (currentJob.deadline) {
        setDeadlineDate(parse(currentJob.deadline, 'MM/dd/yyyy', new Date()));
      }
      
      if (currentJob.dateApplied) {
        setDateAppliedValue(parse(currentJob.dateApplied, 'MM/dd/yyyy', new Date()));
      }
    }
    
    setIsLoading(false);
  }, [jobId, jobs]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!job) return;
    
    if (!formData.title || !formData.company || !formData.location) {
      toast({
        title: 'Validation Error',
        description: 'Job title, company, and location are required fields',
        variant: 'destructive'
      });
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
      notes: formData.notes || undefined,
      excitement: formData.excitement || 0
    };
    
    try {
      await updateJob(updatedJob);
      toast({
        title: 'Job Updated',
        description: 'Job details have been saved successfully',
      });
    } catch (error) {
      console.error('Error updating job:', error);
      toast({
        title: 'Error',
        description: 'Failed to update job details',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async () => {
    if (!job) return;
    
    if (window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      try {
        await deleteJob(job.id);
        toast({
          title: 'Job Deleted',
          description: 'Job has been removed successfully',
        });
        navigate('/jobs');
      } catch (error) {
        console.error('Error deleting job:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete job',
          variant: 'destructive'
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-blue-50">
        <JobsNavbar />
        <main className="container mx-auto py-6 px-6 pt-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
        </main>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-blue-50">
        <JobsNavbar />
        <main className="container mx-auto py-6 px-6 pt-20">
          <Button 
            variant="outline" 
            onClick={() => navigate('/jobs')}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft size={16} /> Back to Job Tracker
          </Button>
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">Job not found</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <JobsNavbar />
      <main className="container mx-auto py-6 px-6 pt-20">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/jobs')}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} /> Back to Job Tracker
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">
            Notes - {job.title} at {job.company}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input 
                id="title" 
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company">Company *</Label>
              <Input 
                id="company" 
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input 
                id="location"
                name="location" 
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="salary">Salary</Label>
              <Input 
                id="salary" 
                name="salary"
                value={formData.salary}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="jobUrl">Job URL</Label>
              <Input 
                id="jobUrl"
                name="jobUrl" 
                value={formData.jobUrl}
                onChange={handleInputChange}
                placeholder="https://"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <select
                id="status"
                name="status"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={formData.status}
                onChange={handleInputChange}
                required
              >
                {JOB_STATUSES.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
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
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
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
          
          <div className="space-y-2 mb-6">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="min-h-[200px]"
              placeholder="Add detailed notes about this job application..."
            />
          </div>
          
          {job.dateSaved && (
            <div className="text-xs text-gray-500 mb-6 space-y-1">
              <p>Date Added: {job.dateSaved}</p>
              {job.dateApplied && <p>Date Applied: {job.dateApplied}</p>}
            </div>
          )}
          
          <div className="flex justify-between">
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
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/jobs')}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex items-center gap-1">
                <Save size={16} />
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default JobNotes;
