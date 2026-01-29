import { NextRequest, NextResponse } from 'next/server';
import { getAllVideos, createVideo } from '@/lib/db';
import { cookies } from 'next/headers';

async function isAuthenticated() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('admin-auth');
  return authCookie?.value === 'authenticated';
}

export async function GET() {
  try {
    const videos = await getAllVideos();
    return NextResponse.json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { error: 'Error al obtener videos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json(
      { error: 'No autorizado' },
      { status: 401 }
    );
  }

  try {
    const { title, video_url, thumbnail_url } = await request.json();

    if (!title || !video_url) {
      return NextResponse.json(
        { error: 'Título y URL del video son requeridos' },
        { status: 400 }
      );
    }

    const video = await createVideo(title, video_url, thumbnail_url || null);
    return NextResponse.json(video, { status: 201 });
  } catch (error) {
    console.error('Error creating video:', error);
    return NextResponse.json(
      { error: 'Error al crear video' },
      { status: 500 }
    );
  }
}
