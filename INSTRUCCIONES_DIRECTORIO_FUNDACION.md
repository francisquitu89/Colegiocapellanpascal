# Instrucciones: Gestión de Perfiles - Directorio Fundación

## Descripción General

El módulo de Directorio Fundación ahora incluye una sección de **perfiles individuales** donde puedes mostrar información detallada de cada miembro del equipo con:
- ✅ Foto de perfil
- ✅ Nombre completo
- ✅ Cargo/Posición
- ✅ Curriculum vitae completo

## Configuración Inicial en Supabase

### 1. Ejecutar Migración

Debes ejecutar la migración SQL en tu base de datos de Supabase:

```bash
Archivo: supabase/migrations/20260106000002_equipo_fundacion.sql
```

**Opciones para ejecutar:**

**Opción A - Desde el Dashboard de Supabase:**
1. Ve a tu proyecto en Supabase
2. Navega a **SQL Editor**
3. Copia y pega el contenido del archivo `20260106000002_equipo_fundacion.sql`
4. Haz clic en **Run**

**Opción B - Desde CLI de Supabase:**
```bash
supabase db push
```

### 2. Verificar Bucket de Storage

La migración crea automáticamente:
- ✅ Tabla `equipo_fundacion` con sus políticas RLS
- ✅ Bucket `equipo-fundacion` en Storage (público para lectura)
- ✅ Políticas de acceso configuradas

Para verificar:
1. Ve a **Storage** en Supabase Dashboard
2. Confirma que existe el bucket `equipo-fundacion`

## Uso del Panel de Administración

### Acceder a la Gestión

1. Inicia sesión en el panel administrativo
2. Busca la sección **"Directorio Fundación"**
3. Verás dos secciones principales:

### Sección 1: Foto y Descripción Principal
Esta sección ya existía y permite:
- Subir foto grupal del directorio
- Agregar texto descriptivo
- Listar nombres (izquierda a derecha)

### Sección 2: Miembros del Equipo ⭐ NUEVO

#### Añadir un Nuevo Miembro

1. Haz clic en el botón **"Añadir Miembro"** (botón rojo con ícono +)
2. Completa el formulario:
   - **Nombre*** (obligatorio): Nombre completo de la persona
   - **Cargo**: Título o posición (ej: Director, Coordinador, Secretario)
   - **Foto de perfil**: Haz clic en "Elegir archivo" y selecciona una imagen
     - Formatos recomendados: JPG, PNG
     - Tamaño sugerido: 800x800px (proporción cuadrada)
     - La foto se subirá automáticamente a Supabase
   - **Curriculum**: Información académica y profesional
     - Formación académica
     - Experiencia profesional
     - Logros destacados
     - Cualquier información relevante
3. Haz clic en **"Guardar"**

#### Editar un Miembro Existente

1. Busca el miembro en la lista
2. Haz clic en el botón amarillo con ícono de lápiz (Editar)
3. Modifica los campos necesarios
4. Haz clic en **"Guardar"** para confirmar cambios
5. O **"Cancelar"** para descartar cambios

#### Cambiar el Orden de los Miembros

Los miembros se muestran en el sitio web según su orden. Para reorganizar:

1. Usa las flechas azules **↑ Arriba** / **↓ Abajo**
2. Los botones se deshabilitarán si el miembro está en la primera o última posición

#### Eliminar un Miembro

1. Haz clic en el botón rojo con ícono de basura
2. Confirma la eliminación en el diálogo que aparece
3. El miembro será eliminado permanentemente

⚠️ **Nota**: La foto NO se elimina automáticamente del storage para evitar eliminar imágenes que puedan estar en uso.

## Visualización en el Sitio Web

### Cómo se muestra

Los perfiles aparecen en la sección **"Directorio Fundación"** del sitio web:

