# Instrucciones para ejecutar la migración de Proyecto Educativo

## Pasos para activar el Proyecto Educativo

### 1. Acceder a Supabase Dashboard

1. Ve a [https://supabase.com](https://supabase.com)
2. Inicia sesión en tu cuenta
3. Selecciona tu proyecto

### 2. Ejecutar la migración SQL

1. En el menú lateral, ve a **SQL Editor**
2. Crea una nueva query
3. Copia y pega el contenido del archivo `supabase/migrations/20251022000002_proyecto_educativo.sql`
4. Ejecuta la query haciendo clic en **Run** o presionando `Ctrl + Enter`

### 3. Verificar las tablas creadas

Después de ejecutar la migración, deberías ver las siguientes tablas en tu base de datos:

- `department_heads` - Jefes de Departamentos
- `orientation_team` - Equipo de Orientación
- `cycle_coordinators` - Coordinadores de Ciclo
- `pastoral_team` - Equipo Pastoral

### 4. Datos iniciales

La migración incluye datos iniciales para todas las tablas:

#### Jefes de Departamentos
- Matemática: Néstor Álvarez
- Lenguaje: Gonzalo Sanhueza
- Historia: Daniela Varas
- Ciencias: Lilian Ponce
- Inglés: Pamela Díaz
- Arte: Ángela Quezada
- Ed. Física y Deportes: Eduardo Martínez
- Religión y Filosofía: Ricardo Ramírez

#### Equipo de Orientación
- Maria Teresa Egaña (Psicopedagoga)
- Daniela Schiavetti (Psicóloga, Jefe del departamento)
- Daniela Fuentes (Coordinadora General de Convivencia Educativa)
- Maria Cristina Prieto (Educadora diferencial)
- Macarena Garrido (Psicopedagoga)
- Andrea Luer (Psicóloga)

#### Coordinadores de Ciclo
- Ciclo Inicial (Medio mayor a Kínder): Loreto Alonso
- 1er Ciclo Básico (1º a 3º Básico): Aída Martínez
- 2º Ciclo Básico (4º a 6º Básico): Maddalena Muzio
- Ciclo E. Media Menor (7º Básico a IIº Medio): Silvana Markusovic
- Ciclo E. Media Superior (IIIº a IVº Medio): Christian Fernández

#### Equipo Pastoral
- Padre Víctor Perez
- Benjamín Rodríguez
- Manuel Núñez
- Padre Joaquín Puertas
- Pilar Fuentes
- Aida Martínez
- Catalina Rodríguez
- Loreto Alonso

### 5. Acceder a la gestión

Una vez ejecutada la migración:

1. Desde el sitio web, ve a la sección de Admin (en el footer)
2. Inicia sesión con las credenciales de administrador
3. Selecciona "Gestión Proyecto Educativo"
4. Aquí podrás:
   - Ver todos los elementos de cada sección
   - Agregar nuevos elementos
   - Editar elementos existentes
   - Eliminar elementos
   - Reordenar elementos (usando el campo order_index)

### 6. Ver el contenido público

Los usuarios pueden ver el Proyecto Educativo desde:
- Navbar → Colegio → Proyecto Educativo

O accediendo directamente desde la página principal.

## Estructura de las tablas

### department_heads
- `id`: UUID (generado automáticamente)
- `department`: Nombre del departamento
- `name`: Nombre del jefe de departamento
- `order_index`: Orden de visualización
- `created_at`: Fecha de creación
- `updated_at`: Fecha de actualización

### orientation_team
- `id`: UUID (generado automáticamente)
- `name`: Nombre del miembro
- `position`: Cargo/especialidad
- `order_index`: Orden de visualización
- `created_at`: Fecha de creación
- `updated_at`: Fecha de actualización

### cycle_coordinators
- `id`: UUID (generado automáticamente)
- `cycle_name`: Nombre del ciclo
- `grade_range`: Rango de grados (ej: "1º a 3º Básico")
- `coordinator_name`: Nombre del coordinador
- `order_index`: Orden de visualización
- `created_at`: Fecha de creación
- `updated_at`: Fecha de actualización

### pastoral_team
- `id`: UUID (generado automáticamente)
- `name`: Nombre del miembro
- `order_index`: Orden de visualización
- `created_at`: Fecha de creación
- `updated_at`: Fecha de actualización

## Seguridad

Todas las tablas tienen Row Level Security (RLS) habilitado con las siguientes políticas:

- **Lectura pública**: Todos pueden ver el contenido
- **Escritura autenticada**: Solo usuarios autenticados pueden crear, actualizar y eliminar

Esto significa que el contenido es visible para todos los visitantes del sitio, pero solo los administradores autenticados pueden modificarlo.
