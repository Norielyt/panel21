# 🎯 Guía Súper Simple - Paso a Paso

## ⚡ Opción 1: Usar Neon (La Más Fácil)

### Paso 1: Crear cuenta en Neon
1. Ve a https://neon.tech
2. Crea cuenta gratis (con GitHub es más rápido)
3. Haz clic en **"Create Project"**
4. Elige un nombre (ej: "video-player")
5. Haz clic en **"Create Project"**

### Paso 2: Copiar la URL de conexión
1. En Neon, verás una pantalla con tu proyecto
2. Busca donde dice **"Connection string"** o **"Postgres connection string"**
3. Haz clic en el botón de **copiar** 📋
4. Se verá algo como: `postgres://usuario:password@ep-xxx.region.neon.tech/dbname`

### Paso 3: Configurar en Vercel
1. Ve a tu proyecto en Vercel
2. Ve a **Settings** → **Environment Variables**
3. Haz clic en **"Add New"**
4. Pon:
   - **Name**: `POSTGRES_URL`
   - **Value**: Pega la URL que copiaste de Neon
   - **Environment**: Marca todas (Production, Preview, Development)
5. Haz clic en **"Save"**

### Paso 4: Desplegar
1. Ve a la pestaña **"Deployments"**
2. Haz clic en los 3 puntos del último despliegue → **"Redeploy"**
3. Espera 2 minutos

### Paso 5: Inicializar
1. Ve a: `https://tu-dominio.vercel.app/setup`
2. Debería decir "✅ Base de datos configurada"
3. ¡Listo! 🎉

---

## ⚡ Opción 2: Usar Supabase (También Fácil)

### Paso 1: Crear cuenta en Supabase
1. Ve a https://supabase.com
2. Crea cuenta gratis (con GitHub es más rápido)
3. Haz clic en **"New Project"**
4. Elige un nombre (ej: "video-player")
5. Pon una contraseña (guárdala bien)
6. Elige una región cercana
7. Haz clic en **"Create new project"**
8. Espera 2 minutos a que se cree

### Paso 2: Crear las tablas
1. En Supabase, ve a **"SQL Editor"** (menú lateral izquierdo)
2. Haz clic en **"New query"**
3. Copia y pega esto:

```sql
CREATE TABLE IF NOT EXISTS videos (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

4. Haz clic en **"Run"** (o presiona Ctrl+Enter)
5. Debería decir "Success"

### Paso 3: Copiar la URL de conexión
1. Ve a **"Settings"** → **"Database"**
2. Busca **"Connection string"** → **"URI"**
3. Haz clic en **copiar** 📋
4. Se verá algo como: `postgres://postgres.xxx:password@aws-0-region.pooler.supabase.com:6543/postgres`

### Paso 4: Configurar en Vercel
1. Ve a tu proyecto en Vercel
2. Ve a **Settings** → **Environment Variables**
3. Haz clic en **"Add New"**
4. Pon:
   - **Name**: `POSTGRES_URL`
   - **Value**: Pega la URL que copiaste de Supabase
   - **Environment**: Marca todas
5. Haz clic en **"Save"**

### Paso 5: Desplegar
1. Ve a **"Deployments"**
2. Haz clic en los 3 puntos → **"Redeploy"**
3. Espera 2 minutos

### Paso 6: Verificar
1. Ve a: `https://tu-dominio.vercel.app/setup`
2. Debería decir "✅ Base de datos configurada"
3. ¡Listo! 🎉

---

## 🎬 Después de Configurar

1. Ve a: `https://tu-dominio.vercel.app/admin`
2. Usuario: `admin`
3. Contraseña: La que pusiste en `ADMIN_PASSWORD` (o `admin123` por defecto)
4. Crea tu primer video 🎥

---

## ❓ ¿Cuál elegir?

- **Neon**: Más rápido de configurar, pero necesitas crear las tablas manualmente después
- **Supabase**: Tienes que crear las tablas tú mismo, pero tiene mejor dashboard visual

**Recomendación**: Usa **Neon** si quieres lo más rápido. El código creará las tablas automáticamente.

---

## 🆘 Si algo sale mal

1. Verifica que copiaste bien la URL completa (debe empezar con `postgres://`)
2. Asegúrate de hacer "Redeploy" después de agregar la variable
3. Visita `/setup` para ver qué error específico tienes
4. Revisa que la URL no tenga espacios al inicio o final
