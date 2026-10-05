import { ArrowLeft, Heart, Users, BookOpen, Target, Globe, Lightbulb } from 'lucide-react';

interface VicerretoriaFormacionSectionProps {
  onBack: () => void;
}

export default function VicerretoriaFormacionSection({ onBack }: VicerretoriaFormacionSectionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-blue-900 via-red-900 to-blue-900 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://i.postimg.cc/PrkBSjSQ/asdawd.jpg')", opacity: 0.35 }}
        />
        
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <button
            onClick={onBack}
            className="inline-flex items-center text-white/90 hover:text-white mb-6 transition-colors group w-fit"
          >
            <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Volver al Inicio
          </button>
          
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              "FORMAR AL HOMBRE NUEVO EN LA NUEVA COMUNIDAD"
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-light">
              P.J.K.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-blue-900 mb-4">
            Vicerrectoría de Formación
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-red-600 mx-auto"></div>
        </div>

        {/* Introduction Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12">
          <div className="flex items-start space-x-4 mb-6">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-red-600 rounded-full flex items-center justify-center">
                <Heart className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-blue-900 mb-4">Nuestra Misión</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                El Área de Formación tiene por objetivo asegurar el carisma pedagógico y espiritual del Padre José Kentenich, fundador del movimiento de Schoenstatt en los procesos que impulsa el colegio para toda la comunidad escolar. Es la responsable de la implementación del Proyecto Educativo conducente al desarrollo orgánico de los alumnos con énfasis en el desarrollo personal y social, incluyendo la dimensión espiritual, ética, moral, afectiva y física de la persona.
              </p>
            </div>
          </div>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Pillar 1 */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1">
            <BookOpen className="h-12 w-12 mb-4 opacity-90" />
            <h3 className="text-xl font-bold mb-3">Educar en la Vivencia de la Fe</h3>
            <p className="text-blue-100 text-sm leading-relaxed">
              Promoviendo una relación profunda con Dios y los valores cristianos.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-xl p-6 text-white shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1">
            <Target className="h-12 w-12 mb-4 opacity-90" />
            <h3 className="text-xl font-bold mb-3">Educar para la Plenitud</h3>
            <p className="text-red-100 text-sm leading-relaxed">
              Que cada persona llegue a ser plenamente ella misma, según el Plan de Dios.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1">
            <Users className="h-12 w-12 mb-4 opacity-90" />
            <h3 className="text-xl font-bold mb-3">Educar en Comunidad</h3>
            <p className="text-blue-100 text-sm leading-relaxed">
              Sustentándose en vínculos sólidos y espíritu familiar.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-xl p-6 text-white shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1">
            <Lightbulb className="h-12 w-12 mb-4 opacity-90" />
            <h3 className="text-xl font-bold mb-3">Educar para la Excelencia</h3>
            <p className="text-red-100 text-sm leading-relaxed">
              Desarrollando con máximo esfuerzo todas las potencialidades.
            </p>
          </div>

          {/* Pillar 5 */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1">
            <Globe className="h-12 w-12 mb-4 opacity-90" />
            <h3 className="text-xl font-bold mb-3">Educar para Servir</h3>
            <p className="text-blue-100 text-sm leading-relaxed">
              Reconociendo necesidades y construyendo un nuevo orden social.
            </p>
          </div>

          {/* Pillar 6 */}
          <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-xl p-6 text-white shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1">
            <Heart className="h-12 w-12 mb-4 opacity-90" />
            <h3 className="text-xl font-bold mb-3">Compromiso Social</h3>
            <p className="text-red-100 text-sm leading-relaxed">
              Formación con sensibilidad y acción social cristiana.
            </p>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Section 1 */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-blue-900 mb-4 flex items-center">
              <Globe className="h-7 w-7 mr-3 text-red-600" />
              Vivimos en el Chile de Hoy
            </h3>
            <p className="text-gray-700 leading-relaxed">
              En el proceso formativo está esencialmente incorporada la dimensión social porque no queremos hombres-islas o comunidades-burbujas, esto significa que, no sólo se forma en espíritu familiar y se promueven los vínculos, sino especialmente que se desarrolla la sensibilidad y la acción social, para que se comprometan en la construcción de un nuevo orden social, conforme a la Doctrina Social de la Iglesia.
            </p>
          </div>

          {/* Section 2 */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-blue-900 mb-4 flex items-center">
              <Heart className="h-7 w-7 mr-3 text-red-600" />
              Apertura al Más Necesitado
            </h3>
            <p className="text-gray-700 leading-relaxed">
              La apertura hacia el más necesitado, es un aspecto fundamental en la formación de alumnos y alumnas, esto no es periférico al interés del colegio, sino es parte constitutiva de la formación que él entrega. El desarrollo de los talentos recibidos como un don que hay que cultivar para entregarlo a los demás, es tarea para toda su vida.
            </p>
          </div>

          {/* Section 3 - Synthesis */}
          <div className="bg-gradient-to-br from-blue-900 to-red-900 rounded-xl shadow-xl p-8 md:p-12 text-white">
            <h3 className="text-3xl font-bold mb-6 flex items-center">
              <Target className="h-8 w-8 mr-3" />
              En Síntesis
            </h3>
            <p className="text-lg leading-relaxed text-white/95">
              El colegio considera que la formación es un proceso continuo que los lleva a que se conozcan a sí mismos, se descubran y se formen como hombres y mujeres, que desarrollen su autoestima como hijos amados de Dios y lleguen a la aceptación realista de sí mismos; que vivan profundamente su fe y que desarrollen en ellos la capacidad de reflexión, el amor por la verdad, la capacidad de plantearse y de actuar frente a situaciones nuevas de acuerdo a los valores vividos en el colegio; la capacidad de actuar por propia decisión y de asumir las consecuencias de sus propias acciones; la posibilidad de establecer vínculos duraderos y el esfuerzo por auto educarse; y, finalmente, la conciencia de que su actuar cotidiano como hombre y como mujer es una tarea que contribuye a la construcción de la historia personal y social que conduce a los hombres hacia Dios.
            </p>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-12 text-center">
          <button
            onClick={onBack}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-red-600 text-white text-lg rounded-lg hover:from-blue-700 hover:to-red-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <ArrowLeft className="h-6 w-6 mr-2" />
            Volver al Inicio
          </button>
        </div>
      </div>
    </div>
  );
}