1. **Parte superior**: Foto grupal, descripción y nombres (sección anterior)
2. **Parte inferior**: **"Nuestro Equipo"** (nueva sección)
   - Grid responsivo: 
     - 1 columna en móvil
     - 2 columnas en tablet
     - 3 columnas en desktop
   - Cada tarjeta muestra:
     - Foto de perfil (o avatar por defecto si no hay foto)
     - Nombre completo
     - Cargo en rojo
     - Curriculum completo con scroll si es muy largo

### Diseño de las Tarjetas

- Estilo moderno con sombras suaves
- Hover effect (sombra más pronunciada al pasar el mouse)
- Bordes redondeados
- Foto ocupa la parte superior (altura fija de 256px)
- Información textual en la parte inferior con padding

## Estructura de Datos

### Tabla: `equipo_fundacion`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Identificador único (generado automáticamente) |
| `nombre` | TEXT | Nombre completo (obligatorio) |
| `cargo` | TEXT | Cargo o posición (opcional) |
| `curriculum` | TEXT | CV completo (opcional) |
| `foto_url` | TEXT | URL pública de la foto en Supabase Storage |
| `orden` | INTEGER | Orden de visualización (se genera automáticamente) |
| `created_at` | TIMESTAMPTZ | Fecha de creación |
| `updated_at` | TIMESTAMPTZ | Fecha de última actualización |

### Storage: Bucket `equipo-fundacion`

- **Público**: Sí (las fotos son accesibles públicamente)
- **Estructura**: Las fotos se guardan con nombres únicos basados en timestamp
- **Políticas RLS**: 
  - Lectura pública
  - Solo usuarios autenticados pueden subir/editar/eliminar

## Buenas Prácticas

### Fotos de Perfil
- ✅ Usar fotos profesionales o semi-profesionales
- ✅ Fondo neutro o institucional
- ✅ Buena iluminación
- ✅ Rostro claramente visible
- ✅ Formato cuadrado (1:1)
- ❌ Evitar fotos borrosas o de baja calidad
- ❌ Evitar fotos muy informales

### Curriculum
- Sé conciso pero informativo
- Usa viñetas o párrafos cortos para facilitar la lectura
- Incluye solo información relevante
- Mantén un tono profesional
- Revisa ortografía y gramática

### Orden de Presentación
- Considera ordenar por jerarquía (más importante arriba)
- O en orden alfabético
- Mantén consistencia en el criterio elegido

## Solución de Problemas

### La foto no se muestra
1. Verifica que el archivo se haya subido correctamente
2. Revisa en Storage → equipo-fundacion si el archivo existe
3. Comprueba que la URL pública esté correcta
4. Intenta subir la imagen nuevamente

### Error al guardar
1. Verifica que el nombre no esté vacío
2. Comprueba tu conexión a internet
3. Revisa la consola del navegador para errores específicos
4. Verifica permisos en Supabase

### Los miembros no aparecen en el sitio web
1. Verifica que hayas guardado correctamente en el panel admin
2. Refresca el sitio web (Ctrl + F5 para limpiar cache)
3. Verifica en Supabase que los registros existan en la tabla
4. Revisa políticas RLS en la tabla

## Seguridad

- ✅ Políticas RLS activadas en la tabla
- ✅ Solo usuarios autenticados pueden modificar datos
- ✅ Lectura pública habilitada (necesaria para mostrar en web)
- ✅ Storage público para las imágenes
- ✅ Los datos están protegidos contra modificación no autorizada

## Mantenimiento

### Limpieza de Imágenes Huérfanas
Si eliminas muchos miembros, considera limpiar el storage periódicamente:

1. Ve a Storage → equipo-fundacion en Supabase
2. Identifica fotos que ya no están en uso
3. Elimínalas manualmente para liberar espacio

### Respaldo
Considera hacer respaldos periódicos:
- Exporta la tabla `equipo_fundacion` desde Supabase
- Descarga las fotos importantes del bucket

---

**¿Necesitas ayuda?** Revisa los logs del navegador (F12 → Console) para mensajes de error detallados.
