import { createClient } from '@supabase/supabase-js';

// Configuración principal - Supabase principal
const PRIMARY_SUPABASE_URL = 'https://ntncdusmihemyaqrzajm.supabase.co';
const PRIMARY_SUPABASE_KEY = 'sb_publishable_kh_0x5npworQbEFVlyK3Xw_2kidvRNM';

// Configuración de fallback (variables de entorno)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const driveRoutesSupabaseUrl = import.meta.env.VITE_DRIVE_ROUTES_SUPABASE_URL || PRIMARY_SUPABASE_URL;
const driveRoutesSupabasePublishableKey = import.meta.env.VITE_DRIVE_ROUTES_SUPABASE_PUBLISHABLE_KEY || PRIMARY_SUPABASE_KEY;

// Validar que la URL principal esté disponible
console.log('Primary Supabase URL (ntncdusmihemyaqrzajm):', driveRoutesSupabaseUrl);
console.log('Fallback Supabase URL:', supabaseUrl || 'Not configured');

if (!driveRoutesSupabaseUrl || !driveRoutesSupabasePublishableKey) {
  throw new Error('Missing primary Supabase configuration');
}

// Verificar si hay un Supabase secundario configurado
if (supabaseUrl && supabaseAnonKey) {
  if (supabaseUrl !== driveRoutesSupabaseUrl) {
    console.warn(
      'WARNING: Secondary Supabase configured. Primary will be used: ' + driveRoutesSupabaseUrl,
      'Secondary (fallback only):', supabaseUrl
    );
  }
} else {
  console.warn('No secondary Supabase configured. Using primary only.');
}

// Cliente principal - SIEMPRE apunta a https://ntncdusmihemyaqrzajm.supabase.co
export const driveRoutesSupabase = createClient(driveRoutesSupabaseUrl, driveRoutesSupabasePublishableKey);

// Cliente secundario - para fallback (usa variables de entorno si está configurado, sino usa la principal)
export const supabase = (supabaseUrl && supabaseAnonKey && supabaseUrl !== driveRoutesSupabaseUrl)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : driveRoutesSupabase; // Si no hay secundario configurado, usa el principal

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  images: string[];
  video_url?: string;
  created_at: string;
  updated_at: string;
}

export interface EditorialItem {
  id: string;
  title: string;
  content: string;
  date: string;
  images: string[];
  video_url?: string;
  created_at: string;
  updated_at: string;
}

export interface DirectoryMember {
  id: string;
  name: string;
  position: string;
  photo_url?: string;
  category: 'directorio' | 'rectoria';
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface DepartmentHead {
  id: string;
  department: string;
  name: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface OrientationTeamMember {
  id: string;
  name: string;
  position: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface CycleCoordinator {
  id: string;
  cycle_name: string;
  grade_range: string;
  coordinator_name: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface PastoralTeamMember {
  id: string;
  name: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface ComunidadBloque {
  id: string;
  bloque_numero: number;
  titulo: string;
  descripcion: string;
  boton_texto: string;
  boton_url: string;
  mostrar_integrantes: boolean;
  activo: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface ComunidadFoto {
  id: string;
  bloque_id: string;
  photo_url: string;
  photo_name: string;
  caption: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface ComunidadIntegrante {
  id: string;
  bloque_id: string;
  nombre: string;
  cargo: string;
  foto_url: string;
  email: string;
  telefono: string;
  descripcion: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}