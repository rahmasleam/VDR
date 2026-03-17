
import { createClient } from '@supabase/supabase-js';

// NEW CREDENTIALS PROVIDED
const supabaseUrl = 'https://jhsyduyjnlcxktofdhou.supabase.co';
const supabaseKey = 'sb_publishable_nMqZToqFPmbgcb6rKwaeTg_f6IraCOG';

export const supabase = createClient(supabaseUrl, supabaseKey);

// --- HELPER FUNCTIONS ---

export const uploadVdrFile = async (file: File, folderPath: string): Promise<{ path: string, error: any }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const timestamp = Date.now();
    // Sanitize filename
    const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const filePath = `${user.id}/${folderPath}/${timestamp}_${cleanName}`;

    const { data, error } = await supabase.storage
      .from('vdr-documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;
    return { path: data.path, error: null };
  } catch (error: any) {
    console.error('Upload failed:', error.message);
    return { path: '', error };
  }
};
