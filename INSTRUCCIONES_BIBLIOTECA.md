# Instrucciones para Configurar la Sección de Biblioteca

## ✅ Componentes Creados

1. **BibliotecaSection.tsx** - Página pública de biblioteca
2. **BibliotecaManagement.tsx** - Panel de administración
3. **Migración SQL** - `20251105000002_biblioteca.sql`

## 📋 Pasos para Activar la Sección

### 1. Ejecutar Migración en Supabase

Ve a tu proyecto en Supabase Dashboard y ejecuta la migración:

1. Navega a **SQL Editor**
2. Crea una **Nueva consulta**
3. Copia y pega el contenido de `supabase/migrations/20251105000002_biblioteca.sql`
4. Haz clic en **Run** o **Ejecutar**

Esta migración creará:
- ✅ Tabla `planes_lectores` (para almacenar PDFs del plan lector)
- ✅ Bucket de almacenamiento `biblioteca-files` (para PDFs)
- ✅ Políticas de acceso para subir y descargar archivos
- ✅ Trigger para actualizar timestamps automáticamente

### 2. Verificar Tabla Creada

Ejecuta en SQL Editor:
```sql
SELECT * FROM planes_lectores;
```

Deberías ver un registro de ejemplo o una tabla vacía.

### 3. Verificar Bucket de Storage

1. Ve a **Storage** en el panel de Supabase
2. Deberías ver el bucket `biblioteca-files`
3. Las políticas deberían permitir:
   - Lectura pública de archivos
   - Subida solo para usuarios autenticados

## 🎨 Características de la Sección Biblioteca

### Sección Pública (BibliotecaSection.tsx)

La página de Biblioteca tiene **3 secciones principales**:

#### 1. **Descripción de la Biblioteca**
- Texto completo sobre la misión de la biblioteca
- Descripción de programas para Ciclo Inicial y Primer Ciclo
- Importancia del cuidado de libros y lectura social

**Normas de Préstamo:**
- Los libros se prestan por una semana
- Renovación hasta 3 veces
- Usuarios: alumnos, profesores y familias
- Libros rotos deben ser reemplazados

**Firma:** Carolina Birke Vidal - Bibliotecóloga

#### 2. **Acceso a Recursos**
Dos tarjetas interactivas con enlaces externos:

**🔍 Buscador de Libros**
- Enlace: https://colegiosagradafamilia.colegium.com/mt
- Para consultar biblioteca física
- Icono de búsqueda y efecto hover

**🌐 Recursos Digitales**
- Enlace: https://sites.google.com/csfr.cl/biblioteca-csfr/p%C3%A1gina-principal
- Biblioteca digital del colegio
- Icono de globo y efecto hover

#### 3. **Planes Lectores**
- Lista de planes lectores disponibles para descargar
- Muestra título, año y botón de descarga
- Archivos PDF autogestionables desde el panel admin
- Si no hay planes, muestra mensaje informativo

### Panel de Administración (BibliotecaManagement.tsx)

Accesible desde **Panel de Administración → Gestión de Biblioteca**

**Funcionalidades:**
- ✅ **Crear** nuevos planes lectores
- ✅ **Editar** planes existentes
- ✅ **Eliminar** planes lectores
- ✅ **Subir PDFs** directamente a Supabase Storage
- ✅ Validación de archivos (solo PDF)
- ✅ Vista previa de archivos cargados

**Campos del Formulario:**
- **Título**: Nombre del plan lector (ej: "Plan Lector 2025")
- **Año**: Año académico (ej: "2025")
- **Archivo PDF**: Subir PDF desde el computador

## 🎯 Cómo Usar el Panel de Administración

### Agregar un Nuevo Plan Lector

1. Ve a **Panel de Administración**
2. Clic en **Gestión de Biblioteca**
3. Clic en botón **"Nuevo Plan Lector"**
4. Completa el formulario:
   - Título: "Plan Lector 2025"
   - Año: "2025"
   - Haz clic en el área de "Subir PDF"
   - Selecciona el archivo PDF
   - Espera a que se suba (verás "Archivo cargado correctamente")
