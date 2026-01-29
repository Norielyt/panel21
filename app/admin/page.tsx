'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import VideoList from '@/components/admin/VideoList';
import VideoForm from '@/components/admin/VideoForm';

type Settings = {
  adUrl: string;
  telegramUrl: string;
  whatsappUrl: string;
  facebookUrl: string;
};

const defaultSettings: Settings = {
  adUrl: '',
  telegramUrl: '',
  whatsappUrl: '',
  facebookUrl: '',
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [settingsMessage, setSettingsMessage] = useState<string | null>(null);
  const router = useRouter();

  const loadSettings = async () => {
    try {
      setSettingsLoading(true);
      const res = await fetch('/api/settings', { cache: 'no-store' });
      if (!res.ok) {
        setSettings(defaultSettings);
        return;
      }
      const data = (await res.json()) as Partial<Settings>;
      setSettings({
        adUrl: data.adUrl ?? '',
        telegramUrl: data.telegramUrl ?? '',
        whatsappUrl: data.whatsappUrl ?? '',
        facebookUrl: data.facebookUrl ?? '',
      });
    } catch (e) {
      console.error('Error loading settings:', e);
      setSettings(defaultSettings);
    } finally {
      setSettingsLoading(false);
    }
  };

  useEffect(() => {
    // Verificar si ya está autenticado
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check');
        if (response.ok) {
          setIsAuthenticated(true);
          await loadSettings();
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        await loadSettings();
      } else {
        setError('Credenciales incorrectas');
      }
    } catch (error) {
      setError('Error al iniciar sesión');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setIsAuthenticated(false);
    router.push('/');
  };

  const handleSettingsChange = (field: keyof Settings, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsMessage(null);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'No se pudo guardar la configuración');
      }
      const data = (await res.json()) as Settings;
      setSettings(data);
      setSettingsMessage('Configuración guardada correctamente.');
    } catch (err: any) {
      setSettingsMessage(err?.message || 'Error al guardar la configuración');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-900 rounded-lg p-8">
          <h1 className="text-2xl font-bold mb-6 text-center">Panel de Administración</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Usuario</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition"
            >
              Iniciar Sesión
            </button>
          </form>
          <p className="mt-4 text-sm text-gray-400 text-center">
            Usuario por defecto: admin / Contraseña: admin123
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="container mx-auto max-w-6xl space-y-10">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
          >
            Cerrar Sesión
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Crear Nuevo Video</h2>
            <VideoForm />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Videos Existentes</h2>
            <VideoList />
          </div>
        </div>

        {/* Configuración de anuncios y botones flotantes */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h2 className="text-xl font-semibold mb-4">Configuración de anuncios y enlaces</h2>
          <p className="text-sm text-gray-400 mb-6">
            Aquí puedes definir la URL del anuncio que se abre al reproducir el video y los enlaces
            de los botones flotantes (Telegram, WhatsApp y Facebook) que aparecen en el reproductor.
          </p>

          {settingsLoading ? (
            <div className="text-gray-400">Cargando configuración...</div>
          ) : (
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-200">
                  URL del anuncio (AD_URL)
                </label>
                <input
                  type="url"
                  value={settings.adUrl}
                  onChange={(e) => handleSettingsChange('adUrl', e.target.value)}
                  placeholder="https://tus-anuncios.com/campaña"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500 text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Se abrirá al primer clic en reproducir. Intentaremos que tu pestaña de video quede
                  delante (tipo popunder), pero depende del navegador.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-200">
                    Enlace Telegram
                  </label>
                  <input
                    type="url"
                    value={settings.telegramUrl}
                    onChange={(e) => handleSettingsChange('telegramUrl', e.target.value)}
                    placeholder="https://t.me/tu_canal"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-200">
                    Enlace WhatsApp
                  </label>
                  <input
                    type="url"
                    value={settings.whatsappUrl}
                    onChange={(e) => handleSettingsChange('whatsappUrl', e.target.value)}
                    placeholder="https://wa.me/..."
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500 text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Si lo dejas vacío, igualmente se usará la URL del video actual al compartir por
                    WhatsApp.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-200">
                    Enlace Facebook
                  </label>
                  <input
                    type="url"
                    value={settings.facebookUrl}
                    onChange={(e) => handleSettingsChange('facebookUrl', e.target.value)}
                    placeholder="https://facebook.com/tu_página"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>
              </div>

              {settingsMessage && (
                <p className="text-sm text-gray-200 bg-gray-800 border border-gray-700 rounded px-3 py-2">
                  {settingsMessage}
                </p>
              )}

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded text-sm transition"
              >
                Guardar configuración
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
