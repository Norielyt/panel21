# 🚀 Instrucciones Súper Rápidas

## ⚡ Opción Más Fácil: Neon (5 minutos)

### 1. Crear base de datos
- Ve a https://neon.tech
- Crea cuenta (con GitHub es más rápido)
- Haz clic en **"Create Project"**
- Copia la **"Connection string"** 📋

### 2. Configurar en Vercel
- Ve a tu proyecto en Vercel → **Settings** → **Environment Variables**
- Agrega:
  - **Key**: `POSTGRES_URL`
  - **Value**: Pega la URL que copiaste
- Haz clic en **Save**

### 3. Desplegar
- Ve a **Deployments** → 3 puntos → **Redeploy**
- Espera 2 minutos

### 4. Verificar
- Ve a: `https://tu-dominio.vercel.app/setup`
- Debería aparecer ✅ verde

### 5. Configurar Blob Storage (para miniaturas)
- En Vercel → **Storage** → **Create Database** → **Blob**
- Copia el token `BLOB_READ_WRITE_TOKEN`
- **Settings** → **Environment Variables** → Agrega:
  - **Key**: `BLOB_READ_WRITE_TOKEN`
  - **Value**: Pega el token
- Agrega también:
  - **Key**: `ADMIN_PASSWORD`
  - **Value**: Tu contraseña (ej: `miPassword123`)
- Haz **Redeploy** otra vez

## ✅ ¡Listo!

- Panel admin: `/admin`
- Usuario: `admin`
- Contraseña: La que pusiste en `ADMIN_PASSWORD`

---

📖 **Para más detalles**, lee `GUIA_SUPER_SIMPLE.md` o `PASOS_VISUALES.md`
