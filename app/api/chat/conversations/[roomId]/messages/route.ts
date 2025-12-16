import { forwardRequest } from '@/lib/api-proxy';
import { NextRequest } from 'next/server';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ roomId: string }> }
) {
  const { roomId } = await context.params;
  const { searchParams } = new URL(req.url);
  const queryString = searchParams.toString();
  const endpoint = `/v1/chat/conversations/${roomId}/messages${queryString ? `?${queryString}` : ''}`;
  return forwardRequest(req, endpoint);
}
