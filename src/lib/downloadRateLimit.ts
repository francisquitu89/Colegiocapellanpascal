/**
 * Sistema de rate limiting para descargas
 * Previene descargas excesivas del mismo archivo sin modificar la base de datos
 */

interface DownloadRecord {
  url: string;
  timestamp: number;
  count: number;
}

const STORAGE_KEY = 'download_records';
const TIME_WINDOW = 5 * 60 * 1000; // 5 minutos
const MAX_DOWNLOADS_PER_WINDOW = 3; // Máximo 3 descargas del mismo archivo en 5 minutos

/**
 * Obtiene los registros de descargas del localStorage
 */
function getDownloadRecords(): DownloadRecord[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const records = JSON.parse(stored) as DownloadRecord[];
    
    // Limpiar registros antiguos (más de 1 hora)
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    const cleanedRecords = records.filter(r => r.timestamp > oneHourAgo);
    
    // Guardar registros limpios
    if (cleanedRecords.length !== records.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanedRecords));
    }
    
    return cleanedRecords;
  } catch (error) {
    console.error('Error al leer registros de descargas:', error);
    return [];
  }
}

/**
 * Guarda los registros de descargas en localStorage
 */
function saveDownloadRecords(records: DownloadRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (error) {
    console.error('Error al guardar registros de descargas:', error);
  }
}

/**
 * Normaliza una URL para comparación
 */
function normalizeUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    // Usar pathname como identificador único
    return urlObj.pathname;
  } catch {
    // Si no es una URL válida, usar tal cual
    return url;
  }
}

/**
 * Verifica si se puede descargar un archivo
 * @param fileUrl - URL del archivo a descargar
 * @returns Objeto con información sobre si se puede descargar
 */
export function canDownloadFile(fileUrl: string): {
  allowed: boolean;
  reason?: string;
  remainingTime?: number;
  downloadsInWindow?: number;
} {
  const normalizedUrl = normalizeUrl(fileUrl);
  const records = getDownloadRecords();
  const now = Date.now();
  
  // Buscar registros del mismo archivo en la ventana de tiempo
  const recentDownloads = records.filter(
    r => r.url === normalizedUrl && (now - r.timestamp) < TIME_WINDOW
  );
  
  if (recentDownloads.length === 0) {
    return { allowed: true };
  }
  
  // Contar descargas totales en la ventana
  const totalDownloads = recentDownloads.reduce((sum, r) => sum + r.count, 0);
  
  if (totalDownloads >= MAX_DOWNLOADS_PER_WINDOW) {
    // Calcular tiempo restante hasta que expire la ventana
    const oldestDownload = recentDownloads[0];
    const windowEnd = oldestDownload.timestamp + TIME_WINDOW;
    const remainingTime = Math.ceil((windowEnd - now) / 1000); // en segundos
    
    return {
      allowed: false,
      reason: `Has alcanzado el límite de descargas para este archivo. Por favor espera ${Math.ceil(remainingTime / 60)} minuto(s).`,
      remainingTime,
      downloadsInWindow: totalDownloads
    };
  }
  
  return {
    allowed: true,
    downloadsInWindow: totalDownloads
  };
}

/**
 * Registra una descarga
 * @param fileUrl - URL del archivo descargado
 */
export function recordDownload(fileUrl: string): void {
  const normalizedUrl = normalizeUrl(fileUrl);
  const records = getDownloadRecords();
  const now = Date.now();
  
  // Buscar registro existente en la ventana de tiempo actual
  const existingIndex = records.findIndex(
    r => r.url === normalizedUrl && (now - r.timestamp) < TIME_WINDOW
  );
  
  if (existingIndex >= 0) {
    // Incrementar contador del registro existente
    records[existingIndex].count++;
    records[existingIndex].timestamp = now; // Actualizar timestamp
  } else {
    // Crear nuevo registro
    records.push({
      url: normalizedUrl,
      timestamp: now,
      count: 1
    });
  }
  
  saveDownloadRecords(records);
}

/**
 * Muestra una notificación al usuario sobre el límite de descargas
 * @param message - Mensaje a mostrar
 */
export function showDownloadLimitNotification(message: string): void {
  // Puedes personalizar esta función según tu sistema de notificaciones
  alert(message);
}

/**
 * Hook para manejar descargas con rate limiting
 * @param fileUrl - URL del archivo a descargar
 * @param fileName - Nombre opcional del archivo
 * @returns Función para ejecutar la descarga
 */
export function handleProtectedDownload(
  fileUrl: string,
  fileName?: string
): () => void {
  return () => {
    const check = canDownloadFile(fileUrl);
    
    if (!check.allowed) {
      showDownloadLimitNotification(check.reason || 'No puedes descargar este archivo en este momento');
      return;
    }
    
    // Registrar la descarga
    recordDownload(fileUrl);
    
    // Mostrar advertencia si se acerca al límite
    if (check.downloadsInWindow && check.downloadsInWindow >= MAX_DOWNLOADS_PER_WINDOW - 1) {
      console.warn('Te acercas al límite de descargas para este archivo');
    }
    
    // Realizar la descarga sin navegar a la URL pública
    void (async () => {
      try {
        const response = await fetch(fileUrl, { cache: 'no-store' });

        if (!response.ok) {
          throw new Error(`No se pudo descargar el archivo (${response.status})`);
        }

        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = objectUrl;
        link.download = fileName || '';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(objectUrl);
      } catch (error) {
        console.error('Error al descargar archivo:', error);

        // Fallback si falla la descarga directa
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName || '';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    })();
  };
}

/**
 * Limpia todos los registros de descargas
 * (útil para pruebas o mantenimiento)
 */
export function clearDownloadRecords(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('Registros de descargas limpiados');
  } catch (error) {
    console.error('Error al limpiar registros:', error);
  }
}

/**
 * Obtiene estadísticas de descargas
 */
export function getDownloadStats(): {
  totalRecords: number;
  activeDownloads: number;
  oldestRecord?: Date;
} {
  const records = getDownloadRecords();
  const now = Date.now();
  const activeDownloads = records.filter(
    r => (now - r.timestamp) < TIME_WINDOW
  ).length;
  
  const oldestTimestamp = records.length > 0 
    ? Math.min(...records.map(r => r.timestamp))
    : undefined;
  
  return {
    totalRecords: records.length,
    activeDownloads,
    oldestRecord: oldestTimestamp ? new Date(oldestTimestamp) : undefined
  };
}
