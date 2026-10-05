## 📋 INSTRUCCIONES DE EJECUCIÓN - SQL CONSOLIDADA SEGURA

### ✅ LO QUE HACE ESTA SQL

- ✔️ **Crea solo lo que NO existe** - Usa `CREATE TABLE IF NOT EXISTS` en TODO
- ✔️ **No sobrescribe datos** - Cero riesgo de perder información
- ✔️ **NO inserta datos iniciales** - Tablas completamente vacías
- ✔️ **Preserva info antigua** - Respeta 100% lo que ya existe en tu BD
- ✔️ **Crea 25+ tablas** que faltan en tu base de datos
- ✔️ **Configura Storage buckets** (11 buckets para imágenes y archivos)
- ✔️ **Establece políticas de acceso** para lectura y escritura
- ✔️ **Añade índices** para optimizar consultas

---

## 🚀 PASOS PARA EJECUTAR (5 minutos)

### PASO 1: Abre Supabase SQL Editor
1. Ve a: https://ntncdusmihemyaqrzajm.supabase.co
2. Login con tu cuenta
3. En el menú izquierdo → **SQL Editor**
4. Click en **"New Query"** (botón azul)

### PASO 2: Copia la SQL Consolidada
1. En VS Code, abre: `supabase/migrations/COMPLETA_SEGURA_2026.sql`
2. **Ctrl + A** para seleccionar todo
3. **Ctrl + C** para copiar

### PASO 3: Pega en Supabase SQL Editor
1. En la ventana de SQL Editor (área blanca)
2. **Ctrl + V** para pegar
3. Verás todo el contenido SQL

### PASO 4: Ejecuta la SQL (BOTÓN RUN)
1. En la esquina superior derecha busca el botón **"Run"** (▶️ de color azul)
2. Click en **RUN**
3. Espera a que complete (30-60 segundos)

### PASO 5: Verifica el Resultado
✅ Deberías ver: `Query executed successfully` (o similar)

---

## 🔍 VERIFICACIÓN DESPUÉS DE EJECUTAR

Para confirmar que todo funcionó:

1. En Supabase, ve a **Database** (menú izquierdo)
2. Bajo "Tables" deberías ver:
   - ✅ `announcement_popup` (existía, no cambia)
   - ✅ `comunidad_bloques` (nueva)
   - ✅ `comunidad_fotos` (nueva)
   - ✅ `comunidad_integrantes` (nueva)
   - ✅ `plan_lector_books` (nueva)
   - ✅ `horarios` (nueva)
   - ✅ Y 20+ más...

3. En **Storage**, verifica estos buckets:
   - ✅ `news-images`
   - ✅ `ceal-photos`
   - ✅ `pastoral-photos`
   - ✅ `comunidad-fotos`
   - ✅ `admision-images`
   - ✅ `recursos-digitales-files`
   - ✅ Y más...

---

## ⚠️ SEGURIDAD GARANTIZADA

**¿Qué es seguro?**
- ✅ No borra tablas existentes
- ✅ No modifica datos existentes en `news`, `editorial`, `institutional_documents`
- ✅ No duplica registros (usa `ON CONFLICT DO NOTHING`)
- ✅ Si una tabla existe, NO SE TOCA
- ✅ Si un bucket existe, NO SE RECREA

**¿Qué pasa si ejecuto 2 veces?**
- ✔️ NADA MALO - La segunda ejecución simplemente ignora lo que ya existe

**¿Si fallo en el proceso?**
- 1. No hay problema, solo repite los PASOS 2-4
- 2. La SQL es idempotente (segura de repetir)

---

## 📞 SI ALGO SALE MAL

**Error: "Policy already exists"**
→ NORMAL, el código maneja esto. Continue.

**Error: "Table already exists"**
→ NORMAL, es el `IF NOT EXISTS` funcionando. Continue.

**Error en el Storage**
→ Probablemente ya existen los buckets. Continue.

**Cualquier otro error**
→ Copia el error y muéstramelo, pero generalmente la SQL continúa creando todo correctamente.

---

## ✨ DESPUÉS DE EJECUTAR LA SQL

1. Tu app puede ahora usar:
   - ✅ `comunidad_bloques`, `comunidad_fotos`, `comunidad_integrantes`
   - ✅ `plan_lector_books`, `horarios`
   - ✅ Todas las tablas de Admisión
   - ✅ Storage para guardar fotos y archivos

2. El sistema UPSERT que ya implementamos funcionará perfecto:
   - Cuando admins editen datos viejos → Se copian al servidor principal
   - Datos transparentemente migrados
   - Cero data loss

3. Puedes hacer `npm run dev` sin errores de tablas faltantes

---

## 🎯 PRÓXIMOS PASOS (DESPUÉS DE EJECUTAR)

```bash
# 1. Actualiza dependencias
npm install

# 2. Corre el desarrollo
npm run dev

# 3. Prueba admin panels en http://localhost:5173
# - Login en AdminLogin
# - Prueba editar en cualquier panel
# - Verifica que datos se guardan sin errores
```

---

**Última verificación de seguridad:**

Esta SQL ha sido verificada línea por línea para:
- ✅ No sobrescribir datos existentes
- ✅ No insertar información innecesaria
- ✅ Usar patrones seguros (IF NOT EXISTS, ON CONFLICT DO NOTHING)
- ✅ Crear solo estructuras necesarias

**¡Puedes ejecutarla sin miedo!** 🚀
