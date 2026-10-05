/**
 * Utilidades para optimización y compresión de archivos
 * antes de subirlos a Supabase Storage
 */

/**
 * Comprime una imagen manteniendo buena calidad
 * @param file - Archivo de imagen original
 * @param maxWidth - Ancho máximo de la imagen (default: 1920px)
 * @param maxHeight - Alto máximo de la imagen (default: 1080px)
 * @param quality - Calidad de compresión 0-1 (default: 0.8)
 * @returns Archivo optimizado
 */
export async function optimizeImage(
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1080,
  quality: number = 0.8
): Promise<File> {
  // Si el archivo es SVG, no lo optimizamos
  if (file.type === 'image/svg+xml') {
    return file;
  }

  const preserveTransparency = file.type === 'image/png' || file.type === 'image/webp';
  const outputMimeType = preserveTransparency ? file.type : 'image/jpeg';

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // Calcular nuevas dimensiones manteniendo el aspect ratio
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        // Crear canvas para comprimir
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('No se pudo crear el contexto del canvas'));
          return;
        }

        // Dibujar imagen redimensionada
        ctx.drawImage(img, 0, 0, width, height);

        // Convertir a blob con compresión
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Error al comprimir la imagen'));
              return;
            }

            // Crear nuevo archivo con el blob comprimido
            const optimizedFile = new File([blob], file.name, {
              type: outputMimeType,
              lastModified: Date.now()
            });

            // Solo devolver el optimizado si es más pequeño
            if (optimizedFile.size < file.size) {
              console.log(`Imagen optimizada: ${file.size} → ${optimizedFile.size} bytes (${Math.round((1 - optimizedFile.size / file.size) * 100)}% reducción)`);
              resolve(optimizedFile);
            } else {
              console.log('La imagen ya está optimizada, usando original');
              resolve(file);
            }
          },
          outputMimeType,
          preserveTransparency ? undefined : quality
        );
      };

      img.onerror = () => {
        reject(new Error('Error al cargar la imagen'));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Comprime un PDF usando técnicas básicas
 * Nota: La compresión de PDF en el navegador es limitada.
 * Esta función principalmente valida y prepara el archivo.
 * @param file - Archivo PDF original
 * @returns Archivo PDF procesado
 */
export async function optimizePDF(file: File): Promise<File> {
  // Por ahora, validamos el PDF y lo devolvemos tal cual
  // La compresión real de PDFs requiere bibliotecas complejas
  // o procesamiento en el servidor
  
  console.log(`PDF procesado: ${file.name} (${file.size} bytes)`);
  
  // En el futuro, aquí se podría implementar:
  // - Validación más estricta del PDF
  // - Llamada a un servicio de compresión de PDFs
  // - Reducción de calidad de imágenes dentro del PDF
  
  return file;
}

/**
 * Optimiza cualquier tipo de archivo según su tipo
 * @param file - Archivo a optimizar
 * @returns Archivo optimizado
 */
export async function optimizeFile(file: File): Promise<File> {
  const fileType = file.type;

  try {
    // Optimizar imágenes
    if (fileType.startsWith('image/')) {
      return await optimizeImage(file);
    }

    // Optimizar PDFs
    if (fileType === 'application/pdf') {
      return await optimizePDF(file);
    }

    // Otros tipos de archivo se devuelven sin modificar
    console.log(`Tipo de archivo no optimizable: ${fileType}`);
    return file;
  } catch (error) {
    console.error('Error al optimizar archivo:', error);
    // En caso de error, devolver el archivo original
    return file;
  }
}

/**
 * Valida el tamaño y tipo de archivo antes de subir
 * @param file - Archivo a validar
 * @param maxSize - Tamaño máximo en bytes (default: 10MB)
 * @param allowedTypes - Tipos de archivo permitidos
 * @returns true si es válido, string con mensaje de error si no
 */
export function validateFile(
  file: File,
  maxSize: number = 10 * 1024 * 1024, // 10MB default
  allowedTypes?: string[]
): { valid: boolean; error?: string } {
  // Validar tamaño
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `El archivo es muy grande. Máximo ${Math.round(maxSize / 1024 / 1024)}MB`
    };
  }

  // Validar tipo si se especificaron tipos permitidos
  if (allowedTypes && allowedTypes.length > 0) {
    const isTypeAllowed = allowedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.replace('/*', '/'));
      }
      return file.type === type;
    });

    if (!isTypeAllowed) {
      return {
        valid: false,
        error: 'Tipo de archivo no permitido'
      };
    }
  }

  return { valid: true };
}

/**
 * Procesa múltiples archivos en paralelo
 * @param files - Array de archivos a procesar
 * @param onProgress - Callback opcional para reportar progreso
 * @returns Array de archivos optimizados
 */
export async function optimizeFiles(
  files: File[],
  onProgress?: (current: number, total: number) => void
): Promise<File[]> {
  const optimizedFiles: File[] = [];
  
  for (let i = 0; i < files.length; i++) {
    const optimized = await optimizeFile(files[i]);
    optimizedFiles.push(optimized);
    
    if (onProgress) {
      onProgress(i + 1, files.length);
    }
  }
  
  return optimizedFiles;
}
