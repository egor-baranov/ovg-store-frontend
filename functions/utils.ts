export const isNotNull = <T>(v: T | null): v is T => v !== null

export const createArray = (length: number) => Array(length).fill("")