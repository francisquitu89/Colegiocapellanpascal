import { useState, useEffect } from 'react';
import { ArrowLeft, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface DepartamentoOrientacionSectionProps {
  onBack: () => void;
}

interface OrientacionInfo {
  id: string;
  cover_image_url: string | null;
  intro_text: string;
}

interface TeamMember {
  id: string;
  name: string;
  position: string;
  order_index: number;
}

export default function DepartamentoOrientacionSection({ onBack }: DepartamentoOrientacionSectionProps) {
  const [info, setInfo] = useState<OrientacionInfo | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load info
      const { data: infoData, error: infoError } = await supabase
        .from('departamento_orientacion')
        .select('*')
        .single();

      if (infoError) throw infoError;
      setInfo(infoData);

      // Load team members
      const { data: teamData, error: teamError } = await supabase
        .from('orientacion_team_members')
        .select('*')
        .order('order_index');

      if (teamError) throw teamError;
      setTeamMembers(teamData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center text-red-600 hover:text-red-700 transition-all duration-300 mb-4 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Volver al inicio
          </button>
          <h1 className={`text-4xl md:text-5xl font-bold text-gray-900 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Departamento de Orientación
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Cover Image - Full size with white overlay */}
        {info?.cover_image_url && (
          <div className={`relative mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="relative h-[700px] rounded-xl overflow-hidden shadow-2xl">
              {/* Background Image - Full cover */}
              <img
                src={info.cover_image_url}
                alt="Departamento de Orientación"
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* White overlay to soften quality issues */}
              <div className="absolute inset-0 bg-white/30"></div>
            </div>
          </div>
        )}

        {/* Introduction */}
        <div className={`bg-white rounded-xl shadow-lg p-8 mb-12 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-lg text-gray-700 leading-relaxed">
            {info?.intro_text}
          </p>
        </div>

        {/* Team Section */}
        <div className={`bg-white rounded-xl shadow-lg p-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl font-bold text-blue-900 mb-8 flex items-center">
            <Users className="h-8 w-8 mr-3 text-red-600" />
            Nuestro Equipo
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-gradient-to-br from-blue-50 to-red-50 rounded-lg p-6 border-2 border-blue-100 hover:border-red-300 transition-all hover:shadow-lg transform hover:-translate-y-1 duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-red-600 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-blue-900 mb-1">
                      {member.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {member.position}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
