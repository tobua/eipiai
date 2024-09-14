export type JsonSerializable = string | number | boolean | null | { [key: string]: JsonSerializable } | JsonSerializable[]

// biome-ignore lint/suspicious/noExplicitAny: Required for inference.
export type Methods = { [key: string]: (...args: any[]) => any }

// NOTE for checking types.
// const hello: Methods = {
//   get: () => 1,
//   weird: (id: number) => [1, 2],
//   random: (first: string, second: boolean) => 'What',
// }
