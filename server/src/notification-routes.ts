import WebPush from 'web-push'
import { FastifyInstance } from 'fastify'
import z from 'zod'

const publicKey = 'BC20E3i6ejWoBn6Ze9sxR1gqWV4_kf7xNzPgNMddYFWovnTM8wKAWZPj76afic50NdsV3VHzvFkmffkO6SU5iIY'
const privateKey = 'nCxcWfUpNOBnGfC30g1i5KBj4QXo-xDS2-BJP3MD_Lc'

WebPush.setVapidDetails('http://localhost:3333', publicKey, privateKey)

export async function notificationRoutes(app: FastifyInstance) {
  app.get('/push/public_key', () => {
    return {
      publicKey,
    }
  })

  app.post('/push/register', (request, reply) => {
    console.log(request.body)

    return reply.status(201).send()
  })

  app.post('/push/send', async (request, reply) => {
    const sendPushBody = z.object({
      subscription: z.object({
        endpoint: z.string(),
        keys: z.object({
          p256dh: z.string(),
          auth: z.string()
        })
      })
    })

    const { subscription } = sendPushBody.parse(request.body)

    WebPush.sendNotification(subscription, 'HELLO DO BACKEND')

    return reply.status(201).send()
  })
}