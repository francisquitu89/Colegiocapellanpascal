import React from 'react';
import { ArrowLeft, ExternalLink, Clock, Shield, FileText } from 'lucide-react';

interface StudentWithdrawalControlProps {
  onBack: () => void;
}

const StudentWithdrawalControl: React.FC<StudentWithdrawalControlProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center text-red-600 hover:text-red-700 transition-all duration-300 mb-4 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Volver al inicio
          </button>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Control de Retiro de Alumno
          </h1>
          <p className="text-gray-600 mt-4 text-lg">
            Sistema seguro para gestionar el retiro de estudiantes
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Information Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Seguro y Confiable</h3>
            <p className="text-gray-600 text-sm">
              Sistema protegido con validación de identidad para garantizar la seguridad de los estudiantes
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Disponible 24/7</h3>
            <p className="text-gray-600 text-sm">
              Acceso disponible en cualquier momento para situaciones de emergencia o necesidades especiales
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Registro Completo</h3>
            <p className="text-gray-600 text-sm">
              Mantiene un registro detallado de todos los retiros para transparencia y seguimiento
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 bg-red-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Sistema de Control de Retiro</h2>
                <p className="text-red-100">
                  Complete el formulario para autorizar el retiro de un estudiante
                </p>
              </div>
              <ExternalLink className="w-8 h-8 text-red-200" />
            </div>
          </div>

          {/* Iframe Container */}
          <div className="relative" style={{ height: '800px' }}>
            <iframe
              src="https://calm-creponne-245a26.netlify.app/"
              title="Control de Retiro de Alumno"
              className="w-full h-full border-0"
              allow="fullscreen"
              loading="lazy"
            />
          </div>

          {/* Footer Info */}
          <div className="p-6 bg-gray-50 border-t">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Shield className="w-4 h-4" />
                  <span>Conexión Segura</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Disponible 24/7</span>
                </div>
              </div>
              <div className="text-gray-500">
                Para soporte técnico, contacte a la administración del colegio
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Instrucciones de Uso</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Para Padres y Apoderados:</h4>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Complete todos los campos requeridos</li>
                <li>• Verifique la información del estudiante</li>
                <li>• Proporcione una razón válida para el retiro</li>
                <li>• Mantenga el comprobante de la solicitud</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Información Importante:</h4>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• El retiro debe ser autorizado por el apoderado titular</li>
                <li>• Se requiere identificación válida</li>
                <li>• Los retiros se procesan durante horario escolar</li>
                <li>• En caso de emergencia, contacte directamente al colegio</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentWithdrawalControl;