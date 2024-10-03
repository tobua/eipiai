export type JsonSerializable = string | number | boolean | null | { [key: string]: JsonSerializable } | JsonSerializable[]
export type Handler = (...args: any[]) => any
export type Methods = { [key: string]: Handler }
export type Body = { method: string; data: JsonSerializable[]; context: JsonSerializable }
