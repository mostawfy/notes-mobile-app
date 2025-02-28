import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface NoteContextType {
  notes: Note[];
  isLoading: boolean;
  addNote: (title: string, content: string) => void;
  updateNote: (id: string, title: string, content: string) => void;
  deleteNote: (id: string) => void;
  deleteNotes: (ids: string[]) => void;
  getNoteById: (id: string) => Note | undefined;
  reorderNotes: (notes: Note[]) => void;
}

const NoteContext = createContext<NoteContextType | undefined>(undefined);

export const useNotes = () => {
  const context = useContext(NoteContext);
  if (!context) {
    throw new Error('useNotes must be used within a NoteProvider');
  }
  return context;
};

export const NoteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        setIsLoading(true);
        const storedNotes = await AsyncStorage.getItem('notes');
        if (storedNotes) {
          setNotes(JSON.parse(storedNotes));
        }
      } catch (error) {
        console.error('Failed to load notes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotes();
  }, []);

  const saveNotes = async (updatedNotes: Note[]) => {
    try {
      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
    } catch (error) {
      console.error('Failed to save notes:', error);
    }
  };

  const addNote = (title: string, content: string) => {
    const newNote: Note = {
      id: Date.now().toString(),
      title,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
  };

  const updateNote = (id: string, title: string, content: string) => {
    const updatedNotes = notes.map(note => 
      note.id === id 
        ? { ...note, title, content, updatedAt: new Date().toISOString() } 
        : note
    );
    
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
  };

  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
  };

  const deleteNotes = (ids: string[]) => {
    const updatedNotes = notes.filter(note => !ids.includes(note.id));
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
  }

  const getNoteById = (id: string) => {
    return notes.find(note => note.id === id);
  };

  const reorderNotes = (notes: Note[]) => {
    setNotes(notes);
    saveNotes(notes);
  };

  return (
    <NoteContext.Provider value={{ notes, isLoading, addNote, updateNote, deleteNote, deleteNotes, getNoteById, reorderNotes }}>
      {children}
    </NoteContext.Provider>
  );
};
