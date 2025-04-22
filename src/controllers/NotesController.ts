import { createClient } from "@/services/supabase/client";
import { Note, UpdateNote } from "@/types/supabase";

const supabase = createClient();

// Get all notes for the authenticated user
export async function getAllNotes(): Promise<Note[]> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", userData.user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data as Note[];
}

// Get a specific note by ID
export async function getNoteById(noteId: string): Promise<Note> {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("id", noteId)
    .single();

  if (error) {
    throw error;
  }

  return data as Note;
}

// Create a new note
export async function createNote(noteData: {
  title: string;
  content: string;
}): Promise<{ note: Note }> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("notes")
    .insert({
      title: noteData.title,
      content: noteData.content,
      user_id: userData.user.id,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return { note: data as Note };
}

// Update an existing note
export async function updateNote(
  noteId: string,
  noteData: { title?: string; content?: string }
): Promise<{ note: Note }> {
  const updateData: UpdateNote = {
    updated_at: new Date().toISOString(),
  };

  if (noteData.title !== undefined) {
    updateData.title = noteData.title;
  }

  if (noteData.content !== undefined) {
    updateData.content = noteData.content;
  }

  const { data, error } = await supabase
    .from("notes")
    .update(updateData)
    .eq("id", noteId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return { note: data as Note };
}

// Delete a note
export async function deleteNote(noteId: string): Promise<void> {
  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("id", noteId);

  if (error) {
    throw error;
  }
}
