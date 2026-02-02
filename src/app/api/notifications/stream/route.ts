import { NextRequest } from 'next/server'
import { auth } from '@/infrastructure/auth/config'

const clients = new Map<string, ReadableStreamDefaultController>()

export function emitNotification(userId: string, data: unknown) {
  const controller = clients.get(userId)
  if (controller) {
    const message = `data: ${JSON.stringify(data)}\n\n`
    controller.enqueue(new TextEncoder().encode(message))
  }
}

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 })
  }

  const userId = session.user.id

  const stream = new ReadableStream({
    start(controller) {
      clients.set(userId, controller)

      const keepAlive = setInterval(() => {
        try {
          controller.enqueue(new TextEncoder().encode(': keepalive\n\n'))
        } catch {
          clearInterval(keepAlive)
        }
      }, 30000)

      request.signal.addEventListener('abort', () => {
        clearInterval(keepAlive)
        clients.delete(userId)
        controller.close()
      })
    },
    cancel() {
      clients.delete(userId)
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
