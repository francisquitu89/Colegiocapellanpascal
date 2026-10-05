# Sección de Comunidad - Documentación

## Descripción General

La sección de Comunidad permite gestionar 5 bloques diferentes de la comunidad educativa, cada uno con:
- **Carrusel de fotos** gestionado a través de Supabase Storage
- **Información del bloque** (título, descripción, botón de acción)
- **Integrantes opcionales** (miembros con foto, cargo, contacto)

## Estructura de la Base de Datos

### Tablas Creadas

1. **comunidad_bloques**
   - Almacena los 5 bloques de comunidad
   - Campos: título, descripción, texto del botón, URL del botón, mostrar integrantes, activo
   - Cada bloque tiene un número único (1-5)

2. **comunidad_fotos**
   - Almacena las fotos del carrusel para cada bloque
   - Relación: Cada foto pertenece a un bloque
   - Campos: URL de foto, nombre de archivo, caption, orden

3. **comunidad_integrantes**
   - Almacena los integrantes de cada bloque (opcional)
   - Relación: Cada integrante pertenece a un bloque
   - Campos: nombre, cargo, foto, email, teléfono, descripción, orden

### Buckets de Storage

1. **comunidad-fotos**: Para las fotos del carrusel
2. **comunidad-integrantes**: Para las fotos de los integrantes

## Componentes Creados

### 1. ComunidadSection.tsx (Vista Pública)

Muestra los 5 bloques de comunidad con:
- Carrusel de fotos automático con controles manuales
- Información del bloque
- Botón de acción (puede abrir URL externa o expandir integrantes)
- Lista de integrantes (si está habilitada)

**Características:**
- Carruseles independientes para cada bloque
- Animaciones suaves al cargar
- Diseño responsive
- Navegación entre fotos con botones y puntos indicadores

### 2. ComunidadManagement.tsx (Panel de Administración)

Panel de administración completo para gestionar:

#### Gestión de Bloques:
- Editar título, descripción
- Configurar texto y URL del botón
- Activar/desactivar bloque
- Habilitar/deshabilitar visualización de integrantes

#### Gestión de Fotos:
- Subir fotos al carrusel (máximo 5MB)
- Eliminar fotos
- Previsualización de fotos
- Formatos soportados: JPEG, PNG, WEBP, GIF

#### Gestión de Integrantes:
- Agregar/editar integrantes
- Campos: nombre, cargo, email, teléfono, descripción
- Subir foto de perfil para cada integrante
- Eliminar integrantes

## Uso

### Para Usuarios (Vista Pública)

1. Acceder desde el menú superior: **Comunidad**
2. Navegar por los 5 bloques
3. Ver el carrusel de fotos de cada bloque
4. Hacer clic en el botón de acción para:
   - Abrir enlace externo (si está configurado)
   - Ver lista de integrantes (si está habilitada)

### Para Administradores

1. Iniciar sesión en el panel de administración
2. Seleccionar **Gestión de Comunidad**
3. Expandir el bloque que desea editar
4. Configurar:
   - **Información del bloque**: Título, descripción, botón
   - **Fotos**: Subir/eliminar fotos del carrusel
   - **Integrantes**: Agregar/editar miembros (si está habilitado)

## Migración de Base de Datos

El archivo de migración se encuentra en:
```
supabase/migrations/20260115000001_comunidad.sql
```

### Ejecutar la migración:

```bash
# Conectarse a Supabase y ejecutar el archivo SQL
# O usar el dashboard de Supabase en la sección SQL Editor
```

La migración incluye:
- Creación de las 3 tablas
- Configuración de índices para optimización
- Creación de buckets de storage
- Configuración de políticas de seguridad (RLS)
- Inserción de 5 bloques iniciales con datos de ejemplo

## Bloques Iniciales (Personalizables)

1. **Centro de Padres** - Organización que representa a los apoderados
2. **Pastoral Familiar** - Acompañamiento espiritual para las familias
3. **Voluntariado** - Iniciativas de servicio y compromiso social
4. **Ex Alumnos** - Red de egresados del colegio
5. **Grupos Comunitarios** - Espacios de encuentro y formación

## Navegación

### Rutas Creadas:

- **Vista pública**: `/comunidad` (o `currentPage === 'comunidad'`)
- **Administración**: `/comunidad-management` (o `currentPage === 'comunidad-management'`)

### Integración en la Navegación:

- Botón en la barra superior (Quick Links)
- Opción en el Panel de Administración

## Características Técnicas

### Carrusel de Fotos:
- Transición automática cada 5 segundos
- Controles manuales (anterior/siguiente)
- Indicadores de posición (puntos)
- Responsive y optimizado

### Seguridad:
- Row Level Security (RLS) habilitado
- Lectura pública, escritura solo para autenticados
- Límite de tamaño de archivo: 5MB
- Tipos MIME permitidos: image/jpeg, image/jpg, image/png, image/webp, image/gif

### Performance:
- Índices en campos clave
- Carga optimizada con relaciones
- Imágenes servidas desde Supabase CDN

## Personalización

### Modificar los Bloques Iniciales:

Editar directamente desde el panel de administración o modificar la migración SQL:

```sql
INSERT INTO comunidad_bloques (bloque_numero, titulo, descripcion, boton_texto, order_index) VALUES
  (1, 'Tu Título', 'Tu descripción', 'Texto del botón', 1);
```

### Cambiar Número de Bloques:

El diseño está optimizado para 5 bloques, pero puede modificarse:
1. Ajustar la constraint en la tabla `comunidad_bloques`
2. Agregar/quitar bloques en la migración
3. Actualizar la interfaz si es necesario

## Soporte y Mantenimiento

- Los componentes siguen el patrón del resto de la aplicación
- Código modular y bien documentado
- TypeScript para type safety
- Manejo de errores y estados de carga

## Archivos Creados

1. `src/components/ComunidadSection.tsx` - Vista pública
2. `src/components/ComunidadManagement.tsx` - Panel de administración
3. `supabase/migrations/20260115000001_comunidad.sql` - Migración de BD
4. Actualizaciones en `App.tsx`, `AdminDashboard.tsx`, `Navbar.tsx`, `supabase.ts`
