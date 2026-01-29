'use client';

import { useEffect, useState } from 'react';
import type { Video } from '@/lib/db';

interface VideoPlayerProps {
  video: Video;
}

export default function VideoPlayer({ video }: VideoPlayerProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        <div className="bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
          <video
            className="w-full h-auto"
            controls
            autoPlay
            poster={video.thumbnail_url || undefined}
            preload="metadata"
          >
            <source src={video.video_url} type="video/mp4" />
            Tu navegador no soporta el elemento de video.
          </video>
          
          <div className="p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
            <p className="text-gray-400">Mira el video completo arriba</p>
          </div>
        </div>
      </div>
    </div>
  );
}
