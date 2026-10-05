# Instrucciones para Habilitar la Gestión de Admisión

## ✅ Cambios Completados

1. **AdmisionManagement.tsx actualizado** - Ahora gestiona las nuevas tablas de Supabase
2. **AdmisionSection.tsx actualizado** - Carga datos desde Supabase
3. **Migraciones creadas** - Archivos SQL listos para ejecutar

## 📋 Pasos Siguientes (IMPORTANTE)

### 1. Ejecutar Migraciones en Supabase

Debes ejecutar estas 2 migraciones en tu panel de Supabase en el orden indicado:

#### Primera Migración: `20251025000001_admision.sql`
Esta migración ya debería estar ejecutada, pero si no lo está, ejecútala primero.

#### Segunda Migración: `20251105000001_admision_vacantes_info.sql`
Esta es la nueva migración que crea las tablas necesarias:
- `admision_vacantes` - Tabla de vacantes por curso
- `admision_vacantes_fecha` - Fecha de actualización de vacantes
- `admision_info_sections` - Secciones de información autogestionables

**Cómo ejecutar:**
1. Ve a tu proyecto en Supabase Dashboard
2. Navega a SQL Editor
3. Crea una nueva consulta
4. Copia y pega el contenido del archivo `supabase/migrations/20251105000001_admision_vacantes_info.sql`
5. Haz clic en "Run" o "Ejecutar"

### 2. Verificar que las Tablas se Crearon

En el SQL Editor de Supabase, ejecuta:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'admision_%';
```

Deberías ver estas tablas:
- admision_info_cards
- admision_process_steps
- admision_contact
- **admision_vacantes** (nueva)
- **admision_vacantes_fecha** (nueva)
- **admision_info_sections** (nueva)

### 3. Verificar Datos Iniciales

Ejecuta estas consultas para verificar que los datos se insertaron:

```sql
-- Ver secciones de información (deberían ser 7)
SELECT * FROM admision_info_sections ORDER BY order_index;

-- Ver vacantes (deberían ser 19 cursos)
SELECT * FROM admision_vacantes ORDER BY order_index;

-- Ver fecha de actualización
SELECT * FROM admision_vacantes_fecha;
```

### 4. Usar el Panel de Administración

Una vez ejecutadas las migraciones:

1. Ve al Panel de Administración
2. Haz clic en "Gestión de Admisión"
3. Verás 3 pestañas:

#### **Pestaña 1: Secciones de Información**
- Edita las 7 secciones predefinidas:
  - Criterios Generales de Admisión
  - Requisitos y Antecedentes
  - Vacantes Disponibles
  - Necesidades Educativas Especiales
  - Lista de Espera
  - Cronograma de Postulación
  - Costos y Proceso de Matrícula

- Para cada sección puedes editar:
  - Título
  - Contenido (usa \n para saltos de línea)
  - Icono (FileText, Users, CheckCircle, Calendar, DollarSign, Award, BookOpen)
  - Color del gradiente
  - Orden de aparición

#### **Pestaña 2: Tabla de Vacantes**
- Edita las vacantes disponibles por curso
- Añade o elimina cursos
- Actualiza el número de vacantes
- Los cambios se reflejan inmediatamente en la tabla de la sección "Vacantes Disponibles"

#### **Pestaña 3: Fecha de Actualización**
- Cambia el texto que aparece después de la tabla de vacantes
- Ejemplo: "Actualizadas al 15 de octubre"
- Actualiza esta fecha cada vez que modifiques las vacantes

## 🎨 Características Implementadas

### En AdmisionSection.tsx:
✅ Título "¿Por qué elegirnos?" con línea decorativa estética (igual que "Etapas del proceso")
✅ Carga dinámica de secciones de información desde Supabase
✅ Tabla de vacantes autogestionable
✅ Fecha de actualización editable
✅ Estado de carga con spinner
✅ Navegación de acceso rápido con íconos

### En AdmisionManagement.tsx:
✅ Interfaz completa de administración con 3 pestañas
✅ Edición de secciones de información
✅ Gestión de tabla de vacantes
✅ Actualización de fecha
✅ Validaciones y mensajes de éxito/error
✅ Diseño responsive y accesible

## 🔧 Iconos Disponibles

Para las secciones de información, puedes usar estos iconos:
- `FileText` - Documentos/Criterios
- `Users` - Personas/Grupos
- `CheckCircle` - Requisitos/Aprobación
- `Calendar` - Fechas/Cronograma
- `DollarSign` - Costos/Precios
- `Award` - Logros/Reconocimientos
- `BookOpen` - Educación/Lectura

## 🎨 Colores de Gradiente Disponibles

- `from-blue-600 to-blue-800` - Azul
- `from-green-600 to-green-800` - Verde
- `from-purple-600 to-purple-800` - Morado
- `from-red-600 to-red-800` - Rojo
- `from-orange-600 to-orange-800` - Naranja
- `from-teal-600 to-teal-800` - Verde azulado
- `from-indigo-600 to-indigo-800` - Índigo

## ⚠️ Nota Importante sobre [TABLA_VACANTES]

En la sección "Vacantes Disponibles", el contenido incluye el marcador `[TABLA_VACANTES]`. 
Este marcador le indica al sistema que debe mostrar la tabla de vacantes en ese lugar.

**NO elimines este marcador** del contenido de esa sección, o la tabla no se mostrará.

## 🐛 Solución de Problemas

### Si el panel de administración muestra "Error al cargar datos":
1. Verifica que las migraciones se ejecutaron correctamente
2. Revisa la consola del navegador para ver errores específicos
3. Verifica que las tablas existen en Supabase

### Si no aparecen datos:
1. Verifica que los INSERT de la migración se ejecutaron
2. Ejecuta las consultas de verificación mencionadas arriba
3. Revisa que RLS esté deshabilitado en las tablas (ALTER TABLE ... DISABLE ROW LEVEL SECURITY)

### Si aparece error "table does not exist":
- Las migraciones no se ejecutaron. Sigue los pasos de la sección "Ejecutar Migraciones"

## 📞 Datos de Contacto Actuales

La sección de contacto mantiene su estructura anterior con:
- Nombre
- Cargo
- Email
- Teléfono
- Dirección
- Foto

Estos datos siguen usando la tabla `admision_contact` y no fueron modificados.

---

¡Listo! Una vez ejecutadas las migraciones, el sistema completo de gestión de admisión estará funcionando. 🎉
