// app/api/hello/route.ts
import { NextResponse } from 'next/server';
import Sentry from '../../../sentry.server.config';

export async function GET() {
  try {
    // ví dụ lỗi test
    throw new Error('Server-side test Sentry!');
  } catch (err) {
    Sentry.captureException(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
