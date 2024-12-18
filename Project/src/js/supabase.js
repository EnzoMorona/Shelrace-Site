import { createClient } from '../../node_modules/@supabase/supabase-js';

const supabaseUrl = 'https://trrhcgbhndoniekxkfac.supabase.co'; // Substitua pela sua URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRycmhjZ2JobmRvbmlla3hrZmFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM1MTU4NzcsImV4cCI6MjA0OTA5MTg3N30.g4EmSFucclZPZzz885Vn9pifexe82NmKWNmJ0eWmKpg'; // Substitua pela sua API Key
export const supabase = createClient(supabaseUrl, supabaseKey);



