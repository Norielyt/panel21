import { list, put } from '@vercel/blob';

export interface Video {
  id: number;
  title: string;
  video_url: string;
  thumbnail_url: string | null;
  created_at: string;
}

const VIDEOS_BLOB_PATH = 'data/videos.json';

async function loadVideos(): Promise<Video[]> {
  try {
    const { blobs } = await list({ prefix: VIDEOS_BLOB_PATH, limit: 1 });

    if (!blobs.length) {
      return [];
    }

    const res = await fetch(blobs[0].url, { cache: 'no-store' });
    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    if (!Array.isArray(data)) {
      return [];
    }

    return data as Video[];
  } catch (error: any) {
    const msg = error?.message || '';
    if (msg.includes('BLOB_READ_WRITE_TOKEN')) {
      throw new Error('Blob no configurado. Debes crear un Blob Store en Vercel y configurar BLOB_READ_WRITE_TOKEN.');
    }
    console.error('Error loading videos from blob:', error);
    throw error;
  }
}

async function saveVideos(videos: Video[]): Promise<void> {
  try {
    await put(VIDEOS_BLOB_PATH, JSON.stringify(videos, null, 2), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
      cacheControlMaxAge: 0,
    });
  } catch (error: any) {
    const msg = error?.message || '';
    if (msg.includes('BLOB_READ_WRITE_TOKEN')) {
      throw new Error('Blob no configurado. Debes crear un Blob Store en Vercel y configurar BLOB_READ_WRITE_TOKEN.');
    }
    console.error('Error saving videos to blob:', error);
    throw error;
  }
}

export async function getAllVideos(): Promise<Video[]> {
  return loadVideos();
}

export async function getVideoById(id: number): Promise<Video | null> {
  const videos = await loadVideos();
  return videos.find((v) => v.id === id) || null;
}

export async function createVideo(
  title: string,
  videoUrl: string,
  thumbnailUrl: string | null
): Promise<Video> {
  const videos = await loadVideos();
  const newId = videos.length ? Math.max(...videos.map((v) => v.id)) + 1 : 1;

  const newVideo: Video = {
    id: newId,
    title,
    video_url: videoUrl,
    thumbnail_url: thumbnailUrl,
    created_at: new Date().toISOString(),
  };

  videos.push(newVideo);
  await saveVideos(videos);
  return newVideo;
}

export async function updateVideo(
  id: number,
  title: string,
  videoUrl: string,
  thumbnailUrl: string | null
): Promise<Video> {
  const videos = await loadVideos();
  const index = videos.findIndex((v) => v.id === id);

  if (index === -1) {
    throw new Error('Video no encontrado');
  }

  const updated: Video = {
    ...videos[index],
    title,
    video_url: videoUrl,
    thumbnail_url: thumbnailUrl,
  };

  videos[index] = updated;
  await saveVideos(videos);
  return updated;
}

export async function deleteVideo(id: number): Promise<void> {
  const videos = await loadVideos();
  const filtered = videos.filter((v) => v.id !== id);
  await saveVideos(filtered);
}
