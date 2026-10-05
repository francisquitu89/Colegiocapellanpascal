import { driveRoutesSupabase } from './supabase'

export interface PlanBook {
  id: string
  course: string
  category?: string
  unit?: string
  title: string
  author?: string
  editorial?: string
  is_choice?: boolean
  choice_group?: number | null
  order_index?: number
  notes?: string
  created_at?: string
  updated_at?: string
}

export async function fetchPlanBooks(filters: { course?: string; q?: string } = {}): Promise<PlanBook[]> {
  try {
    let query = driveRoutesSupabase.from('plan_lector_books').select('*')
    if (filters.course) query = query.eq('course', filters.course)
    if (filters.q) {
      const q = filters.q.trim()
      query = query.or(`title.ilike.%${q}%,author.ilike.%${q}%,editorial.ilike.%${q}%`)
    }
    const { data, error } = await query.order('course').order('order_index')
    if (error) throw error
    const rows = (data || []) as PlanBook[]

    // Deduplicate by course+title+author+editorial to avoid showing repeated entries
    const seen = new Set<string>()
    const deduped: PlanBook[] = []
    for (const r of rows) {
      const key = `${r.course}||${r.title}||${r.author||''}||${r.editorial||''}`.toLowerCase()
      if (!seen.has(key)) {
        seen.add(key)
        deduped.push(r)
      }
    }

    return deduped
  } catch (error) {
    console.error('fetchPlanBooks error', error)
    return []
  }
}

export async function addPlanBook(book: Partial<PlanBook>) {
  try {
    const { data, error } = await driveRoutesSupabase.from('plan_lector_books').insert([book]).select().single()
    if (error) throw error
    return data as PlanBook
  } catch (error) {
    console.error('addPlanBook error', error)
    return null
  }
}

export async function updatePlanBook(id: string, updates: Partial<PlanBook>) {
  try {
    const { data, error } = await driveRoutesSupabase.from('plan_lector_books').upsert(updates).eq('id', id).select().single()
    if (error) throw error
    return data as PlanBook
  } catch (error) {
    console.error('updatePlanBook error', error)
    return null
  }
}

export async function deletePlanBook(id: string) {
  try {
    const { error } = await driveRoutesSupabase.from('plan_lector_books').delete().eq('id', id)
    if (error) throw error
    return true
  } catch (error) {
    console.error('deletePlanBook error', error)
    return false
  }
}
