
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth';
import { Note } from '@/types/note';

interface NotesContextType {
  notes: Note[];
  isLoading: boolean;
  addNote: (note: Omit<Note, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateNote: (note: Note) => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
  getJobNotes: (jobId: string) => Note[];
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider = ({ children }: { children: React.ReactNode }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch notes from Supabase
  useEffect(() => {
    const fetchNotes = async () => {
      if (!user) {
        setNotes([]);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('notes')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching notes:', error);
          toast({
            title: 'Error fetching notes',
            description: error.message,
            variant: 'destructive'
          });
          return;
        }

        setNotes(data || []);
      } catch (error) {
        console.error('Unexpected error:', error);
        toast({
          title: 'Failed to load notes',
          description: 'An unexpected error occurred',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, [user, toast]);

  const addNote = async (noteData: Omit<Note, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to add notes',
        variant: 'destructive'
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('notes')
        .insert({
          title: noteData.title,
          content: noteData.content || null,
          job_id: noteData.job_id || null,
          user_id: user.id
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding note:', error);
        toast({
          title: 'Failed to add note',
          description: error.message,
          variant: 'destructive'
        });
        return;
      }

      setNotes([data, ...notes]);
      toast({
        title: 'Note added',
        description: `${noteData.title} has been added`,
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: 'Failed to add note',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      });
    }
  };

  const updateNote = async (updatedNote: Note) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to update notes',
        variant: 'destructive'
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('notes')
        .update({
          title: updatedNote.title,
          content: updatedNote.content || null,
          job_id: updatedNote.job_id || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedNote.id);

      if (error) {
        console.error('Error updating note:', error);
        toast({
          title: 'Failed to update note',
          description: error.message,
          variant: 'destructive'
        });
        return;
      }

      setNotes(notes.map(note => note.id === updatedNote.id ? updatedNote : note));
      toast({
        title: 'Note updated',
        description: `${updatedNote.title} has been updated`,
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: 'Failed to update note',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      });
    }
  };

  const deleteNote = async (noteId: string) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to delete notes',
        variant: 'destructive'
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId);

      if (error) {
        console.error('Error deleting note:', error);
        toast({
          title: 'Failed to delete note',
          description: error.message,
          variant: 'destructive'
        });
        return;
      }

      setNotes(notes.filter(note => note.id !== noteId));
      toast({
        title: 'Note deleted',
        description: 'The note has been removed',
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: 'Failed to delete note',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      });
    }
  };

  const getJobNotes = (jobId: string) => {
    return notes.filter(note => note.job_id === jobId);
  };

  return (
    <NotesContext.Provider value={{
      notes,
      isLoading,
      addNote,
      updateNote,
      deleteNote,
      getJobNotes
    }}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};
