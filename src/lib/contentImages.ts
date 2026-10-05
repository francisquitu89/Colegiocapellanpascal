import { supabase } from './supabase'

export interface ContentImage {
  id: string
  content_id: string
  content_type: 'news' | 'editorial'
  url: string
  alt_text: string | null
  position_in_content: number
  alignment: 'left' | 'right' | 'center'
  width: number | null
  height: number | null
  is_primary: boolean
  created_at: string
  updated_at: string
}

export async function fetchContentImages(contentId: string): Promise<ContentImage[]> {
  try {
    const { data, error } = await supabase
      .from('content_images')
      .select('*')
      .eq('content_id', contentId)
      .order('position_in_content', { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching content images:', error)
    return []
  }
}

export async function saveContentImage(image: Partial<ContentImage>): Promise<ContentImage | null> {
  try {
    const { data, error } = await supabase
      .from('content_images')
      .insert([image])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error saving content image:', error)
    return null
  }
}

export async function updateContentImage(
  id: string, 
  updates: Partial<ContentImage>
): Promise<ContentImage | null> {
  try {
    const { data, error } = await supabase
      .from('content_images')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating content image:', error)
    return null
  }
}

export async function deleteContentImage(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('content_images')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting content image:', error)
    return false
  }
}

export async function setPrimaryImage(
  contentId: string, 
  imageId: string
): Promise<boolean> {
  try {
    // Primero, quitar is_primary de todas las imágenes de este contenido
    await supabase
      .from('content_images')
      .update({ is_primary: false })
      .eq('content_id', contentId)

    // Luego, establecer la imagen seleccionada como primary
    const { error } = await supabase
      .from('content_images')
      .update({ is_primary: true })
      .eq('id', imageId)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error setting primary image:', error)
    return false
  }
}
