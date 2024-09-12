// biome-ignore lint/complexity/noBannedTypes: Improve TODO
export function api(method: { [key: string]: Function }) {
  return method
}

export function client<T extends ReturnType<typeof api>>(): T {
  return new Proxy({} as T, {
    get(_target, route: string) {
      return async (...args: (string | number)[]) => {
        try {
          const response = await fetch('http://localhost:3001/api', {
            method: 'POST',
            body: JSON.stringify({ method: route, data: args }),
            headers: {
              'Content-Type': 'application/json',
            },
          })

          return await response.json()
        } catch (_error) {
          return { error: true }
        }
      }
    },
  })
}
