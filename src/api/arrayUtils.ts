import {BaseObject} from "@/type/SharedTypes.ts";

export const toList = <T>(map: Map<string, T>): T[] => {
  return Array.from(map.values())
}

export const toMap = <T extends BaseObject>(obj: T[]): Map<string, T> => {
  const map: Map<string, T> = new Map()
  obj.forEach(m => map.set(m.id, m))
  return map
}

export const filterNullUndefined = <T extends Record<string, any>>(map: Map<string, T>): Map<string, Partial<T>> => {
  const filteredMap: Map<string, Partial<T>> = new Map<string, Partial<T>>();

  for (const [key, value] of map) {
    filteredMap.set(key, filterNullUndefinedObj(value));
  }

  return filteredMap;
}

const filterNullUndefinedObj = <T extends Record<string, any>>(obj: T): Partial<T> => {
  const newObj: Partial<T> = {}
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      newObj[key as keyof T] = value
    }
  })
  return newObj as T
}