5. Clic en **"Guardar Plan Lector"**

### Editar un Plan Existente

1. En la lista de planes lectores
2. Clic en el icono de **editar** (documento)
3. Modifica los campos necesarios
4. Para cambiar el PDF, sube un nuevo archivo
5. Clic en **"Guardar Plan Lector"**

### Eliminar un Plan Lector

1. En la lista de planes lectores
2. Clic en el icono de **papelera** (rojo)
3. Confirma la eliminación

## 🔧 Acceso desde el Menú Principal

La sección de Biblioteca está disponible en:

**Navbar → INFORMACIÓN → BIBLIOTECA**

Al hacer clic, se carga la página completa de biblioteca con:
- Descripción y normas
- Enlaces a recursos externos
- Lista de planes lectores descargables

## 📱 Diseño Responsive

La sección está completamente optimizada para:
- ✅ Desktop (vista completa en grid)
- ✅ Tablet (grid de 2 columnas)
- ✅ Móvil (vista vertical apilada)

## 🎨 Paleta de Colores

La sección usa tonos cálidos que representan la biblioteca:
- **Primario**: Amber/Naranja (`from-amber-600 to-orange-600`)
- **Acento**: Azul para buscador (`from-blue-600 to-blue-800`)
- **Acento**: Púrpura para recursos digitales (`from-purple-600 to-purple-800`)
- **Fondo**: Gradiente suave (`from-amber-50 via-orange-50 to-red-50`)

## ⚠️ Notas Importantes

### URLs Externas
Los enlaces a:
- Buscador de libros Colegium
- Biblioteca digital Google Sites

Están **hardcodeados** en el componente. Si necesitas cambiarlos:
1. Edita `BibliotecaSection.tsx`
2. Busca las URLs en las secciones de enlaces
3. Reemplázalas por las nuevas

### Archivos PDF
- Los PDFs se almacenan en Supabase Storage
- El bucket `biblioteca-files` es público para lectura
- Solo usuarios autenticados pueden subir/eliminar archivos
- Los archivos se organizan en la carpeta `planes-lectores/`

### Límite de Tamaño
Por defecto, Supabase tiene un límite de 50MB por archivo.
Si necesitas subir archivos más grandes, ajusta la configuración en Supabase Dashboard.

## 🐛 Solución de Problemas

### Error: "tabla no existe"
- Ejecuta la migración `20251105000002_biblioteca.sql`

### Error: "bucket no existe"
- Verifica que el bucket `biblioteca-files` esté creado en Storage
- Ejecuta manualmente el INSERT del bucket si es necesario

### No puedo subir archivos
- Verifica que estés autenticado como admin
- Revisa las políticas de storage en Supabase
- Confirma que el bucket sea público

### Los PDFs no se descargan
- Verifica que las URLs sean públicas
- Revisa la política de SELECT en storage.objects
- Confirma que el archivo existe en el bucket

## 📊 Estructura de la Base de Datos

### Tabla: planes_lectores

| Campo       | Tipo        | Descripción                      |
|-------------|-------------|----------------------------------|
| id          | BIGSERIAL   | ID único (auto-incremento)       |
| title       | TEXT        | Título del plan lector           |
| file_url    | TEXT        | URL pública del PDF en Storage   |
| year        | TEXT        | Año académico                    |
| created_at  | TIMESTAMPTZ | Fecha de creación                |
| updated_at  | TIMESTAMPTZ | Fecha de última actualización    |

## ✨ Mejoras Futuras Sugeridas

- [ ] Agregar categorías a los planes lectores (Pre-escolar, Básica, Media)
- [ ] Permitir múltiples archivos por plan (por curso)
- [ ] Agregar descripciones más detalladas
- [ ] Integrar estadísticas de descargas
- [ ] Agregar buscador de planes por año o título

---

## 🎉 ¡Listo!

Una vez ejecutada la migración, la sección de Biblioteca estará completamente funcional y lista para usar.

Los administradores podrán subir y gestionar planes lectores, y los visitantes podrán acceder a toda la información y descargar los archivos.
