import { forwardRequest } from '@/lib/api-proxy';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const queryString = searchParams.toString();
  const endpoint = `/v1/chat/conversations${queryString ? `?${queryString}` : ''}`;
  return forwardRequest(req, endpoint);
}

export async function POST(req: NextRequest) {
  return forwardRequest(req, '/v1/chat/conversations');
}
