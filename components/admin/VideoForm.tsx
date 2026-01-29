'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VideoForm({ videoId, initialData }: { videoId?: number; initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    video_url: initialData?.video_url || '',
    thumbnail: null as File | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let thumbnailUrl = initialData?.thumbnail_url || null;

      // Subir miniatura si hay una nueva
      if (formData.thumbnail) {
        const formDataToSend = new FormData();
        formDataToSend.append('file', formData.thumbnail);
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formDataToSend,
        });

        if (!uploadResponse.ok) {
          throw new Error('Error al subir la miniatura');
        }

        const uploadData = await uploadResponse.json();
        thumbnailUrl = uploadData.url;
      }

      // Crear o actualizar video
      const url = videoId ? `/api/videos/${videoId}` : '/api/videos';
      const method = videoId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          video_url: formData.video_url,
          thumbnail_url: thumbnailUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al guardar el video');
      }

      router.refresh();
      if (!videoId) {
        setFormData({ title: '', video_url: '', thumbnail: null });
      }
      alert(videoId ? 'Video actualizado exitosamente' : 'Video creado exitosamente');
      if (videoId) {
        window.location.reload();
      }
    } catch (error: any) {
      setError(error.message || 'Error al guardar el video');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 rounded-lg p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Título del Video</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">URL del Video</label>
        <input
          type="url"
          value={formData.video_url}
          onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
          placeholder="https://ejemplo.com/video.mp4"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Miniatura (opcional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFormData({ ...formData, thumbnail: e.target.files?.[0] || null })}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
        />
        {initialData?.thumbnail_url && !formData.thumbnail && (
          <img src={initialData.thumbnail_url} alt="Thumbnail" className="mt-2 w-32 h-20 object-cover rounded" />
        )}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium py-2 px-4 rounded transition"
      >
        {loading ? 'Guardando...' : videoId ? 'Actualizar Video' : 'Crear Video'}
      </button>
    </form>
  );
}
