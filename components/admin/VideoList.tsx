'use client';

import { useState, useEffect } from 'react';
import type { Video } from '@/lib/db';
import VideoForm from './VideoForm';

export default function VideoList() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/videos');
      if (response.ok) {
        const data = await response.json();
        setVideos(data);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este video?')) {
      return;
    }

    try {
      const response = await fetch(`/api/videos/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete' }),
      });

      if (response.ok) {
        fetchVideos();
      } else {
        const data = await response.json().catch(() => ({}));
        alert((data as { error?: string }).error || 'Error al eliminar el video');
      }
    } catch (error) {
      alert('Error al eliminar el video');
    }
  };

  const handleEdit = (video: Video) => {
    setEditingId(video.id);
  };

  if (loading) {
    return <div className="text-center py-8">Cargando...</div>;
  }

  if (videos.length === 0) {
    return <div className="text-gray-400 text-center py-8">No hay videos</div>;
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-4 max-h-[600px] overflow-y-auto">
      {videos.map((video) => (
        <div key={video.id} className="bg-gray-800 rounded p-4">
          {editingId === video.id ? (
            <VideoForm videoId={video.id} initialData={video} />
          ) : (
            <>
              {video.thumbnail_url && (
                <img src={video.thumbnail_url} alt={video.title} className="w-full h-32 object-cover rounded mb-2" />
              )}
              <h3 className="font-semibold mb-2">{video.title}</h3>
              <p className="text-sm text-gray-400 mb-2 truncate">{video.video_url}</p>
              <div className="flex gap-2">
                <a
                  href={`/?p=${video.id}`}
                  target="_blank"
                  className="text-blue-500 hover:text-blue-400 text-sm"
                >
                  Ver enlace
                </a>
                <button
                  onClick={() => handleEdit(video)}
                  className="text-yellow-500 hover:text-yellow-400 text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(video.id)}
                  className="text-red-500 hover:text-red-400 text-sm"
                >
                  Eliminar
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
