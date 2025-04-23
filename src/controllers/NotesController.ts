import { createClient } from "@/services/supabase/client";
import { InsertNote, Note, UpdateNote } from "@/types/supabase";

// Initialize Supabase client
const supabase = createClient();

/**
 * Fetch all notes for the current user
 * 
 * @returns Array of notes sorted by most recent updates
 */
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

/**
 * Fetch a note by its ID
 * 
 * @param id - Note ID to fetch
 * @returns Note object or null if not found
 */
export async function getNoteById(id: string): Promise<Note | null> {
  if (!id) {
    console.error('Error fetching note: ID is required');
    throw new Error('Note ID is required');
  }

  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    // Special case for "not found" to return null rather than throw
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Error fetching note by id:', error);
    throw error;
  }

  return data;
}

/**
 * Create a new note
 * 
 * @param note - Note data to insert
 * @returns Created note with generated ID
 */
export async function createNote(note: InsertNote): Promise<Note> {
  // Apply simple validation
  if (!note.user_id) {
    console.error('Error creating note: user_id is required');
    throw new Error('user_id is required to create a note');
  }

  // Use a default title for empty titles
  const noteToInsert = {
    ...note,
    title: note.title || 'Untitled Note'
  };

  const { data, error } = await supabase
    .from('notes')
    .insert([noteToInsert])
    .select()
    .single();

  if (error) {
    console.error('Error creating note:', error);
    throw error;
  }

  if (!data) {
    throw new Error('No data returned after creating note');
  }

  return data;
}

/**
 * Update an existing note
 * 
 * @param note - Note data to update with ID
 * @returns Updated note
 */
export async function updateNote(note: UpdateNote): Promise<Note> {
  if (!note.id) {
    console.error('Error updating note: ID is required');
    throw new Error('Note ID is required for updates');
  }

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

  if (!data) {
    throw new Error('No data returned after updating note');
  }

  return data;
}

/**
 * Delete a note by ID
 * 
 * @param id - Note ID to delete
 */
export async function deleteNote(id: string): Promise<void> {
  if (!id) {
    console.error('Error deleting note: ID is required');
    throw new Error('Note ID is required for deletion');
  }
  
  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
}

/**
 * Search notes by title or content
 * 
 * @param query - Search query string
 * @returns Array of matching notes
 */
export async function searchNotes(query: string): Promise<Note[]> {
  if (!query) {
    return getNotes();
  }
  
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error searching notes:', error);
    throw error;
  }

  return data || [];
}

// Current Date and Time (UTC): 2025-04-23 14:07:25
// Current User: abhisheksharm-3