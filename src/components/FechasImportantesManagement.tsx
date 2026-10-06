import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, CalendarDays, Clock3, Pencil, Plus, Save, Trash2, X } from 'lucide-react';
import { driveRoutesSupabase } from '../lib/supabase';

interface SchoolEvent {
  id: number;
  fecha: string;
  hora: string | null;
  actividad: string;
  year: number;
  imagen_url: string | null;
  etiqueta: string | null;
}

interface EventForm {
  fecha: string;
  hora: string;
  actividad: string;
  imagen_url: string;
  etiqueta: string;
}

interface FechasImportantesManagementProps {
  onBack: () => void;
}

const EMPTY_FORM: EventForm = {
  fecha: '',
  hora: '',
  actividad: '',
  imagen_url: '',
  etiqueta: '',
};

const formatFecha = (fecha: string) =>
  new Date(`${fecha}T12:00:00`).toLocaleDateString('es-CL', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

function isMissingImageColumn(error: { code?: string; message?: string }) {
  return error.code === '42703' || error.message?.includes('imagen_url');
}

function isMissingColumn(error: { code?: string; message?: string }, column: string) {
  return error.code === '42703' && error.message?.includes(column);
}

function isValidPostimageUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && (url.hostname === 'i.postimg.cc' || url.hostname === 'postimg.cc');
  } catch {
    return false;
  }
}

export default function FechasImportantesManagement({ onBack }: FechasImportantesManagementProps) {
  const currentYear = new Date().getFullYear();
  const [fechas, setFechas] = useState<SchoolEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<EventForm>(EMPTY_FORM);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [availableYears, setAvailableYears] = useState<number[]>([currentYear]);
  const [message, setMessage] = useState('');
  const [loadError, setLoadError] = useState('');
  const [supportsEventImages, setSupportsEventImages] = useState(true);
  const [supportsEventLabels, setSupportsEventLabels] = useState(true);

  const fetchFechas = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    const result = await driveRoutesSupabase
      .from('fechas_importantes')
      .select('id, fecha, hora, actividad, year, imagen_url, etiqueta')
      .eq('year', selectedYear)
      .order('fecha', { ascending: true })
      .order('hora', { ascending: true });

    if (result.error && isMissingColumn(result.error, 'etiqueta')) {
      setSupportsEventLabels(false);
      const imageResult = await driveRoutesSupabase
        .from('fechas_importantes')
        .select('id, fecha, hora, actividad, year, imagen_url')
        .eq('year', selectedYear)
        .order('fecha', { ascending: true })
        .order('hora', { ascending: true });

      if (imageResult.error && isMissingImageColumn(imageResult.error)) {
        setSupportsEventImages(false);
        const legacyResult = await driveRoutesSupabase
          .from('fechas_importantes')
          .select('id, fecha, hora, actividad, year')
          .eq('year', selectedYear)
          .order('fecha', { ascending: true })
          .order('hora', { ascending: true });

        if (legacyResult.error) {
          console.error('Error fetching school calendar:', legacyResult.error);
          setLoadError('No se pudieron cargar las actividades. Revisa la conexión con Supabase e inténtalo otra vez.');
          setFechas([]);
        } else {
          setFechas((legacyResult.data || []).map((event) => ({ ...event, imagen_url: null, etiqueta: null })));
        }
      } else if (imageResult.error) {
        console.error('Error fetching school calendar:', imageResult.error);
        setLoadError('No se pudieron cargar las actividades. Revisa la conexión con Supabase e inténtalo otra vez.');
        setFechas([]);
      } else {
        setSupportsEventImages(true);
        setFechas((imageResult.data || []).map((event) => ({ ...event, etiqueta: null })));
      }
    } else if (result.error && isMissingImageColumn(result.error)) {
      setSupportsEventImages(false);
      const legacyResult = await driveRoutesSupabase
        .from('fechas_importantes')
        .select('id, fecha, hora, actividad, year')
        .eq('year', selectedYear)
        .order('fecha', { ascending: true })
        .order('hora', { ascending: true });

      if (legacyResult.error) {
        console.error('Error fetching school calendar:', legacyResult.error);
        setLoadError('No se pudieron cargar las actividades. Revisa la conexión con Supabase e inténtalo otra vez.');
        setFechas([]);
      } else {
        setFechas((legacyResult.data || []).map((event) => ({ ...event, imagen_url: null, etiqueta: null })));
      }
    } else if (result.error) {
      console.error('Error fetching school calendar:', result.error);
      setLoadError('No se pudieron cargar las actividades. Revisa la conexión con Supabase e inténtalo otra vez.');
      setFechas([]);
    } else {
      setSupportsEventImages(true);
      setSupportsEventLabels(true);
      setFechas(result.data || []);
    }
    setLoading(false);
  }, [selectedYear]);

  const fetchAvailableYears = useCallback(async () => {
    const { data, error } = await driveRoutesSupabase
      .from('fechas_importantes')
      .select('year')
      .order('year', { ascending: false });

    if (error) {
      console.error('Error fetching calendar years:', error);
      return;
    }
    setAvailableYears([...new Set([currentYear, ...(data || []).map((item) => item.year)])].sort((a, b) => b - a));
  }, [currentYear]);

  useEffect(() => {
    void fetchFechas();
  }, [fetchFechas]);

  useEffect(() => {
    void fetchAvailableYears();
  }, [fetchAvailableYears]);

  const resetForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleSave = async () => {
    if (!form.fecha || !form.actividad.trim()) {
      setMessage('Completa la fecha y el nombre de la actividad.');
      return;
    }
    if (form.imagen_url.trim() && !isValidPostimageUrl(form.imagen_url.trim())) {
      setMessage('Usa un enlace HTTPS directo de i.postimg.cc para la foto.');
      return;
    }

    setSaving(true);
    setMessage('');
    const year = Number(form.fecha.slice(0, 4));
    const payload = {
      fecha: form.fecha,
      hora: form.hora.trim() || null,
      actividad: form.actividad.trim(),
      year,
      ...(supportsEventImages ? { imagen_url: form.imagen_url.trim() || null } : {}),
      ...(supportsEventLabels ? { etiqueta: form.etiqueta.trim() || null } : {}),
    };
    const result = editingId === null
      ? await driveRoutesSupabase.from('fechas_importantes').insert(payload)
      : await driveRoutesSupabase.from('fechas_importantes').update(payload).eq('id', editingId);

    if (result.error) {
      console.error('Error saving school calendar event:', result.error);
      setMessage('No se pudo guardar la actividad. Revisa la conexión y vuelve a intentarlo.');
      setSaving(false);
      return;
    }

    setMessage(editingId === null ? 'Actividad agregada al calendario.' : 'Actividad actualizada correctamente.');
    resetForm();
    if (year !== selectedYear) setSelectedYear(year);
    else await fetchFechas();
    await fetchAvailableYears();
    setSaving(false);
  };

  const handleEdit = (event: SchoolEvent) => {
    setEditingId(event.id);
    setForm({
      fecha: event.fecha,
      hora: event.hora || '',
      actividad: event.actividad,
      imagen_url: event.imagen_url,
      etiqueta: event.etiqueta || '',
    });
    setMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (event: SchoolEvent) => {
    if (!window.confirm(`¿Eliminar "${event.actividad}" del calendario?`)) return;
    setMessage('');

    const { error } = await driveRoutesSupabase
      .from('fechas_importantes')
      .delete()
      .eq('id', event.id);

    if (error) {
      console.error('Error deleting school calendar event:', error);
      setMessage('No se pudo eliminar la actividad. Inténtalo nuevamente.');
      return;
    }

    setMessage('Actividad eliminada del calendario.');
    if (editingId === event.id) resetForm();
    await fetchFechas();
    await fetchAvailableYears();
  };

  return (
    <main className="min-h-screen bg-[#f4f7fb] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <button
          type="button"
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-[#164677] transition hover:bg-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al panel
        </button>

        <section className="mb-7 rounded-3xl bg-gradient-to-r from-[#063b70] to-[#1689a5] p-6 text-white shadow-lg sm:p-8">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-white/15 p-3 text-[#f2c500]">
              <CalendarDays className="h-8 w-8" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-100">Portal de gestión escolar</p>
              <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Calendario del colegio</h1>
              <p className="mt-1 text-sm text-sky-100">Publica y administra las actividades de la comunidad Pascal.</p>
            </div>
          </div>
        </section>

        {(!supportsEventImages || !supportsEventLabels) && (
          <p role="status" className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            El calendario carga en modo compatible. Ejecuta las migraciones pendientes para guardar etiquetas y mostrar fotos.
          </p>
        )}

        <div className="grid gap-6 lg:grid-cols-[minmax(18rem,0.85fr)_minmax(0,1.5fr)]">
          <section className="h-fit rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <span className="rounded-xl bg-amber-50 p-2 text-amber-600"><Plus className="h-5 w-5" /></span>
              <div>
                <h2 className="font-bold text-[#123c66]">{editingId === null ? 'Nueva actividad' : 'Editar actividad'}</h2>
                <p className="text-xs text-slate-500">Completa los datos para el calendario público</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="calendar-date" className="mb-1.5 block text-sm font-semibold text-slate-700">Fecha *</label>
                <input
                  id="calendar-date"
                  type="date"
                  required
                  value={form.fecha}
                  onChange={(event) => setForm({ ...form, fecha: event.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </div>
              <div>
                <label htmlFor="calendar-time" className="mb-1.5 block text-sm font-semibold text-slate-700">Hora <span className="font-normal text-slate-400">(opcional)</span></label>
                <input
                  id="calendar-time"
                  type="text"
                  value={form.hora}
                  onChange={(event) => setForm({ ...form, hora: event.target.value })}
                  placeholder="Ej.: 19:00 hrs"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </div>
              <div>
                <label htmlFor="calendar-activity" className="mb-1.5 block text-sm font-semibold text-slate-700">Actividad *</label>
                <textarea
                  id="calendar-activity"
                  required
                  rows={4}
                  value={form.actividad}
                  onChange={(event) => setForm({ ...form, actividad: event.target.value })}
                  placeholder="Describe la actividad para las familias y estudiantes"
                  className="w-full resize-y rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </div>
              <div>
                <label htmlFor="calendar-event-label" className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Mini título <span className="font-normal text-slate-400">(opcional)</span>
                </label>
                <input
                  id="calendar-event-label"
                  type="text"
                  maxLength={50}
                  value={form.etiqueta}
                  disabled={!supportsEventLabels}
                  onChange={(event) => setForm({ ...form, etiqueta: event.target.value })}
                  placeholder="Ej.: Vida escolar"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                />
                <p className="mt-1 text-xs text-slate-400">Se mostrará como una etiqueta sobre la actividad.</p>
              </div>
              <div>
                <label htmlFor="calendar-event-image" className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Enlace directo de foto <span className="font-normal text-slate-400">(opcional)</span>
                </label>
                <input
                  id="calendar-event-image"
                  type="url"
                  value={form.imagen_url}
                  disabled={!supportsEventImages}
                  onChange={(event) => setForm({ ...form, imagen_url: event.target.value })}
                  placeholder="https://i.postimg.cc/.../foto.jpg"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                />
                {form.imagen_url && (
                  <img src={form.imagen_url} alt="Vista previa de la foto" className="mt-3 h-24 w-36 rounded-xl object-cover" />
                )}
              </div>
              {message && (
                <p role="status" className={`rounded-xl px-3 py-2 text-sm ${message.startsWith('No se pudo') || message.startsWith('Completa') || message.startsWith('Usa') ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
                  {message}
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void handleSave()}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0b568d] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#063b70] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save className="h-4 w-4" />
                  {saving ? 'Guardando...' : editingId === null ? 'Agregar actividad' : 'Guardar cambios'}
                </button>
                {editingId !== null && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                  >
                    <X className="h-4 w-4" />
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Eventos publicados</p>
                <h2 className="mt-1 text-xl font-bold text-[#123c66]">{fechas.length} actividades</h2>
              </div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                Año
                <select
                  value={selectedYear}
                  onChange={(event) => setSelectedYear(Number(event.target.value))}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-[#123c66] outline-none focus:border-sky-500"
                >
                  {availableYears.map((year) => <option key={year} value={year}>{year}</option>)}
                </select>
              </label>
            </div>

            {loading ? (
              <div className="flex items-center justify-center gap-3 py-12 text-sm text-slate-500">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-sky-600 border-t-transparent" />
                Cargando actividades...
              </div>
            ) : loadError ? (
              <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">
                <p>{loadError}</p>
                <button type="button" onClick={() => void fetchFechas()} className="mt-2 font-semibold underline">Reintentar</button>
              </div>
            ) : fechas.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 px-4 py-10 text-center">
                <CalendarDays className="mx-auto h-9 w-9 text-slate-300" />
                <p className="mt-3 font-semibold text-slate-600">Todavía no hay actividades para {selectedYear}</p>
                <p className="mt-1 text-sm text-slate-400">Agrega la primera desde el formulario.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {fechas.map((event) => (
                  <article key={event.id} className="flex flex-col gap-3 rounded-2xl border border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-start gap-3">
                      {event.imagen_url && (
                        <img src={event.imagen_url} alt="" className="h-14 w-16 shrink-0 rounded-lg object-cover" />
                      )}
                      <div className="shrink-0 rounded-xl bg-sky-50 px-3 py-2 text-center text-xs font-bold capitalize text-[#0b568d]">
                        {formatFecha(event.fecha)}
                      </div>
                      <div className="min-w-0">
                        {event.etiqueta && (
                          <span className="mb-1 inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#805900]">
                            {event.etiqueta}
                          </span>
                        )}
                        <h3 className="font-semibold leading-relaxed text-[#123c66]">{event.actividad}</h3>
                        {event.hora && <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-slate-500"><Clock3 className="h-3.5 w-3.5" />{event.hora}</p>}
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-2 sm:pl-3">
                      <button
                        type="button"
                        onClick={() => handleEdit(event)}
                        aria-label={`Editar ${event.actividad}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-sky-100 px-3 py-2 text-xs font-semibold text-[#0b568d] transition hover:bg-sky-50"
                      >
                        <Pencil className="h-3.5 w-3.5" /> Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDelete(event)}
                        aria-label={`Eliminar ${event.actividad}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Eliminar
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
