# 📸 Guía Visual Paso a Paso

## 🎯 Lo que necesitas hacer (en orden):

```
1. Crear base de datos en Neon o Supabase
   ↓
2. Copiar la URL de conexión
   ↓
3. Pegarla en Vercel como variable POSTGRES_URL
   ↓
4. Hacer Redeploy
   ↓
5. Visitar /setup
   ↓
✅ ¡Listo!
```

---

## 📝 Paso a Paso Detallado

### 🔵 OPCIÓN A: Neon (Recomendada - Más Fácil)

#### 1️⃣ Ir a Neon
- Abre: https://neon.tech
- Haz clic en **"Sign Up"** (arriba a la derecha)
- Elige **"Continue with GitHub"** (más rápido)

#### 2️⃣ Crear Proyecto
- Haz clic en el botón grande **"Create Project"**
- Nombre: `video-player` (o el que quieras)
- Haz clic en **"Create Project"**
- Espera 30 segundos

#### 3️⃣ Copiar URL
- Verás una pantalla con tu proyecto
- Busca donde dice **"Connection string"**
- Haz clic en el ícono de **copiar** 📋
- **Guarda esto en un archivo de texto temporal**

#### 4️⃣ Ir a Vercel
- Abre tu proyecto en Vercel
- Menú lateral → **"Settings"**
- Submenú → **"Environment Variables"**

#### 5️⃣ Agregar Variable
- Haz clic en **"Add New"**
- **Key**: `POSTGRES_URL`
- **Value**: Pega la URL que copiaste de Neon
- Marca todas las casillas (Production, Preview, Development)
- Haz clic en **"Save"**

#### 6️⃣ Redeploy
- Menú lateral → **"Deployments"**
- Busca el último despliegue
- Haz clic en los **3 puntos** → **"Redeploy"**
- Espera 2 minutos

#### 7️⃣ Verificar
- Ve a: `https://tu-dominio.vercel.app/setup`
- Debería aparecer un ✅ verde
- Si aparece ✅ = ¡Todo listo!

---

### 🟢 OPCIÓN B: Supabase

#### 1️⃣ Ir a Supabase
- Abre: https://supabase.com
- Haz clic en **"Start your project"**
- Elige **"Continue with GitHub"**

#### 2️⃣ Crear Proyecto
- Haz clic en **"New Project"**
- Nombre: `video-player`
- Contraseña: (inventa una y guárdala)
- Región: Elige la más cercana
- Haz clic en **"Create new project"**
- Espera 2 minutos

#### 3️⃣ Crear Tablas
- Menú lateral izquierdo → **"SQL Editor"**
- Haz clic en **"New query"**
- Copia TODO esto y pégalo:

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

- Presiona **Ctrl+Enter** (o haz clic en "Run")
- Debería decir "Success"

#### 4️⃣ Copiar URL
- Menú lateral → **"Settings"** (engranaje ⚙️)
- Submenú → **"Database"**
- Busca **"Connection string"**
- Elige la pestaña **"URI"**
- Haz clic en **copiar** 📋
- **Guarda esto en un archivo de texto**

#### 5️⃣ Ir a Vercel
- Abre tu proyecto en Vercel
- **Settings** → **Environment Variables**

#### 6️⃣ Agregar Variable
- **Add New**
- **Key**: `POSTGRES_URL`
- **Value**: Pega la URL de Supabase
- Marca todas las casillas
- **Save**

#### 7️⃣ Redeploy
- **Deployments** → 3 puntos → **Redeploy**
- Espera 2 minutos

#### 8️⃣ Verificar
- Ve a: `/setup`
- Debería aparecer ✅

---

## ✅ Checklist Final

Marca cuando completes cada paso:

- [ ] Creé cuenta en Neon/Supabase
- [ ] Creé el proyecto
- [ ] Copié la URL de conexión
- [ ] Agregué `POSTGRES_URL` en Vercel
- [ ] Hice Redeploy
- [ ] Visité `/setup` y vi el ✅ verde
- [ ] Puedo entrar a `/admin`

---

## 🎉 ¡Ya está!

Ahora puedes:
- Ir a `/admin` para crear videos
- Subir miniaturas
- Compartir enlaces como `/?p=1`

---

## 💡 Tip Pro

**Si usas Neon**: El código creará las tablas automáticamente, no necesitas hacer nada más.

**Si usas Supabase**: Tienes que crear las tablas tú mismo (paso 3), pero después es igual de fácil.
