# ACTUALIZACIÓN: Consolidación de Supabase - Mayo 2026

## Resumen
Se ha actualizado toda la aplicación para asegurar que **todos los datos se almacenan en una única instancia de Supabase**: **https://ntncdusmihemyaqrzajm.supabase.co**

## Problema Identificado
La aplicación tenía múltiples clientes de Supabase:
1. `supabase` - Usaba variables de entorno que podían apuntar a otra instancia
2. `driveRoutesSupabase` - Apuntaba a https://ntncdusmihemyaqrzajm.supabase.co

**Riesgo**: Los datos se dividían entre múltiples servidores, causando:
- Inconsistencia de datos
- Duplicación de registros
- Dificultad en mantenimiento
- Posibles conflictos de sincronización

## Cambios Realizados

### 1. Actualización de `src/lib/supabase.ts`
**Cambio principal**: 
- Se agregó validación para asegurar que ambos clientes usen la URL principal
- Si `VITE_SUPABASE_URL` es diferente, se muestra un warning pero se usa la principal para escritura
- Si `VITE_SUPABASE_URL` no está configurado, ambos clientes apuntan a la misma URL

**Lógica nueva**:
```typescript
// Cliente principal - SIEMPRE https://ntncdusmihemyaqrzajm.supabase.co
export const driveRoutesSupabase = createClient(...)

// Cliente secundario - Solo para fallback si está configurado diferente
export const supabase = (diferente) ? createClient(...) : driveRoutesSupabase
```

### 2. Actualización de Componentes (Operaciones de Escritura)
Todos los componentes que **escriben datos** ahora usan **`driveRoutesSupabase`** exclusivamente:

| Archivo | Cambios |
|---------|---------|
| InstitutionalDocumentsManagement.tsx | INSERT, UPDATE, DELETE → driveRoutesSupabase |
| NewsManagement.tsx | DELETE → driveRoutesSupabase |
| NewsEditor.tsx | INSERT, UPDATE → driveRoutesSupabase (ya lo hacía) |
| CEALManagement.tsx | INSERT, UPDATE, DELETE → driveRoutesSupabase |
| CasinoManagement.tsx | SELECT, INSERT, DELETE → driveRoutesSupabase |
| PastoralManagement.tsx | SELECT, INSERT, UPDATE, DELETE → driveRoutesSupabase |
| ComunidadManagement.tsx | INSERT, DELETE → driveRoutesSupabase |
| ProyectoEducativoManagement.tsx | SELECT, INSERT, UPDATE, DELETE → driveRoutesSupabase |
| planLector.ts | SELECT, INSERT, UPDATE, DELETE → driveRoutesSupabase |
| newsImagesStorage.ts | DELETE (storage) → driveRoutesSupabase |

### 3. Estrategia de Lectura (Sin Cambios)
Los componentes que **leen datos** siguen integrando de múltiples fuentes:
- Intenta primero `driveRoutesSupabase`
- Intenta luego `supabase` (fallback)
- Combina y deduplica resultados

Esto permite:
- Migración gradual si hay un Supabase secundario
- Respaldo/redundancia en lectura
- Evita pérdida de datos durante transición

### 4. Deduplicación Automática
En `InstitutionalDocumentsManagement.tsx` se agregó:
```typescript
const documentsClients = [driveRoutesSupabase, supabase].filter(
  (client, index, arr) => index === 0 || client !== arr[0]
)
```

Evita duplicación cuando ambos clientes apuntan al mismo servidor.

### 5. Archivo `.env.example`
Se creó `.env.example` documentando:
- URL principal requerida
- Variables opcionales de fallback
- Notas sobre el comportamiento

## Verificación

### Acciones Recomendadas:
1. **Verificar variables de entorno**:
   ```bash
   VITE_DRIVE_ROUTES_SUPABASE_URL=https://ntncdusmihemyaqrzajm.supabase.co
   VITE_DRIVE_ROUTES_SUPABASE_PUBLISHABLE_KEY=sb_publishable_kh_0x5npworQbEFVlyK3Xw_2kidvRNM
   ```

2. **Revisar la consola** después de iniciar la app:
   - Si ves `Primary Supabase URL: https://ntncdusmihemyaqrzajm.supabase.co` ✅
   - Si ves `WARNING: Secondary Supabase configured` ⚠️ (fallback activado, pero principal es primario)

3. **Realizar pruebas**:
   - Crear un registro nuevo (ej: una noticia)
   - Verificar que aparezca en https://ntncdusmihemyaqrzajm.supabase.co
   - No debe aparecer en ningún otro servidor

## Beneficios
✅ **Centralización**: Un único servidor de verdad  
✅ **Consistencia**: Sin datos divididos  
✅ **Mantenimiento**: Más simple y claro  
✅ **Rendimiento**: Sin conflictos de sincronización  
✅ **Migración**: Soporta fallback durante transiciones  
✅ **Escalabilidad**: Preparado para crecimiento futuro  

## Próximos Pasos (Recomendados)
1. Ejecutar las migraciones SQL en https://ntncdusmihemyaqrzajm.supabase.co
2. Migrar datos históricos si existen en otro servidor
3. Eliminar referencias a servidor secundario (si existía)
4. Revisar logs de la aplicación para warnings
5. Realizar pruebas completas en staging

---
**Actualización realizada**: Mayo 10, 2026
**Status**: Completado ✅
