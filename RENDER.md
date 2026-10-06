# Despliegue en Render

El archivo `render.yaml` configura el sitio como un Static Site de Render, compila Vite y redirige las rutas de la aplicación a `index.html` para que funcionen las páginas internas.

## Crear el sitio

1. En Render, crea un **Blueprint** y conecta el repositorio `francisquitu89/Colegiocapellanpascal` en la rama `main`.
2. Render detectará `render.yaml` en la raíz y creará el sitio estático.
3. Cuando lo solicite, configura `VITE_DRIVE_ROUTES_SUPABASE_URL` con la URL del proyecto Supabase y `VITE_DRIVE_ROUTES_SUPABASE_PUBLISHABLE_KEY` con su clave publicable.
4. Inicia el despliegue. Los cambios posteriores en `main` se desplegarán automáticamente.

Las variables `VITE_*` se incorporan al JavaScript público del sitio. Usa únicamente claves publicables de Supabase; nunca uses una clave `service_role` en el frontend.

## Importante sobre el acceso de administración

El acceso actual del panel se valida en el cliente. No lo consideres una protección de datos: tanto la lógica como la contraseña pueden ser inspeccionadas desde el navegador. Antes de publicar contenido privado o permitir acciones sensibles, reemplázalo por autenticación y autorización del lado del servidor o por Supabase Auth con políticas RLS.
