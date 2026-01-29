# Guía Completa de Despliegue en Vercel

Esta guía te ayudará a desplegar tu aplicación de gestión de videos en Vercel paso a paso.

## 📋 Requisitos Previos

1. Una cuenta en [Vercel](https://vercel.com) (gratuita)
2. Una cuenta en [GitHub](https://github.com), [GitLab](https://gitlab.com) o [Bitbucket](https://bitbucket.org)
3. Node.js instalado localmente (para desarrollo)

## 🚀 Paso 1: Preparar el Repositorio

1. Inicializa un repositorio Git en tu proyecto:
```bash
git init
git add .
git commit -m "Initial commit"
```

2. Crea un repositorio en GitHub/GitLab/Bitbucket y súbelo:
```bash
git remote add origin https://github.com/tu-usuario/tu-repositorio.git
git branch -M main
git push -u origin main
```

## 🔧 Paso 2: Crear Proyecto en Vercel

1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Haz clic en **"Add New..."** → **"Project"**
3. Importa tu repositorio desde GitHub/GitLab/Bitbucket
4. Vercel detectará automáticamente que es un proyecto Next.js
5. **NO hagas clic en Deploy todavía** - primero necesitamos configurar las bases de datos

## 💾 Paso 3: Configurar Vercel Postgres

1. En el dashboard de Vercel, ve a la pestaña **"Storage"** (en el menú lateral)
2. Haz clic en **"Create Database"**
3. Selecciona **"Postgres"**
4. Elige un nombre para tu base de datos (ej: `video-db`)
5. Selecciona la región más cercana a tus usuarios
6. Haz clic en **"Create"**
7. Vercel automáticamente agregará las siguientes variables de entorno a tu proyecto:
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`
   - `POSTGRES_USER`
   - `POSTGRES_HOST`
   - `POSTGRES_PASSWORD`
   - `POSTGRES_DATABASE`

## 📦 Paso 4: Configurar Vercel Blob Storage

1. En la misma pestaña **"Storage"**, haz clic en **"Create Database"** nuevamente
2. Selecciona **"Blob"**
3. Elige un nombre (ej: `video-blob`)
4. Haz clic en **"Create"**
5. Ve a la configuración del Blob Storage
6. Copia el token **"BLOB_READ_WRITE_TOKEN"**
7. Ve a **Settings** → **Environment Variables** en tu proyecto
8. Agrega una nueva variable:
   - **Name**: `BLOB_READ_WRITE_TOKEN`
   - **Value**: (pega el token que copiaste)
   - **Environment**: Selecciona todas (Production, Preview, Development)

## 🔐 Paso 5: Configurar Variables de Entorno

En **Settings** → **Environment Variables**, agrega:

1. **ADMIN_PASSWORD**
   - Value: Una contraseña segura para el panel de administración
   - Environment: Todas

2. **NODE_ENV**
   - Value: `production`
   - Environment: Production

## 🗄️ Paso 6: Inicializar la Base de Datos

Después de configurar todo, necesitas crear las tablas en la base de datos. Tienes dos opciones:

### Opción A: Usar la API Route (Recomendado)

1. Ve a tu proyecto en Vercel y haz clic en **"Deploy"** (si aún no lo has hecho)
2. Espera a que el despliegue termine
3. Visita: `https://tu-dominio.vercel.app/api/init-db`
4. Deberías ver: `{"success":true,"message":"Base de datos inicializada correctamente"}`
5. **IMPORTANTE**: Después de esto, elimina o protege la ruta `/api/init-db` por seguridad

### Opción B: Ejecutar SQL Manualmente

1. En Vercel Dashboard → **Storage** → **Postgres** → Haz clic en tu base de datos
2. Ve a la pestaña **"Query"**
3. Ejecuta este SQL:

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

## 🎯 Paso 7: Desplegar

1. Si aún no has desplegado, ve a tu proyecto y haz clic en **"Deploy"**
2. Vercel construirá y desplegará tu aplicación automáticamente
3. Espera a que termine el despliegue (verás un enlace cuando termine)

## ✅ Paso 8: Verificar el Despliegue

1. Visita tu dominio: `https://tu-dominio.vercel.app`
2. Deberías ver la página principal (vacía si no hay videos)
3. Visita el panel de administración: `https://tu-dominio.vercel.app/admin`
4. Inicia sesión con:
   - **Usuario**: `admin`
   - **Contraseña**: La que configuraste en `ADMIN_PASSWORD`

## 🎬 Paso 9: Crear tu Primer Video

1. En el panel de administración, completa el formulario:
   - **Título**: El título de tu video
   - **URL del Video**: La URL pública del video (debe ser accesible desde internet)
   - **Miniatura**: Sube una imagen (se guardará en Vercel Blob Storage)
2. Haz clic en **"Crear Video"**
3. Copia el enlace generado (formato: `/?p=1`)
4. Comparte el enlace o visita la página principal para ver todos los videos

## 🔒 Seguridad Post-Despliegue

Después del despliegue inicial, es importante:

1. **Eliminar o proteger `/api/init-db`**:
   - Opción 1: Elimina el archivo `app/api/init-db/route.ts`
   - Opción 2: Agrega autenticación adicional a esa ruta

2. **Cambiar la contraseña por defecto**:
   - Asegúrate de que `ADMIN_PASSWORD` tenga una contraseña fuerte
   - Considera implementar autenticación más robusta (JWT, OAuth) para producción

3. **Revisar las cookies de sesión**:
   - Las cookies actuales son básicas, considera mejorarlas para producción

## 🐛 Solución de Problemas

### Error: "Cannot find module '@vercel/postgres'"
- Asegúrate de que todas las dependencias estén en `package.json`
- Vercel instalará automáticamente las dependencias durante el build

### Error: "Database connection failed"
- Verifica que todas las variables de entorno de Postgres estén configuradas
- Asegúrate de que la base de datos esté creada y activa

### Error: "Blob storage error"
- Verifica que `BLOB_READ_WRITE_TOKEN` esté configurado correctamente
- Asegúrate de que el Blob Storage esté creado y activo

### Las imágenes no se cargan
- Verifica que el Blob Storage esté configurado
- Revisa que las URLs generadas sean públicas
- Verifica los permisos del Blob Storage

## 📚 Recursos Adicionales

- [Documentación de Vercel](https://vercel.com/docs)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Vercel Blob Storage](https://vercel.com/docs/storage/vercel-blob)
- [Next.js Documentation](https://nextjs.org/docs)

## 🎉 ¡Listo!

Tu aplicación está desplegada y lista para usar. Puedes crear videos, subir miniaturas y compartir enlaces desde el panel de administración.
