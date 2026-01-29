import { NextRequest, NextResponse } from 'next/server';
import { getVideoById, updateVideo, deleteVideo } from '@/lib/db';
import { cookies } from 'next/headers';

async function isAuthenticated() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('admin-auth');
  return authCookie?.value === 'authenticated';
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const video = await getVideoById(id);

    if (!video) {
      return NextResponse.json(
        { error: 'Video no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(video);
  } catch (error) {
    console.error('Error fetching video:', error);
    return NextResponse.json(
      { error: 'Error al obtener video' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json(
      { error: 'No autorizado' },
      { status: 401 }
    );
  }

  try {
    const id = parseInt(params.id);
    const { title, video_url, thumbnail_url } = await request.json();

    if (!title || !video_url) {
      return NextResponse.json(
        { error: 'Título y URL del video son requeridos' },
        { status: 400 }
      );
    }

    const video = await updateVideo(id, title, video_url, thumbnail_url || null);
    return NextResponse.json(video);
  } catch (error) {
    console.error('Error updating video:', error);
    return NextResponse.json(
      { error: 'Error al actualizar video' },
      { status: 500 }
    );
  }
}

async function handleDelete(id: number) {
  await deleteVideo(id);
  return NextResponse.json({ success: true });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json(
      { error: 'No autorizado' },
      { status: 401 }
    );
  }

  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }
    return handleDelete(id);
  } catch (error) {
    console.error('Error deleting video:', error);
    return NextResponse.json(
      { error: 'Error al eliminar video' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json(
      { error: 'No autorizado' },
      { status: 401 }
    );
  }

  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }
    const body = await request.json().catch(() => ({}));
    if ((body as { action?: string }).action !== 'delete') {
      return NextResponse.json(
        { error: 'Usa PUT para editar o action: "delete" para eliminar' },
        { status: 400 }
      );
    }
    return handleDelete(id);
  } catch (error) {
    console.error('Error deleting video:', error);
    return NextResponse.json(
      { error: 'Error al eliminar video' },
      { status: 500 }
    );
  }
}
