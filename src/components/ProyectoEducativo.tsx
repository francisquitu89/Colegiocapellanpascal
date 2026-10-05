import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Users, Heart, Target, GraduationCap } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { DepartmentHead, OrientationTeamMember, CycleCoordinator, PastoralTeamMember } from '../lib/supabase';

interface ProyectoEducativoProps {
  onBack: () => void;
}

const ProyectoEducativo: React.FC<ProyectoEducativoProps> = ({ onBack }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [departmentHeads, setDepartmentHeads] = useState<DepartmentHead[]>([]);
  const [orientationTeam, setOrientationTeam] = useState<OrientationTeamMember[]>([]);
  const [cycleCoordinators, setCycleCoordinators] = useState<CycleCoordinator[]>([]);
  const [pastoralTeam, setPastoralTeam] = useState<PastoralTeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsVisible(true);
    fetchAllData();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100; // Offset for sticky nav
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const fetchAllData = async () => {
    try {
      const [deptHeads, orientTeam, cycleCoords, pastTeam] = await Promise.all([
        supabase.from('department_heads').select('*').order('order_index', { ascending: true }),
        supabase.from('orientation_team').select('*').order('order_index', { ascending: true }),
        supabase.from('cycle_coordinators').select('*').order('order_index', { ascending: true }),
        supabase.from('pastoral_team').select('*').order('order_index', { ascending: true })
      ]);

      if (deptHeads.data) setDepartmentHeads(deptHeads.data);
      if (orientTeam.data) setOrientationTeam(orientTeam.data);
      if (cycleCoords.data) setCycleCoordinators(cycleCoords.data);
      if (pastTeam.data) setPastoralTeam(pastTeam.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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
            Proyecto Educativo
          </h1>
        </div>
      </div>

      {/* Quick Access Navigation */}
      <div className="sticky top-0 z-40 bg-white shadow-md border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto hide-scrollbar">
            <button
              onClick={() => scrollToSection('vicerectoria')}
              className="flex items-center space-x-2 px-6 py-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 whitespace-nowrap border-b-2 border-transparent hover:border-blue-600 flex-shrink-0"
            >
              <BookOpen className="w-5 h-5" />
              <span className="font-semibold">Vicerrectoría Académica</span>
            </button>
            
            <button
              onClick={() => scrollToSection('orientacion')}
              className="flex items-center space-x-2 px-6 py-4 text-gray-700 hover:text-green-600 hover:bg-green-50 transition-all duration-300 whitespace-nowrap border-b-2 border-transparent hover:border-green-600 flex-shrink-0"
            >
              <Heart className="w-5 h-5" />
              <span className="font-semibold">Orientación</span>
            </button>
            
            <button
              onClick={() => scrollToSection('coordinadores')}
              className="flex items-center space-x-2 px-6 py-4 text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-all duration-300 whitespace-nowrap border-b-2 border-transparent hover:border-purple-600 flex-shrink-0"
            >
              <Target className="w-5 h-5" />
              <span className="font-semibold">Coordinadores de Ciclo</span>
            </button>
            
            <button
              onClick={() => scrollToSection('pastoral')}
              className="flex items-center space-x-2 px-6 py-4 text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-300 whitespace-nowrap border-b-2 border-transparent hover:border-red-600 flex-shrink-0"
            >
              <Heart className="w-5 h-5" />
              <span className="font-semibold">Pastoral</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Vicerrectoría Académica y de Formación */}
        <div id="vicerectoria" className={`bg-white rounded-lg shadow-lg overflow-hidden mb-12 transition-all duration-1000 scroll-mt-24 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-white">Vicerrectoría Académica y de Formación</h2>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="mb-8">
              <p className="text-gray-700 leading-relaxed text-lg">
                La Vicerrectoría Académica y de Formación lidera el desarrollo educativo del colegio, trabajando en conjunto con los jefes de departamento para ofrecer una educación integral de excelencia. Nuestro objetivo es acompañar a cada estudiante en su proceso de aprendizaje, ayudándolos a descubrir y desarrollar sus talentos al máximo.
              </p>
            </div>

            <div className="mt-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <GraduationCap className="w-7 h-7 text-blue-600 mr-3" />
                Jefes de Departamentos
              </h3>
              {loading ? (
                <p className="text-center text-gray-600 py-4">Cargando...</p>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {departmentHeads.map((head) => (
                    <div key={head.id} className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-lg border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900">{head.department}:</span>
                        <span className="text-gray-700">{head.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Departamento de Orientación */}
        <div id="orientacion" className={`bg-white rounded-lg shadow-lg overflow-hidden mb-12 transition-all duration-1000 delay-200 scroll-mt-24 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-gradient-to-r from-green-600 to-green-700 p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-white">Departamento de Orientación y Apoyo Escolar</h2>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <p className="text-gray-700 leading-relaxed mb-8">
              El equipo del Departamento de Orientación brinda asesoría técnica a los distintos estamentos del colegio, a fin de enriquecer la tarea formativa y pedagógica. Para ello se enfoca en los siguientes ámbitos: acompañamiento psicológico, orientación vocacional y fomento de la convivencia escolar.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Users className="w-7 h-7 text-green-600 mr-3" />
              Equipo
            </h3>
            {loading ? (
              <p className="text-center text-gray-600 py-4">Cargando...</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {orientationTeam.map((member) => (
                  <div key={member.id} className="bg-gradient-to-r from-green-50 to-white p-5 rounded-lg border border-green-100 shadow-sm hover:shadow-md transition-shadow">
                    <p className="font-semibold text-gray-900 text-lg">{member.name}</p>
                    <p className="text-gray-600 text-sm mt-1">{member.position}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Coordinadores de Ciclo */}
        <div id="coordinadores" className={`bg-white rounded-lg shadow-lg overflow-hidden mb-12 transition-all duration-1000 delay-300 scroll-mt-24 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <Target className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-3xl font-bold text-white">Coordinadores de Ciclo</h2>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <p className="text-gray-700 leading-relaxed mb-8">
              La implementación de los objetivos del colegio se realiza a través de ciclos que agrupan a 6 cursos similares en etapas de desarrollo. Los Coordinadores velan por la conducción y la vida de sus ciclos, liderando y apoyando la labor que realizan los Profesores Jefes en la vida personal y comunitaria de cada curso.
            </p>

            {loading ? (
              <p className="text-center text-gray-600 py-4">Cargando...</p>
            ) : (
              <div className="space-y-4">
                {cycleCoordinators.map((coordinator) => (
                  <div key={coordinator.id} className="bg-gradient-to-r from-purple-50 to-white p-5 rounded-lg border-l-4 border-purple-600 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-bold text-gray-900 text-lg">{coordinator.cycle_name}</p>
                        <p className="text-gray-600 text-sm">({coordinator.grade_range})</p>
                      </div>
                      <p className="text-gray-800 font-semibold mt-2 md:mt-0">{coordinator.coordinator_name}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pastoral del Colegio */}
        <div id="pastoral" className={`bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-1000 delay-400 scroll-mt-24 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-gradient-to-r from-red-600 to-red-700 p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-3xl font-bold text-white">Pastoral del Colegio</h2>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="space-y-6 mb-8">
              <p className="text-gray-700 leading-relaxed">
                La pastoral de nuestro colegio brinda caminos concretos para hacer vida la espiritualidad del Colegio en diversos espacios formativos.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Para los alumnos ofrece instancias para facilitar la vivencia de la fe en el camino al encuentro personal y comunitario con Jesús y con María, en momentos de oración y capilla, clases de religión, catequesis, misiones, trabajo social, hitos formativos y diversas celebraciones litúrgicas, integrando el mundo natural y sobrenatural de nuestros niños y jóvenes.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Para los padres, apoderados y para profesores, la pastoral ofrece catequesis, jornadas de formación, reflexión y retiros. Además realiza actividades para motivar el compromiso social, con la finalidad de acompañar la vida de cada integrante.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Para trabajar cada uno de estos objetivos, la Pastoral cuenta con diversos equipos, quienes, a su vez, son acompañados por los Capellanes del Colegio.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Users className="w-7 h-7 text-red-600 mr-3" />
              Equipo Pastoral
            </h3>
            {loading ? (
              <p className="text-center text-gray-600 py-4">Cargando...</p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {pastoralTeam.map((member, index) => (
                  <div key={member.id} className="bg-gradient-to-r from-red-50 to-white px-4 py-3 rounded-full border border-red-200 shadow-sm hover:shadow-md transition-shadow">
                    <span className="text-gray-800 font-medium">{member.name}</span>
                    {index < pastoralTeam.length - 1 && <span className="text-gray-400 ml-2">•</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProyectoEducativo;
