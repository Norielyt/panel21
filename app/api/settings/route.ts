import { NextRequest, NextResponse } from 'next/server';
import { list, put } from '@vercel/blob';
import { cookies } from 'next/headers';

const SETTINGS_BLOB_PATH = 'data/settings.json';

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

async function loadSettings(): Promise<Settings> {
  try {
    const { blobs } = await list({ prefix: SETTINGS_BLOB_PATH, limit: 1 });

    if (!blobs.length) {
      return defaultSettings;
    }

    const res = await fetch(blobs[0].url, { cache: 'no-store' });
    if (!res.ok) {
      return defaultSettings;
    }

    const data = await res.json();
    return {
      ...defaultSettings,
      ...(typeof data === 'object' && data ? data : {}),
    };
  } catch (error) {
    console.error('Error loading settings from blob:', error);
    return defaultSettings;
  }
}

async function saveSettings(settings: Settings) {
  try {
    await put(SETTINGS_BLOB_PATH, JSON.stringify(settings, null, 2), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
      cacheControlMaxAge: 0,
    });
  } catch (error) {
    console.error('Error saving settings to blob:', error);
    throw error;
  }
}

async function isAuthenticated() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('admin-auth');
  return authCookie?.value === 'authenticated';
}

export async function GET() {
  const settings = await load();
  return NextResponse.json(settings);
}

async function load() {
  return loadSettings();
}

async function handleSave(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Partial<Settings>;

    const next: Settings = {
      adUrl: typeof body.adUrl === 'string' ? body.adUrl.trim() : defaultSettings.adUrl,
      telegramUrl:
        typeof body.telegramUrl === 'string' ? body.telegramUrl.trim() : defaultSettings.telegramUrl,
      whatsappUrl:
        typeof body.whatsappUrl === 'string' ? body.whatsappUrl.trim() : defaultSettings.whatsappUrl,
      facebookUrl:
        typeof body.facebookUrl === 'string' ? body.facebookUrl.trim() : defaultSettings.facebookUrl,
    };

    await saveSettings(next);

    return NextResponse.json(next);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Error al guardar la configuración' },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  return handleSave(request);
}

export async function POST(request: NextRequest) {
  return handleSave(request);
}

