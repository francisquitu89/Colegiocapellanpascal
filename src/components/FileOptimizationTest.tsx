import React, { useState } from 'react';
import { Upload, CheckCircle, FileText } from 'lucide-react';
import { optimizeFile } from '../lib/fileOptimization';

/**
 * Componente de prueba para verificar la optimización de archivos
 * USO: Agregar temporalmente a AdminDashboard para probar
 */
const FileOptimizationTest: React.FC = () => {
  const [results, setResults] = useState<{
    originalSize: number;
    optimizedSize: number;
    reduction: number;
    fileName: string;
  } | null>(null);
  const [testing, setTesting] = useState(false);

  const handleTestFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setTesting(true);
    try {
      const originalSize = file.size;
      const optimizedFile = await optimizeFile(file);
      const optimizedSize = optimizedFile.size;
      const reduction = Math.round(((originalSize - optimizedSize) / originalSize) * 100);

      setResults({
        originalSize,
        optimizedSize,
        reduction,
        fileName: file.name
      });

      alert(`✅ Prueba completada!\n\nArchivo: ${file.name}\nOriginal: ${formatBytes(originalSize)}\nOptimizado: ${formatBytes(optimizedSize)}\nReducción: ${reduction}%`);
    } catch (error) {
      console.error('Error en prueba:', error);
      alert('Error al probar optimización');
    } finally {
      setTesting(false);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg p-6 border-2 border-blue-200">
      <div className="flex items-center mb-4">
        <FileText className="w-8 h-8 text-blue-600 mr-3" />
        <div>
          <h3 className="text-xl font-bold text-gray-900">🧪 Prueba de Optimización</h3>
          <p className="text-sm text-gray-600">Verifica que la compresión funciona correctamente</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Selecciona una imagen o PDF para probar:
          </label>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={handleTestFile}
            disabled={testing}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
          />
        </div>

        {results && (
          <div className="bg-white rounded-lg p-5 border-2 border-green-300 animate-fadeIn">
            <div className="flex items-center mb-3">
              <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
              <h4 className="font-bold text-green-900">Resultado de la prueba</h4>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Archivo:</span>
                <span className="font-medium">{results.fileName}</span>
              </div>
              
              <div className="border-t pt-2">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Tamaño Original:</span>
                  <span className="font-bold text-red-600">{formatBytes(results.originalSize)}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Tamaño Optimizado:</span>
                  <span className="font-bold text-green-600">{formatBytes(results.optimizedSize)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Reducción:</span>
                  <span className="font-bold text-blue-600">
                    {results.reduction}% 
                    {results.reduction > 0 ? ' 🎉' : ' (ya optimizado)'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-xs text-yellow-800">
            💡 <strong>Nota:</strong> Este componente es solo para pruebas. No sube archivos al servidor, 
            solo procesa la optimización localmente para que puedas verificar que funciona.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileOptimizationTest;
