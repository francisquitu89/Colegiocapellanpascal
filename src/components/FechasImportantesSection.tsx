import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CalendarDays, ChevronLeft, ChevronRight, Clock, Sparkles } from 'lucide-react';
import { driveRoutesSupabase } from '../lib/supabase';

interface SchoolEvent {
  id: number | string;
  fecha: string;
  hora: string | null;
  actividad: string;
  year: number;
}

interface FechasImportantesSectionProps {
  onBack?: () => void;
  embedded?: boolean;
}

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const MONTH_FORMATTER = new Intl.DateTimeFormat('es-CL', { month: 'long', year: 'numeric' });
const EVENT_DATE_FORMATTER = new Intl.DateTimeFormat('es-CL', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function shiftMonth(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

export default function FechasImportantesSection({
  onBack,
  embedded = false,
}: FechasImportantesSectionProps) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(() => toDateKey(today));
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const loadEvents = useCallback(async () => {
    const year = viewDate.getFullYear();
    setLoading(true);
    setLoadError('');

    const { data, error } = await driveRoutesSupabase
      .from('fechas_importantes')
      .select('id, fecha, hora, actividad, year')
      .eq('year', year)
      .order('fecha', { ascending: true })
      .order('hora', { ascending: true });

    if (error) {
      console.error('Error loading school calendar:', error);
      setLoadError('No pudimos cargar el calendario. Revisa tu conexión e inténtalo otra vez.');
      setEvents([]);
    } else {
      setEvents(data || []);
    }
    setLoading(false);
  }, [viewDate]);

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  const eventsByDate = useMemo(() => {
    const grouped = new Map<string, SchoolEvent[]>();
    events.forEach((event) => {
      const dayEvents = grouped.get(event.fecha) || [];
      dayEvents.push(event);
      grouped.set(event.fecha, dayEvents);
    });
    return grouped;
  }, [events]);

  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cellCount = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;

    return Array.from({ length: cellCount }, (_, index) => {
      const dayNumber = index - firstWeekday + 1;
      if (dayNumber < 1 || dayNumber > daysInMonth) return null;
      const date = new Date(year, month, dayNumber);
      const key = toDateKey(date);
      return {
        date,
        key,
        dayNumber,
        dayEvents: eventsByDate.get(key) || [],
      };
    });
  }, [eventsByDate, viewDate]);

  const selectedEvents = eventsByDate.get(selectedDate) || [];
  const selectedDateLabel = EVENT_DATE_FORMATTER.format(new Date(`${selectedDate}T12:00:00`));

  const changeMonth = (amount: number) => {
    const nextMonth = shiftMonth(viewDate, amount);
    setViewDate(nextMonth);
    setSelectedDate(toDateKey(nextMonth));
  };

  return (
    <main
      id={embedded ? 'school-calendar' : undefined}
      className={`scroll-mt-20 bg-[#f4f7fb] px-4 sm:px-6 ${
        embedded ? 'py-12 sm:py-16' : 'min-h-screen pb-16 pt-8 sm:pt-12'
      }`}
    >
      <div className="mx-auto max-w-7xl">
        {!embedded && onBack && (
          <button
            type="button"
            onClick={onBack}
            className="mb-6 inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-[#164677] transition hover:bg-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </button>
        )}

        <section className="relative mb-8 overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#063b70] via-[#0b568d] to-[#1689a5] px-6 py-8 text-white shadow-xl sm:px-10 sm:py-10">
          <div className="absolute -right-12 -top-16 h-64 w-64 rounded-full border-[28px] border-white/10" aria-hidden="true" />
          <div className="absolute bottom-0 right-28 h-24 w-24 rounded-full bg-[#f2c500]/20 blur-2xl" aria-hidden="true" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-sky-100">
                <Sparkles className="h-3.5 w-3.5 text-[#f2c500]" />
                Vida escolar
              </div>
              {embedded ? (
                <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">Calendario escolar</h2>
              ) : (
                <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">Calendario escolar</h1>
              )}
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-sky-100 sm:text-base">
                Fechas, encuentros y momentos importantes de nuestra comunidad Capellán Pascal.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
              <CalendarDays className="h-8 w-8 text-[#f2c500]" />
              <div>
                <p className="text-xs uppercase tracking-wider text-sky-100">Comunidad</p>
                <p className="font-semibold">Dios, Patria y Familia</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(18rem,0.85fr)]">
          <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-7" aria-label="Calendario mensual">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Agenda del colegio</p>
                <h2 className="mt-1 text-xl font-bold capitalize text-[#123c66] sm:text-2xl">
                  {MONTH_FORMATTER.format(viewDate)}
                </h2>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
                    setSelectedDate(toDateKey(today));
                  }}
                  className="mr-1 hidden rounded-full px-3 py-2 text-xs font-semibold text-[#164677] hover:bg-sky-50 sm:inline-flex"
                >
                  Hoy
                </button>
                <button
                  type="button"
                  onClick={() => changeMonth(-1)}
                  aria-label="Mes anterior"
                  className="rounded-full border border-slate-200 p-2 text-[#164677] transition hover:border-sky-300 hover:bg-sky-50"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => changeMonth(1)}
                  aria-label="Mes siguiente"
                  className="rounded-full border border-slate-200 p-2 text-[#164677] transition hover:border-sky-300 hover:bg-sky-50"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 border-b border-slate-100 pb-2">
              {WEEKDAYS.map((day) => (
                <div key={day} className="py-2 text-center text-[10px] font-bold uppercase tracking-wide text-slate-400 sm:text-xs">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 pt-2 sm:gap-2">
              {calendarDays.map((day, index) => {
                if (!day) return <div key={`empty-${index}`} className="min-h-12 sm:min-h-20" aria-hidden="true" />;

                const isToday = day.key === toDateKey(today);
                const isSelected = day.key === selectedDate;
                return (
                  <button
                    key={day.key}
                    type="button"
                    onClick={() => setSelectedDate(day.key)}
                    aria-label={`${day.dayNumber} ${MONTH_FORMATTER.format(viewDate)}${day.dayEvents.length ? `, ${day.dayEvents.length} eventos` : ''}`}
                    aria-pressed={isSelected}
                    className={`flex min-h-12 flex-col items-center rounded-xl px-1 py-2 transition sm:min-h-20 sm:rounded-2xl sm:py-3 ${
                      isSelected
                        ? 'bg-[#0b568d] text-white shadow-md'
                        : isToday
                          ? 'bg-amber-50 font-bold text-[#123c66] ring-1 ring-[#f2c500]'
                          : 'text-slate-700 hover:bg-sky-50'
                    }`}
                  >
                    <span className="text-xs sm:text-sm">{day.dayNumber}</span>
                    <span className="mt-1 flex min-h-2 items-center gap-0.5" aria-hidden="true">
                      {day.dayEvents.slice(0, 3).map((event) => (
                        <span
                          key={event.id}
                          className={`h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-[#f2c500]' : 'bg-[#1689a5]'}`}
                        />
                      ))}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
              <span className="h-2 w-2 rounded-full bg-[#1689a5]" />
              Días con actividades del colegio
            </div>
          </section>

          <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Lo que vivimos juntos</p>
                <h2 className="mt-1 text-lg font-bold capitalize text-[#123c66]">{selectedDateLabel}</h2>
              </div>
              <span className="rounded-xl bg-amber-50 p-2 text-amber-600">
                <CalendarDays className="h-5 w-5" />
              </span>
            </div>

            {loading ? (
              <div className="flex items-center gap-3 py-8 text-sm text-slate-500">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-sky-600 border-t-transparent" />
                Cargando actividades...
              </div>
            ) : loadError ? (
              <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
                <p>{loadError}</p>
                <button type="button" onClick={() => void loadEvents()} className="mt-3 font-semibold underline">
                  Reintentar
                </button>
              </div>
            ) : selectedEvents.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 px-4 py-8 text-center">
                <CalendarDays className="mx-auto h-8 w-8 text-slate-300" />
                <p className="mt-3 text-sm font-medium text-slate-600">No hay actividades para este día</p>
                <p className="mt-1 text-xs text-slate-400">Selecciona otra fecha para revisar la agenda.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedEvents.map((event) => (
                  <article key={event.id} className="rounded-2xl border border-sky-100 bg-sky-50/70 p-4">
                    <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#1689a5]">
                      <span className="h-2 w-2 rounded-full bg-[#f2c500]" />
                      Actividad escolar
                    </div>
                    <p className="font-semibold leading-relaxed text-[#123c66]">{event.actividad}</p>
                    {event.hora && (
                      <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-slate-500">
                        <Clock className="h-3.5 w-3.5" />
                        {event.hora}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            )}

            <div className="mt-6 rounded-2xl bg-gradient-to-r from-[#063b70] to-[#1689a5] p-4 text-white">
              <p className="text-xs font-semibold uppercase tracking-wider text-sky-100">Siempre al día</p>
              <p className="mt-1 text-sm leading-relaxed">
                Las actividades se actualizan desde el portal de gestión del colegio.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
