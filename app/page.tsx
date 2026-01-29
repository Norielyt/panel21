import { notFound } from 'next/navigation';
import { getAllVideos, getVideoById } from '@/lib/db';
import Link from 'next/link';
import VideoPlayer from '@/components/VideoPlayer';
import type { Metadata } from 'next';

// Siempre datos frescos: sin caché para que borrar/crear videos se vea al instante
export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: { p?: string };
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const videoId = searchParams.p ? parseInt(searchParams.p) : null;
  
  if (videoId) {
    const video = await getVideoById(videoId);
    
    if (video) {
      const ogImage = video.thumbnail_url
        ? { url: video.thumbnail_url, width: 1200, height: 630, alt: video.title }
        : { url: '/og-default.png', width: 1200, height: 630, alt: video.title };
      return {
        title: video.title,
        description: `Mira el video: ${video.title}`,
        openGraph: {
          title: video.title,
          description: `Mira el video: ${video.title}`,
          type: 'video.other',
          url: `https://clippys.xyz/?p=${video.id}`,
          images: [ogImage],
          videos: [
            {
              url: video.video_url,
              secureUrl: video.video_url,
              type: 'video/mp4',
              width: 1280,
              height: 720,
            }
          ],
        },
        twitter: {
          card: 'summary_large_image',
          title: video.title,
          description: `Mira el video: ${video.title}`,
          images: [typeof ogImage.url === 'string' ? ogImage.url : '/og-default.png'],
        },
      };
    }
  }
  
  return {
    title: 'Video Player',
    description: 'Reproductor de videos',
  };
}

export default async function HomePage({ searchParams }: PageProps) {
  const videoId = searchParams.p ? parseInt(searchParams.p) : null;

  // Si hay un video ID, mostrar el reproductor
  if (videoId) {
    const video = await getVideoById(videoId);
    
    if (!video) {
      notFound();
    }
    
    return <VideoPlayer video={video} />;
  }
  
  // Si no hay video ID, mostrar la lista
  const videos = await getAllVideos();
  
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Video Player</h1>
        
        {videos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No hay videos disponibles</p>
            <Link 
              href="/admin" 
              className="text-blue-500 hover:text-blue-400 underline"
            >
              Ir al panel de administración
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <Link 
                key={video.id} 
                href={`/?p=${video.id}`}
                className="block bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition"
              >
                {video.thumbnail_url && (
                  <img 
                    src={video.thumbnail_url} 
                    alt={video.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h2 className="text-lg font-semibold line-clamp-2">{video.title}</h2>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
