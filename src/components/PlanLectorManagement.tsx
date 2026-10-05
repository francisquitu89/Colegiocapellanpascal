import React, { useEffect, useState } from 'react'
import { fetchPlanBooks, addPlanBook, updatePlanBook, deletePlanBook } from '../lib/planLector'
import { Save, Plus, Trash2, Edit2, ArrowLeft } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function PlanLectorManagement({ onBack }: { onBack: () => void }) {
  const [books, setBooks] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState<any | null>(null)
  const [form, setForm] = useState<any>({ course: '', title: '', author: '', editorial: '', category: '', unit: '', order_index: 0, notes: '' })
  const [showAdd, setShowAdd] = useState(false)

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    const all = await fetchPlanBooks({})
    setBooks(all)
    setLoading(false)
  }

  const handleAdd = async () => {
    const created = await addPlanBook(form)
    if (created) { setForm({ course: '', title: '', author: '', editorial: '', category: '', unit: '', order_index: 0, notes: '' }); setShowAdd(false); await load() }
  }

  const startEdit = (b: any) => { setEditing(b); setForm(b); }
  const handleSaveEdit = async () => { if (!editing) return; await updatePlanBook(editing.id, form); setEditing(null); setForm({ course: '', title: '', author: '', editorial: '', category: '', unit: '', order_index: 0, notes: '' }); await load() }
  const handleDelete = async (id: string) => { if (!confirm('Eliminar este registro?')) return; await deletePlanBook(id); await load() }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <button onClick={onBack} className="flex items-center text-red-600 mb-2"><ArrowLeft className="mr-2"/>Volver</button>
            <h1 className="text-2xl font-bold">Gestión Plan Lector</h1>
            <p className="text-sm text-gray-600">Administra los libros del plan lector</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowAdd(!showAdd)} className="px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-2"><Plus/>Agregar</button>
            <button onClick={load} className="px-4 py-2 bg-white rounded border">Recargar</button>
          </div>
        </div>

        {showAdd && (
          <div className="bg-white rounded shadow p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input placeholder="Curso" value={form.course} onChange={e=>setForm({...form, course:e.target.value})} className="px-3 py-2 border rounded" />
              <input placeholder="Título" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} className="px-3 py-2 border rounded col-span-2" />
              <input placeholder="Autor" value={form.author} onChange={e=>setForm({...form, author:e.target.value})} className="px-3 py-2 border rounded" />
              <input placeholder="Editorial" value={form.editorial} onChange={e=>setForm({...form, editorial:e.target.value})} className="px-3 py-2 border rounded" />
              <input placeholder="Categoría" value={form.category} onChange={e=>setForm({...form, category:e.target.value})} className="px-3 py-2 border rounded" />
              <input placeholder="Unidad" value={form.unit} onChange={e=>setForm({...form, unit:e.target.value})} className="px-3 py-2 border rounded" />
              <input type="number" placeholder="Orden" value={form.order_index} onChange={e=>setForm({...form, order_index: parseInt(e.target.value||'0')})} className="px-3 py-2 border rounded" />
              <input placeholder="Notas" value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})} className="px-3 py-2 border rounded col-span-2" />
            </div>
            <div className="mt-3 flex gap-2">
              <button onClick={handleAdd} className="px-4 py-2 bg-green-600 text-white rounded flex items-center gap-2"><Save/>Guardar</button>
              <button onClick={()=>setShowAdd(false)} className="px-4 py-2 bg-gray-200 rounded">Cancelar</button>
            </div>
          </div>
        )}

        <div className="bg-white rounded shadow p-4">
          {loading ? <div>Cargando...</div> : (
            <div className="space-y-3">
              {books.map(b=> (
                <div key={b.id} className="flex items-start justify-between border-b pb-2">
                  <div>
                    <div className="text-sm text-gray-500">{b.course} {b.category ? `• ${b.category}` : ''} {b.unit ? `• ${b.unit}` : ''}</div>
                    <div className="text-lg font-semibold">{b.title}</div>
                    <div className="text-sm text-gray-600">{b.author} — {b.editorial}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={()=>startEdit(b)} className="p-2 bg-yellow-100 rounded"><Edit2/></button>
                    <button onClick={()=>handleDelete(b.id)} className="p-2 bg-red-100 rounded"><Trash2/></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {editing && (
          <div className="bg-white rounded shadow p-4 mt-6">
            <h3 className="font-semibold mb-2">Editar</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input placeholder="Curso" value={form.course} onChange={e=>setForm({...form, course:e.target.value})} className="px-3 py-2 border rounded" />
              <input placeholder="Título" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} className="px-3 py-2 border rounded col-span-2" />
              <input placeholder="Autor" value={form.author} onChange={e=>setForm({...form, author:e.target.value})} className="px-3 py-2 border rounded" />
              <input placeholder="Editorial" value={form.editorial} onChange={e=>setForm({...form, editorial:e.target.value})} className="px-3 py-2 border rounded" />
              <input placeholder="Categoría" value={form.category} onChange={e=>setForm({...form, category:e.target.value})} className="px-3 py-2 border rounded" />
              <input placeholder="Unidad" value={form.unit} onChange={e=>setForm({...form, unit:e.target.value})} className="px-3 py-2 border rounded" />
              <input type="number" placeholder="Orden" value={form.order_index} onChange={e=>setForm({...form, order_index: parseInt(e.target.value||'0')})} className="px-3 py-2 border rounded" />
              <input placeholder="Notas" value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})} className="px-3 py-2 border rounded col-span-2" />
            </div>
            <div className="mt-3 flex gap-2">
              <button onClick={handleSaveEdit} className="px-4 py-2 bg-green-600 text-white rounded flex items-center gap-2"><Save/>Guardar</button>
              <button onClick={()=>{ setEditing(null); setForm({ course: '', title: '', author: '', editorial: '', category: '', unit: '', order_index: 0, notes: '' }) }} className="px-4 py-2 bg-gray-200 rounded">Cancelar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
