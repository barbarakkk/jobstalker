
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

  // Debug logging
  console.log('NotesProvider render - user:', user);
  console.log('NotesProvider render - notes:', notes);
  console.log('NotesProvider render - isLoading:', isLoading);

  // Fetch notes from Supabase
  useEffect(() => {
    const fetchNotes = async () => {
      console.log('fetchNotes called - user:', user);
      
      if (!user) {
        console.log('No user, clearing notes and setting loading false');
        setNotes([]);
        setIsLoading(false);
        return;
      }

      try {
        console.log('Fetching notes for user:', user.id);
        const { data, error } = await supabase
          .from('notes')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        console.log('Supabase response - data:', data);
        console.log('Supabase response - error:', error);

        if (error) {
          console.error('Error fetching notes:', error);
          toast({
            title: 'Error fetching notes',
            description: error.message,
            variant: 'destructive'
          });
          return;
        }

        console.log('Setting notes:', data || []);
        setNotes(data || []);
      } catch (error) {
        console.error('Unexpected error:', error);
        toast({
          title: 'Failed to load notes',
          description: 'An unexpected error occurred',
          variant: 'destructive'
        });
      } finally {
        console.log('Setting loading to false');
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, [user, toast]);

  const addNote = async (noteData: Omit<Note, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    console.log('addNote called with:', noteData);
    
    if (!user) {
      console.log('No user for addNote');
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to add notes',
        variant: 'destructive'
      });
      return;
    }

    try {
      console.log('Inserting note into database');
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

      console.log('Insert response - data:', data);
      console.log('Insert response - error:', error);

      if (error) {
        console.error('Error adding note:', error);
        toast({
          title: 'Failed to add note',
          description: error.message,
          variant: 'destructive'
        });
        return;
      }

      console.log('Adding note to local state');
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
    console.log('updateNote called with:', updatedNote);
    
    if (!user) {
      console.log('No user for updateNote');
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to update notes',
        variant: 'destructive'
      });
      return;
    }

    try {
      console.log('Updating note in database');
      const { error } = await supabase
        .from('notes')
        .update({
          title: updatedNote.title,
          content: updatedNote.content || null,
          job_id: updatedNote.job_id || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedNote.id);

      console.log('Update response - error:', error);

      if (error) {
        console.error('Error updating note:', error);
        toast({
          title: 'Failed to update note',
          description: error.message,
          variant: 'destructive'
        });
        return;
      }

      console.log('Updating note in local state');
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
    console.log('deleteNote called with:', noteId);
    
    if (!user) {
      console.log('No user for deleteNote');
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to delete notes',
        variant: 'destructive'
      });
      return;
    }

    try {
      console.log('Deleting note from database');
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId);

      console.log('Delete response - error:', error);

      if (error) {
        console.error('Error deleting note:', error);
        toast({
          title: 'Failed to delete note',
          description: error.message,
          variant: 'destructive'
        });
        return;
      }

      console.log('Removing note from local state');
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
