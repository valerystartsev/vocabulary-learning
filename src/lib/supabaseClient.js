// Импорт функции createClient из библиотеки supabase-js
import { createClient } from '@supabase/supabase-js';

// Достаём данные из env-переменных Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Создаём экземпляр Supabase-клиента и экспортируем его
export const supabase = createClient(supabaseUrl, supabaseAnonKey);