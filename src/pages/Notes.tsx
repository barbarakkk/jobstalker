
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNotes } from '@/context/notes/NotesContext';
import { useJobs } from '@/context/jobs';
import { Note } from '@/types/note';
import { Plus, Edit, Trash2, Briefcase } from 'lucide-react';
import JobsNavbar from '@/components/DashboardNavbar';

const Notes = () => {
  const { notes, isLoading, addNote, updateNote, deleteNote } = useNotes();
  const { jobs } = useJobs();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    job_id: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      return;
    }

    if (editingNote) {
      await updateNote({
        ...editingNote,
        title: formData.title,
        content: formData.content,
        job_id: formData.job_id || undefined
      });
    } else {
      await addNote({
        title: formData.title,
        content: formData.content,
        job_id: formData.job_id || undefined
      });
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      job_id: ''
    });
    setEditingNote(null);
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content || '',
      job_id: note.job_id || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (noteId: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      await deleteNote(noteId);
    }
  };

  const getJobTitle = (jobId: string | undefined) => {
    if (!jobId) return null;
    const job = jobs.find(j => j.id === jobId);
    return job ? `${job.title} at ${job.company}` : 'Unknown Job';
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
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

  return (
    <div className="min-h-screen bg-blue-50">
      <JobsNavbar />
      <main className="container mx-auto py-6 px-6 pt-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Notes</h1>
          <Button onClick={openAddDialog} className="flex items-center gap-2">
            <Plus size={18} />
            Add Note
          </Button>
        </div>

        {notes.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/25 mb-4">
                <Briefcase className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">No notes yet</h3>
            <p className="text-gray-600 mb-6 font-medium">Start taking notes to keep track of important information.</p>
            <Button onClick={openAddDialog} className="flex items-center gap-2 mx-auto">
              <Plus size={18} />
              Create Your First Note
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <Card key={note.id} className="bg-white shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold">{note.title}</CardTitle>
                      {note.job_id && (
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <Briefcase size={14} />
                          {getJobTitle(note.job_id)}
                        </CardDescription>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(note)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(note.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {note.content && (
                  <CardContent>
                    <p className="text-gray-600 text-sm whitespace-pre-wrap">
                      {note.content.length > 150 
                        ? `${note.content.substring(0, 150)}...` 
                        : note.content
                      }
                    </p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingNote ? 'Edit Note' : 'Add New Note'}</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter note title..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="job_id">Link to Job (Optional)</Label>
                <select
                  id="job_id"
                  name="job_id"
                  value={formData.job_id}
                  onChange={handleInputChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Select a job (optional)</option>
                  {jobs.map(job => (
                    <option key={job.id} value={job.id}>
                      {job.title} at {job.company}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content (Optional)</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Enter your note content..."
                  className="min-h-[100px]"
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingNote ? 'Update Note' : 'Add Note'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Notes;
