# Actualización de la Tabla valores_matricula

## Fecha: 19 de Enero 2026

### Cambios Realizados

Se ha modificado la estructura de la tabla `valores_matricula` para reflejar la nueva organización de costos de matrícula y colegiaturas 2026.

### Nuevos Campos

1. **matricula_hermanos**: Tabla con porcentajes y valores UF para hermanos (2º, 3º, 4º, 5º o más)
2. **otros_cargos**: Cargos detallados incluyendo:
   - Matrícula 2026 (UF 13 por hijo)
   - Seguro de vida y escolaridad hasta IV Medio
   - Seguro de vida y escolaridad hasta Educación Superior
   - Cuota Centro de Padres
   - Acciona (ex Fundación de Ayuda Mutua)
   - Cuota Centro de Alumnos
   - Aporte voluntario Asociación de Exalumnos

### Campos Eliminados

- `matricula_incorporacion` (antigua estructura)
- `colegiatura_anual` (tabla de porcentajes eliminada según requerimiento)
- `contacto` (información de contacto eliminada según requerimiento)

## Instrucciones de Ejecución

### Opción 1: A través del SQL Editor de Supabase (RECOMENDADO)

1. Accede a tu proyecto en Supabase
2. Ve a SQL Editor
3. Abre el archivo: `20260119000001_update_valores_matricula_structure.sql`
4. Copia todo el contenido
5. Pégalo en el SQL Editor
6. Ejecuta el script

### Opción 2: A través de migraciones locales

Si tienes configurado Supabase CLI:

```bash
supabase migration up
```

## Verificación

Después de ejecutar la migración, puedes verificar que todo se creó correctamente ejecutando:

```sql
SELECT * FROM valores_matricula;
```

Deberías ver una fila con los valores predeterminados.

## Componentes Actualizados

- `ValoresSection.tsx`: Componente de visualización actualizado
- `ValoresManagement.tsx`: Componente de gestión admin actualizado

## Notas Importantes

⚠️ Esta migración eliminará todos los datos existentes en la tabla `valores_matricula` anterior.

✅ Los nuevos valores predeterminados serán insertados automáticamente.

✅ Las políticas RLS están configuradas para acceso público en lectura y escritura.
