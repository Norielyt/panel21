# Video Player Admin - Sistema de Gestión de Videos

Sistema completo para gestionar videos con panel de administración, desarrollado con Next.js y Vercel.

## Características

- ✅ Panel de administración para crear, editar y eliminar videos
- ✅ Subida de miniaturas a Vercel Blob Storage
- ✅ Base de datos PostgreSQL con Vercel Postgres
- ✅ **Inicialización automática de la base de datos** - Se crea automáticamente al primer uso
- ✅ Página de configuración (`/setup`) que verifica y guía el proceso
- ✅ Páginas dinámicas para cada video con SEO optimizado
- ✅ Metadatos Open Graph y Twitter Cards
- ✅ Autenticación básica para el panel de administración
- ✅ Diseño responsive con Tailwind CSS

## Configuración en Vercel

### 1. Crear Proyecto en Vercel

1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Importa tu repositorio de GitHub/GitLab/Bitbucket
3. Vercel detectará automáticamente que es un proyecto Next.js

### 2. Configurar Vercel Postgres

1. En el dashboard de Vercel, ve a la pestaña **Storage**
2. Haz clic en **Create Database** → **Postgres**
3. Selecciona tu proyecto y crea la base de datos
4. Vercel automáticamente agregará las variables de entorno:
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`
   - `POSTGRES_USER`
   - `POSTGRES_HOST`
   - `POSTGRES_PASSWORD`
   - `POSTGRES_DATABASE`

### 3. Configurar Vercel Blob Storage

1. En el dashboard de Vercel, ve a la pestaña **Storage**
2. Haz clic en **Create Database** → **Blob**
3. Selecciona tu proyecto y crea el almacenamiento
4. Copia el token `BLOB_READ_WRITE_TOKEN` y agrégalo a las variables de entorno

### 4. Configurar Variables de Entorno

En el dashboard de Vercel, ve a **Settings** → **Environment Variables** y agrega:

```
ADMIN_PASSWORD=tu_contraseña_segura_aqui
NODE_ENV=production
```

### 5. Inicializar Base de Datos Automáticamente

**¡La aplicación ahora inicializa la base de datos automáticamente!** 

Después de configurar Vercel Postgres, simplemente:

1. Visita `https://tu-dominio.vercel.app/setup` - Esta página verificará y configurará todo automáticamente
2. O visita cualquier página de la aplicación - La BD se inicializará automáticamente en el primer uso

**Nota:** Si prefieres inicializar manualmente, puedes visitar `/api/init-db` o ejecutar el SQL directamente en Vercel Dashboard → Storage → Postgres → Query.

### 6. Desplegar

1. Haz push a tu repositorio
2. Vercel desplegará automáticamente
3. Visita `https://tu-dominio.vercel.app/admin`
4. Inicia sesión con:
   - Usuario: `admin`
   - Contraseña: La que configuraste en `ADMIN_PASSWORD` (o `admin123` por defecto)

## Desarrollo Local

### Instalación

```bash
npm install
```

### Configurar Variables de Entorno

Crea un archivo `.env.local` con:

```env
POSTGRES_URL="tu_postgres_url_de_vercel"
POSTGRES_PRISMA_URL="tu_prisma_url"
POSTGRES_URL_NON_POOLING="tu_non_pooling_url"
POSTGRES_USER="tu_usuario"
POSTGRES_HOST="tu_host"
POSTGRES_PASSWORD="tu_password"
POSTGRES_DATABASE="tu_database"

BLOB_READ_WRITE_TOKEN="tu_blob_token"

ADMIN_PASSWORD="admin123"
NODE_ENV="development"
```

### Ejecutar en Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Uso

### Panel de Administración

1. Visita `/admin` en tu aplicación
2. Inicia sesión con tus credenciales
3. Crea nuevos videos:
   - Título del video
   - URL del video (debe ser una URL pública accesible)
   - Miniatura (opcional, se subirá a Vercel Blob Storage)
4. Edita o elimina videos existentes
5. Copia el enlace del video para compartir (formato: `/?p=ID`)

### Ver Videos

- Página principal (`/`): Lista todos los videos
- Video individual (`/?p=ID`): Muestra el reproductor de video con SEO optimizado

## Estructura del Proyecto

```
├── app/
│   ├── admin/          # Panel de administración
│   ├── api/            # API routes
│   │   ├── auth/       # Autenticación
│   │   ├── videos/     # CRUD de videos
│   │   └── upload/     # Subida de imágenes
│   ├── [id]/           # Página dinámica de video
│   └── page.tsx        # Página principal
├── components/
│   ├── admin/          # Componentes del panel admin
│   └── VideoPlayer.tsx # Reproductor de video
├── lib/
│   ├── db.ts           # Funciones de base de datos
│   └── auth.ts         # Funciones de autenticación
└── vercel.json         # Configuración de Vercel
```

## Seguridad

- ⚠️ **IMPORTANTE**: Cambia `ADMIN_PASSWORD` en producción
- ⚠️ Considera implementar autenticación más robusta (JWT, OAuth) para producción
- ⚠️ Las cookies de sesión son básicas, mejóralas para producción

## Licencia

MIT
