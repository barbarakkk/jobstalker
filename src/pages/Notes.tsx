import React, { useState } from 'react';
import { Plus, FileText, Briefcase, Calendar, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import JobsNavbar from '@/components/DashboardNavbar';
import { useNotes } from '@/context/notes/NotesContext';
import { useJobs } from '@/context/jobs';
import { useAuth } from '@/context/auth';
import { Note } from '@/types/note';

const NotesPage: React.FC = () => {
  const { user } = useAuth();
  const { notes, isLoading, addNote, updateNote, deleteNote } = useNotes();
  const { jobs } = useJobs();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    job_id: ''
  });
  const [editingNotes, setEditingNotes] = useState<{ [jobId: string]: string }>({});
  const [saving, setSaving] = useState<string | null>(null);

  console.log('NotesPage render - user:', user);
  console.log('NotesPage render - notes:', notes);
  console.log('NotesPage render - isLoading:', isLoading);
  console.log('NotesPage render - jobs:', jobs);

  const handleAddNote = async () => {
    if (!newNote.title.trim()) return;

    console.log('Adding note:', newNote);
    await addNote({
      title: newNote.title,
      content: newNote.content || undefined,
      job_id: newNote.job_id || undefined
    });

    setNewNote({ title: '', content: '', job_id: '' });
    setIsAddDialogOpen(false);
  };

  const handleEditNote = async () => {
    if (!editingNote || !editingNote.title.trim()) return;

    console.log('Updating note:', editingNote);
    await updateNote(editingNote);
    setIsEditDialogOpen(false);
    setEditingNote(null);
  };

  const handleDeleteNote = async (noteId: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      console.log('Deleting note:', noteId);
      await deleteNote(noteId);
    }
  };

  const getJobInfo = (jobId?: string) => {
    if (!jobId) return null;
    return jobs.find(job => job.id === jobId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getNoteForJob = (jobId: string) => notes.find((n) => n.job_id === jobId);

  const handleNoteChange = (jobId: string, value: string) => {
    setEditingNotes((prev) => ({ ...prev, [jobId]: value }));
  };

  const handleSaveNote = async (jobId: string) => {
    setSaving(jobId);
    const existingNote = getNoteForJob(jobId);
    if (existingNote) {
      await updateNote({ ...existingNote, content: editingNotes[jobId] });
    } else {
      await addNote({ job_id: jobId, title: jobs.find(j => j.id === jobId)?.title || '', content: editingNotes[jobId] });
    }
    setSaving(null);
  };

  // Show authentication required if no user
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
        <JobsNavbar />
        <div className="container mx-auto py-24 px-6">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h3>
            <p className="text-gray-500 mb-8">Please log in to view your notes.</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
        <JobsNavbar />
        <div className="container mx-auto py-24 px-6">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-2 text-gray-600">Loading notes...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <JobsNavbar />
      
      <main className="container mx-auto py-8 px-6 pt-24 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Notes</h1>
            <p className="text-gray-600">Keep track of your thoughts and job-related notes</p>
            <p className="text-sm text-gray-400 mt-1">Found {notes.length} notes</p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30 transition-all duration-300 flex items-center gap-2">
                <Plus size={18} />
                Add Note
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Note</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newNote.title}
                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                    placeholder="Enter note title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="job">Attach to Job (Optional)</Label>
                  <Select value={newNote.job_id} onValueChange={(value) => setNewNote({ ...newNote, job_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a job" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No job attachment</SelectItem>
                      {jobs.map((job) => (
                        <SelectItem key={job.id} value={job.id}>
                          {job.title} at {job.company}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={newNote.content}
                    onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                    placeholder="Enter note content"
                    rows={4}
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddNote} disabled={!newNote.title.trim()}>
                    Add Note
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Notes Grid */}
        {notes.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="mb-8">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20 mb-6">
                <FileText className="h-10 w-10 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No notes yet</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">Start capturing your thoughts and job-related insights.</p>
            <Button 
              onClick={() => setIsAddDialogOpen(true)} 
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold px-8 py-3 rounded-xl shadow-lg shadow-purple-600/25 hover:shadow-xl hover:shadow-purple-600/30 transition-all duration-300 flex items-center gap-2 mx-auto"
            >
              <Plus size={18} />
              Add Your First Note
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => {
              const jobInfo = getJobInfo(note.job_id);
              return (
                <Card key={note.id} className="bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {note.title}
                      </CardTitle>
                      <div className="flex gap-1 ml-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingNote(note);
                            setIsEditDialogOpen(true);
                          }}
                          className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Edit size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteNote(note.id)}
                          className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                    
                    {jobInfo && (
                      <div className="flex items-center gap-2 mt-2 p-2 bg-blue-50 rounded-lg">
                        <Briefcase size={14} className="text-blue-600" />
                        <div className="text-sm">
                          <span className="font-medium text-blue-900">{jobInfo.title}</span>
                          <span className="text-blue-600 ml-1">at {jobInfo.company}</span>
                        </div>
                      </div>
                    )}
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    {note.content && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                        {note.content}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar size={12} />
                      <span>Created {formatDate(note.created_at)}</span>
                    </div>
                    
                    {note.updated_at !== note.created_at && (
                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                        <Calendar size={12} />
                        <span>Updated {formatDate(note.updated_at)}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Note</DialogTitle>
            </DialogHeader>
            {editingNote && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    value={editingNote.title}
                    onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                    placeholder="Enter note title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-job">Attach to Job (Optional)</Label>
                  <Select 
                    value={editingNote.job_id || ''} 
                    onValueChange={(value) => setEditingNote({ ...editingNote, job_id: value || undefined })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a job" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No job attachment</SelectItem>
                      {jobs.map((job) => (
                        <SelectItem key={job.id} value={job.id}>
                          {job.title} at {job.company}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="edit-content">Content</Label>
                  <Textarea
                    id="edit-content"
                    value={editingNote.content || ''}
                    onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                    placeholder="Enter note content"
                    rows={4}
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleEditNote} disabled={!editingNote.title.trim()}>
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <div style={{ padding: 32 }}>
          <h1 style={{ fontSize: 32, marginBottom: 24 }}>Job Notes</h1>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f3f4f6' }}>
                <th style={{ padding: 12, border: '1px solid #e5e7eb' }}>Title</th>
                <th style={{ padding: 12, border: '1px solid #e5e7eb' }}>Company</th>
                <th style={{ padding: 12, border: '1px solid #e5e7eb' }}>Date Saved</th>
                <th style={{ padding: 12, border: '1px solid #e5e7eb' }}>Stars</th>
                <th style={{ padding: 12, border: '1px solid #e5e7eb' }}>Notes</th>
                <th style={{ padding: 12, border: '1px solid #e5e7eb' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => {
                const note = getNoteForJob(job.id);
                return (
                  <tr key={job.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: 12 }}>{job.title}</td>
                    <td style={{ padding: 12 }}>{job.company}</td>
                    <td style={{ padding: 12 }}>{job.dateSaved}</td>
                    <td style={{ padding: 12 }}>{'★'.repeat(job.excitement || 0)}</td>
                    <td style={{ padding: 12 }}>
                      <textarea
                        style={{ width: 220, minHeight: 60, fontSize: 15 }}
                        value={editingNotes[job.id] ?? note?.content ?? ''}
                        onChange={e => handleNoteChange(job.id, e.target.value)}
                        placeholder="Add your notes here..."
                      />
                    </td>
                    <td style={{ padding: 12 }}>
                      <button
                        onClick={() => handleSaveNote(job.id)}
                        disabled={saving === job.id}
                        style={{ padding: '6px 16px', fontSize: 15 }}
                      >
                        {saving === job.id ? 'Saving...' : note ? 'Update' : 'Save'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default NotesPage;
