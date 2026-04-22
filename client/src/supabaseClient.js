import { createClient } from '@supabase/supabase-js'

// This is for the React side!
const supabaseUrl = 'https://fotkonztoknosscvjnbc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvdGtvbnp0b2tub3NzY3ZqbmJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NzA5ODUsImV4cCI6MjA5MjQ0Njk4NX0.xt9qgixJjhV6ItrQTZuH_N-wbplGDplYIfg3lEexPt4'

export const supabase = createClient(supabaseUrl, supabaseKey)