import { createClient } from "@/services/supabase/client";
import { InsertNote, Note, UpdateNote } from "@/types/supabase";

const supabase = createClient();

export async function getNotes(): Promise<Note[]> {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching notes:', error);
    throw error;
  }

  return data || [];
}

export async function getNoteById(id: string): Promise<Note | null> {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching note by id:', error);
    throw error;
  }

  return data;
}

export async function createNote(note: InsertNote): Promise<Note> {
  const { data, error } = await supabase
    .from('notes')
    .insert([note])
    .select()
    .single();

  if (error) {
    console.error('Error creating note:', error);
    throw error;
  }

  return data;
}

export async function updateNote(note: UpdateNote): Promise<Note> {
  const { data, error } = await supabase
    .from('notes')
    .update({
      title: note.title,
      content: note.content,
      updated_at: new Date().toISOString(),
    })
    .eq('id', note.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating note:', error);
    throw error;
  }

  return data;
}

export async function deleteNote(id: string): Promise<void> {
  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
}