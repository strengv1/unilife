import { NextRequest, NextResponse } from 'next/server';
import { checkPassword, createToken, setAuthCookie, verifyAuth, clearAuthCookie } from '@/app/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!checkPassword(password)) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const token = createToken();
    await setAuthCookie(token);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function GET() {
  const isAuthenticated = await verifyAuth();
  return NextResponse.json({ authenticated: isAuthenticated });
}

export async function DELETE() {
  await clearAuthCookie();
  return NextResponse.json({ success: true });
}