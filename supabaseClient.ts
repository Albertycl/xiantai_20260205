import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tenrjckyoffxisoeuijb.supabase.co';
const supabaseAnonKey = 'sb_publishable_jOw98ADjjtQkDLKB9td1_g_0Kt_4o4r';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for trip notes
export interface TripNote {
  id?: number;
  event_id: string;
  details: string;
  created_at?: string;
  updated_at?: string;
}

// Save or update a note
export async function saveNote(eventId: string, details: string): Promise<boolean> {
  const { error } = await supabase
    .from('trip_notes')
    .upsert(
      { event_id: eventId, details, updated_at: new Date().toISOString() },
      { onConflict: 'event_id' }
    );

  if (error) {
    console.error('Error saving note:', error);
    return false;
  }
  return true;
}

// Load all notes
export async function loadAllNotes(): Promise<Record<string, string>> {
  const { data, error } = await supabase
    .from('trip_notes')
    .select('event_id, details');

  if (error) {
    console.error('Error loading notes:', error);
    return {};
  }

  const notes: Record<string, string> = {};
  data?.forEach((note) => {
    notes[note.event_id] = note.details;
  });
  return notes;
}

// Delete a note
export async function deleteNote(eventId: string): Promise<boolean> {
  const { error } = await supabase
    .from('trip_notes')
    .delete()
    .eq('event_id', eventId);

  if (error) {
    console.error('Error deleting note:', error);
    return false;
  }
  return true;
}
