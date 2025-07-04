import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon, ArrowLeft, Plus, Trash2, Edit } from 'lucide-react';
import { useJobs } from '@/context/jobs';
import { useNotes } from '@/context/notes/NotesContext';
import { Job, JOB_STATUSES, type JobStatus } from '@/types/job';
import { Note } from '@/types/note';
import JobsNavbar from '@/components/DashboardNavbar';
import { useToast } from '@/hooks/use-toast';

const JobNotes: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { jobs, updateJob } = useJobs();
  const { notes, addNote, updateNote, deleteNote } = useNotes();
  const { toast } = useToast();

  const job = jobs.find(j => j.id === jobId);
  const jobNotes = notes.filter(note => note.jobId === jobId);

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
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editNoteTitle, setEditNoteTitle] = useState('');
  const [editNoteContent, setEditNoteContent] = useState('');

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
        const deadlineDate = new Date(job.deadline);
        if (!isNaN(deadlineDate.getTime())) {
          setDeadlineDate(deadlineDate);
        }
      }

      if (job.dateApplied) {
        const appliedDate = new Date(job.dateApplied);
        if (!isNaN(appliedDate.getTime())) {
          setDateAppliedValue(appliedDate);
        }
      }
    }
  }, [job]);

  const handleJobUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!job || !formData.title || !formData.company || !formData.location) {
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
    
    updateJob(updatedJob);
    toast({
      title: "Job updated",
      description: "Job details have been updated successfully.",
    });
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
    setFormData(prev => ({
      ...prev,
      deadline: date ? format(date, 'MM/dd/yyyy') : ''
    }));
  };

  const handleDateAppliedSelect = (date: Date | undefined) => {
    setDateAppliedValue(date);
    setFormData(prev => ({
      ...prev,
      dateApplied: date ? format(date, 'MM/dd/yyyy') : ''
    }));
  };

  const handleAddNote = () => {
    if (!newNoteTitle.trim()) return;

    const newNote: Omit<Note, 'id'> = {
      title: newNoteTitle,
      content: newNoteContent,
      jobId: jobId!,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    addNote(newNote);
    setNewNoteTitle('');
    setNewNoteContent('');
    toast({
      title: "Note added",
      description: "Your note has been added successfully.",
    });
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setEditNoteTitle(note.title);
    setEditNoteContent(note.content || '');
  };

  const handleUpdateNote = () => {
    if (!editingNote || !editNoteTitle.trim()) return;

    const updatedNote: Note = {
      ...editingNote,
      title: editNoteTitle,
      content: editNoteContent,
      updatedAt: new Date().toISOString()
    };

    updateNote(updatedNote);
    setEditingNote(null);
    setEditNoteTitle('');
    setEditNoteContent('');
    toast({
      title: "Note updated",
      description: "Your note has been updated successfully.",
    });
  };

  const handleDeleteNote = (noteId: string) => {
    deleteNote(noteId);
    toast({
      title: "Note deleted",
      description: "Your note has been deleted successfully.",
    });
  };

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50/30">
        <JobsNavbar />
        <main className="container mx-auto py-6 px-6 pt-24">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg shadow-gray-900/5 p-12 text-center border border-gray-200/60">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h1>
            <p className="text-gray-600 mb-6">The job you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/jobs')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Jobs
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50/30">
      <JobsNavbar />
      <main className="container mx-auto py-6 px-6 pt-24">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/jobs')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Job Details Section */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg shadow-gray-900/5 p-8 border border-gray-200/60">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Job Details</h1>
            
            <form onSubmit={handleJobUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Job Title</Label>
                  <Input 
                    id="title" 
                    name="title" 
                    value={formData.title} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input 
                    id="company" 
                    name="company" 
                    value={formData.company} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location" 
                    name="location" 
                    value={formData.location} 
                    onChange={handleInputChange} 
                    required 
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                    ))}
                  </select>
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Add a job description..."
                />
              </div>
              
              <Button type="submit" className="w-full">
                Update Job
              </Button>
            </form>
          </div>

          {/* Notes Section */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg shadow-gray-900/5 p-8 border border-gray-200/60">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Job Notes</h2>
            
            {/* Add New Note */}
            <div className="space-y-4 mb-8">
              <div>
                <Label htmlFor="newNoteTitle">Note Title</Label>
                <Input
                  id="newNoteTitle"
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  placeholder="Enter note title..."
                />
              </div>
              <div>
                <Label htmlFor="newNoteContent">Note Content</Label>
                <Textarea
                  id="newNoteContent"
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  placeholder="Add your note content..."
                  rows={4}
                />
              </div>
              <Button onClick={handleAddNote} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Note
              </Button>
            </div>

            {/* Existing Notes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Existing Notes ({jobNotes.length})</h3>
              
              {jobNotes.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No notes yet. Add your first note above!</p>
              ) : (
                <div className="space-y-4">
                  {jobNotes.map((note) => (
                    <div key={note.id} className="border border-gray-200 rounded-lg p-4">
                      {editingNote?.id === note.id ? (
                        <div className="space-y-3">
                          <Input
                            value={editNoteTitle}
                            onChange={(e) => setEditNoteTitle(e.target.value)}
                            placeholder="Note title..."
                          />
                          <Textarea
                            value={editNoteContent}
                            onChange={(e) => setEditNoteContent(e.target.value)}
                            placeholder="Note content..."
                            rows={3}
                          />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={handleUpdateNote}>
                              Save
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingNote(null)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{note.title}</h4>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditNote(note)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteNote(note.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          {note.content && (
                            <p className="text-gray-600 text-sm whitespace-pre-wrap">{note.content}</p>
                          )}
                          <p className="text-xs text-gray-400 mt-2">
                            Created: {new Date(note.createdAt).toLocaleDateString()}
                            {note.updatedAt !== note.createdAt && (
                              <span> • Updated: {new Date(note.updatedAt).toLocaleDateString()}</span>
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobNotes;
