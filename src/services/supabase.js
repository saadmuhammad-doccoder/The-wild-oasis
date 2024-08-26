import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = "https://gsvhvhogyaprlgijikln.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdzdmh2aG9neWFwcmxnaWppa2xuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM1MTkyODIsImV4cCI6MjAzOTA5NTI4Mn0.LmfB9PYH1HAo1fgzOf1DU8DhjTnvEwhXvRcIxD91jos";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
