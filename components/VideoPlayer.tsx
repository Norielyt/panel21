'use client';

import { useEffect, useRef, useState } from 'react';
import type { Video } from '@/lib/db';
import { AD_URL, TELEGRAM_URL, WHATSAPP_URL, FACEBOOK_URL } from '@/lib/config';

interface VideoPlayerProps {
  video: Video;
}

export default function VideoPlayer({ video }: VideoPlayerProps) {
  const [loading, setLoading] = useState(true);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [adOpened, setAdOpened] = useState(false);
  const [settings, setSettings] = useState({
    adUrl: AD_URL,
    telegramUrl: TELEGRAM_URL,
    whatsappUrl: WHATSAPP_URL,
    facebookUrl: FACEBOOK_URL,
  });
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch('/api/settings', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        setSettings((prev) => ({
          adUrl: typeof data.adUrl === 'string' ? data.adUrl || prev.adUrl : prev.adUrl,
          telegramUrl:
            typeof data.telegramUrl === 'string' ? data.telegramUrl || prev.telegramUrl : prev.telegramUrl,
          whatsappUrl:
            typeof data.whatsappUrl === 'string' ? data.whatsappUrl || prev.whatsappUrl : prev.whatsappUrl,
          facebookUrl:
            typeof data.facebookUrl === 'string' ? data.facebookUrl || prev.facebookUrl : prev.facebookUrl,
        }));
      } catch {
        // ignorar errores, dejamos valores por defecto/env
      }
    };
    loadSettings();
  }, []);

  const handlePlay = async () => {
    if (typeof window !== 'undefined' && settings.adUrl && !adOpened) {
      try {
        // Intenta abrir el anuncio en una nueva pestaña/ventana
        window.open(settings.adUrl, '_blank', 'noopener,noreferrer');
        setAdOpened(true);

        // Intentar volver a enfocar la pestaña del video (comportamiento tipo popunder,
        // pero dependemos de que el navegador lo permita)
        try {
          window.focus();
          // En algunos navegadores ayuda un pequeño delay
          setTimeout(() => {
            try {
              window.focus();
            } catch {
              /* ignore */
            }
          }, 300);
        } catch {
          /* ignore */
        }
      } catch {
        // si el popup es bloqueado, seguimos con el video igualmente
      }
    }

    try {
      await videoRef.current?.play();
    } catch {
      // algunos navegadores pueden bloquear el autoplay si no detectan bien el gesto
    }
    setOverlayVisible(false);
  };

  const handleShare = async () => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: video.title,
          text: `Mira el video: ${video.title}`,
          url,
        });
        return;
      }
    } catch {
      // si falla share, hacemos fallback a copiar enlace
    }

    try {
      await navigator.clipboard.writeText(url);
      alert('Enlace copiado al portapapeles');
    } catch {
      alert('No se pudo copiar el enlace');
    }
  };

  const shareUrlEncoded =
    typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : '';
  const shareTextEncoded =
    typeof window !== 'undefined' ? encodeURIComponent(`Mira el video: ${video.title}`) : '';

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative">
      <div className="max-w-6xl w-full">
        <div className="bg-gray-900 rounded-lg overflow-hidden shadow-2xl relative">
          <div className="relative w-full">
            <video
              ref={videoRef}
              className="w-full h-auto bg-black"
              controls
              playsInline
              poster={video.thumbnail_url || undefined}
              preload="metadata"
            >
              <source src={video.video_url} type="video/mp4" />
              Tu navegador no soporta el elemento de video.
            </video>

            {overlayVisible && (
              <button
                type="button"
                onClick={handlePlay}
                className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 hover:bg-black/50 transition"
              >
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/90 flex items-center justify-center shadow-xl">
                  <span className="ml-1 border-l-[26px] border-l-black border-y-[16px] border-y-transparent md:border-l-[30px] md:border-y-[18px]" />
                </div>
                {settings.adUrl && !adOpened && (
                  <p className="mt-4 text-sm md:text-base text-gray-200 font-medium px-4 text-center">
                    Serás enviado a una página de anuncio y luego empezará el video.
                  </p>
                )}
              </button>
            )}
          </div>

          <div className="p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
            <p className="text-gray-400">Mira el video completo arriba.</p>
          </div>
        </div>
      </div>

      {/* Botones flotantes de redes y compartir */}
      <div className="fixed bottom-6 right-4 flex flex-col gap-3 z-40">
        <button
          type="button"
          onClick={handleShare}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center shadow-lg hover:scale-110 transition"
          title="Compartir"
        >
          <span className="material-icons-outlined">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-6 h-6"
              fill="currentColor"
            >
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7a3.27 3.27 0 0 0 0-1.39l7.02-4.11A3 3 0 1 0 14 5a3 3 0 0 0 .05.51L7.03 9.61a3 3 0 1 0 0 4.78l7.02 4.11A3 3 0 1 0 18 16.08Z" />
            </svg>
          </span>
        </button>

        {settings.telegramUrl && (
          <a
            href={settings.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 h-14 rounded-full bg-gradient-to-br from-sky-500 to-sky-400 text-white flex items-center justify-center shadow-lg hover:scale-110 transition"
            title="Telegram"
          >
            <i className="fab fa-telegram-plane text-2xl" />
          </a>
        )}

        {settings.whatsappUrl && (
          <a
            href={`https://wa.me/?text=${shareTextEncoded}%20${shareUrlEncoded}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 text-white flex items-center justify-center shadow-lg hover:scale-110 transition"
            title="WhatsApp"
          >
            <i className="fab fa-whatsapp text-2xl" />
          </a>
        )}

        {settings.facebookUrl && (
          <a
            href={settings.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-blue-500 text-white flex items-center justify-center shadow-lg hover:scale-110 transition"
            title="Facebook"
          >
            <i className="fab fa-facebook-f text-2xl" />
          </a>
        )}
      </div>
    </div>
  );
}

