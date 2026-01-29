import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { cookies } from 'next/headers';

async function isAuthenticated() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('admin-auth');
  return authCookie?.value === 'authenticated';
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json(
      { error: 'No autorizado' },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó ningún archivo' },
        { status: 400 }
      );
    }

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'El archivo debe ser una imagen' },
        { status: 400 }
      );
    }

    // Subir a Vercel Blob Storage
    const blob = await put(`thumbnails/${Date.now()}-${file.name}`, file, {
      access: 'public',
    });

    return NextResponse.json({ url: blob.url });
  } catch (error: any) {
    console.error('Error uploading file:', error);

    // Mensaje más claro cuando falta el token o hay problema de Blob
    const message = error?.message || '';
    if (message.includes('BLOB_READ_WRITE_TOKEN')) {
      return NextResponse.json(
        {
          error:
            'Blob no configurado. Debes crear un Blob Store en Vercel y configurar la variable de entorno BLOB_READ_WRITE_TOKEN, luego hacer redeploy.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Error al subir el archivo: ' + message },
      { status: 500 }
    );
  }
}
