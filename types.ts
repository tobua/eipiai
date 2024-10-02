export type JsonSerializable = string | number | boolean | null | { [key: string]: JsonSerializable } | JsonSerializable[]

export type Methods = { [key: string]: (...args: any[]) => any }

// NOTE for checking types.
// const hello: Methods = {
//   get: () => 1,
//   weird: (id: number) => [1, 2],
//   random: (first: string, second: boolean) => 'What',
// }

export type Body = { method: string; data: string | number[]; context: JsonSerializable }
