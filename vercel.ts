import type { z } from 'zod'
import { executeHandler, readBody, validateInputs } from './server'
import { type Body, type Handler, type Methods, bodySchema } from './types'

export function vercel(routes: Methods) {
  async function handler(request: Request) {
    const validation = bodySchema.safeParse(await readBody(request))

    if (!validation.success) {
      return Response.json({ error: 'Invalid input.', message: validation.error })
    }

    const body = validation.data as Body

    if (!(body.method && Object.hasOwn(routes, body.method))) {
      return Response.json({ error: true })
    }

    const [handler, inputs] = routes[body.method] as unknown as [Handler, z.ZodTypeAny]

    if (inputs && body.data) {
      const validationResult = validateInputs(body.data, inputs)
      if (validationResult) {
        return Response.json({ error: true, validation: validationResult })
      }
    } else {
      body.data = undefined
    }

    let error: string | boolean = false
    const data = await executeHandler(handler, body, (message: string) => {
      error = message
    })

    return Response.json({ error, data })
  }

  return handler
}
