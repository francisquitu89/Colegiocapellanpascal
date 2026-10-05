import React, { useEffect, useState } from 'react'
import { fetchPlanBooks } from '../lib/planLector'

export default function PlanLectorSection({ onBack }: { onBack: () => void }) {
  const [books, setBooks] = useState<any[]>([])
  const [q, setQ] = useState('')
  const [course, setCourse] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    load()
  }, [course])

  const load = async () => {
    setLoading(true)
    const data = await fetchPlanBooks({ course, q })
    setBooks(data)
    setLoading(false)
  }

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault()
    await load()
  }

  const courses = Array.from(new Set(books.map(b => b.course))).sort()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Plan Lector (Buscador)</h1>
            <p className="text-sm text-gray-600">Busca por curso, título, autor o editorial</p>
          </div>
          <div>
            <button onClick={onBack} className="px-4 py-2 bg-white rounded shadow">Volver</button>
          </div>
        </div>

        <form onSubmit={handleSearch} className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-3">
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar título, autor, editorial" className="px-4 py-2 rounded border" />
          <select value={course} onChange={e => setCourse(e.target.value)} className="px-4 py-2 rounded border">
            <option value="">Todos los cursos</option>
            {/* static options for convenience */}
            <option>1º Básico</option>
            <option>2º Básico</option>
            <option>3º Básico</option>
            <option>4º Básico</option>
            <option>5º Básico</option>
            <option>6º Básico</option>
            <option>7º Básico</option>
            <option>8º Básico</option>
            <option>I Medio</option>
            <option>II Medio</option>
            <option>III Medio</option>
            <option>IV Medio</option>
          </select>
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded">Buscar</button>
            <button type="button" onClick={() => { setQ(''); setCourse(''); load() }} className="px-4 py-2 bg-white rounded border">Limpiar</button>
          </div>
        </form>

        <div className="bg-white rounded-lg shadow p-4">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="space-y-4">
              {books.length === 0 ? (
                <div className="text-gray-500">No se encontraron resultados</div>
              ) : (
                books.map(book => (
                  <div key={book.id} className="border-b pb-3">
                    <div className="flex justify-between">
                      <div>
                        <div className="text-sm text-gray-500">{book.course} • {book.category || ''} {book.unit ? `• ${book.unit}` : ''}</div>
                        <div className="text-lg font-semibold text-blue-900">{book.title}</div>
                        <div className="text-sm text-gray-600">{book.author} — {book.editorial}</div>
                        {book.notes && <div className="text-xs text-gray-500 mt-1">{book.notes}</div>}
                      </div>
                      <div className="text-sm text-gray-500">{book.is_choice ? 'Opción' : ''}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
