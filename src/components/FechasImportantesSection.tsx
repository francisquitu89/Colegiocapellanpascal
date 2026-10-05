import { useState, useEffect } from 'react';
import { Calendar, Clock, ArrowLeft, Search } from 'lucide-react';
import { driveRoutesSupabase, supabase } from '../lib/supabase';

interface Fecha {
  id: number;
  fecha: string;
  hora: string | null;
  actividad: string;
  year: number;
}

interface FechasImportantesSectionProps {
  onBack: () => void;
}

export default function FechasImportantesSection({ onBack }: FechasImportantesSectionProps) {
  const [fechas, setFechas] = useState<Fecha[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>('todos');

  useEffect(() => {
    fetchFechas();
    fetchAvailableYears();
  }, [selectedYear]);

  const fetchAvailableYears = async () => {
    try {
      // Intentar leer del servidor secundario (antiguo) primero
      let result = await supabase
        .from('fechas_importantes')
        .select('year');

      if (result.error || !result.data) {
        console.log('Fallback a servidor principal para años de fechas_importantes');
        result = await driveRoutesSupabase
          .from('fechas_importantes')
          .select('year');
      }

      if (result.error) throw result.error;
      const data = result.data;

      // Get unique years and sort descending
      const years = [...new Set(data?.map((item: { year: number }) => item.year) || [])].sort((a, b) => b - a);
      setAvailableYears(years);
    } catch (error) {
      console.error('Error fetching years:', error);
    }
  };

  const fetchFechas = async () => {
    try {
      setLoading(true);
      // Intentar leer del servidor secundario (antiguo) primero
      let result = await supabase
        .from('fechas_importantes')
        .select('*')
        .eq('year', selectedYear)
        .order('fecha', { ascending: true });

      if (result.error || !result.data) {
        console.log('Fallback a servidor principal para fechas_importantes');
        result = await driveRoutesSupabase
          .from('fechas_importantes')
          .select('*')
          .eq('year', selectedYear)
          .order('fecha', { ascending: true });
      }

      if (result.error) throw result.error;
      setFechas(result.data || []);
    } catch (error) {
      console.error('Error fetching fechas:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatFecha = (fecha: string) => {
    const date = new Date(fecha + 'T00:00:00');
    return date.toLocaleDateString('es-CL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getMonthFromDate = (fecha: string) => {
    const date = new Date(fecha + 'T00:00:00');
    return date.toLocaleDateString('es-CL', { month: 'long' });
  };

  const getMonthNumber = (fecha: string) => {
    const date = new Date(fecha + 'T00:00:00');
    return date.getMonth() + 1; // 1-12
  };

  // Filter by selected month
  const filteredFechas = selectedMonth === 'todos' 
    ? fechas 
    : fechas.filter(fecha => getMonthNumber(fecha.fecha).toString() === selectedMonth);

  // Group dates by month
  const groupedFechas = filteredFechas.reduce((acc, fecha) => {
    const month = getMonthFromDate(fecha.fecha);
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(fecha);
    return acc;
  }, {} as Record<string, Fecha[]>);

  // Get available months from fechas
  const availableMonths = Array.from(new Set(fechas.map(fecha => {
    const monthNum = getMonthNumber(fecha.fecha);
    return monthNum.toString();
  }))).sort((a, b) => parseInt(a) - parseInt(b));

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 mb-6 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Volver</span>
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-lg">
              <Calendar className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Fechas Importantes</h1>
              <p className="text-gray-600 mt-2">Calendario de actividades y eventos del colegio</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Year Selector */}
            {availableYears.length > 1 && (
              <div className="flex items-center gap-4">
                <label className="text-gray-700 font-medium">Año:</label>
                <select
                  value={selectedYear}
                  onChange={(e) => {
                    setSelectedYear(Number(e.target.value));
                    setSelectedMonth('todos');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  {availableYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Month Selector */}
            <div className="flex items-center gap-4 flex-1">
              <label className="text-gray-700 font-medium flex items-center gap-2">
                <Search className="h-5 w-5" />
                Mes:
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="todos">Todos los meses</option>
                {availableMonths.map((monthNum) => (
                  <option key={monthNum} value={monthNum}>
                    {monthNames[parseInt(monthNum) - 1]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          </div>
        ) : (
          <>
            {filteredFechas.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">
                  {selectedMonth === 'todos' 
                    ? `No hay fechas importantes registradas para ${selectedYear}`
                    : `No hay fechas importantes en ${monthNames[parseInt(selectedMonth) - 1]} de ${selectedYear}`
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {Object.entries(groupedFechas).map(([month, monthFechas]) => (
                  <div key={month} className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Month Header */}
                    <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-4">
                      <h2 className="text-2xl font-bold text-white capitalize">{month}</h2>
                    </div>

                    {/* Events List */}
                    <div className="divide-y divide-gray-200">
                      {monthFechas.map((fecha) => (
                        <div
                          key={fecha.id}
                          className="p-6 hover:bg-amber-50 transition-colors"
                        >
                          <div className="flex flex-col md:flex-row md:items-start gap-4">
                            {/* Date */}
                            <div className="flex-shrink-0 md:w-48">
                              <div className="flex items-center gap-2 text-amber-600 font-semibold">
                                <Calendar className="h-5 w-5" />
                                <span>{formatFecha(fecha.fecha)}</span>
                              </div>
                              {fecha.hora && (
                                <div className="flex items-center gap-2 text-gray-600 mt-1 ml-7">
                                  <Clock className="h-4 w-4" />
                                  <span className="text-sm">{fecha.hora}</span>
                                </div>
                              )}
                            </div>

                            {/* Activity */}
                            <div className="flex-1">
                              <p className="text-gray-800 text-lg leading-relaxed">
                                {fecha.actividad}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Info Section */}
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-amber-900 mb-2">
            Información Importante
          </h3>
          <ul className="text-amber-800 space-y-1">
            <li>• Las fechas están sujetas a modificaciones según calendario ministerial</li>
            <li>• Se recomienda revisar periódicamente para actualizaciones</li>
            <li>• Para consultas específicas, contactar a la administración del colegio</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
