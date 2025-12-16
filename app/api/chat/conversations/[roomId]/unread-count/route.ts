import { forwardRequest } from '@/lib/api-proxy';
import { NextRequest } from 'next/server';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ roomId: string }> }
) {
  const { roomId } = await context.params;
  return forwardRequest(req, `/v1/chat/conversations/${roomId}/unread-count`);
}
