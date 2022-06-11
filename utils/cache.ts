import Keyv from 'keyv'

const keyv = new Keyv()

export const setCache = (key: string, value: string, ttl = 0) => keyv.set(key, value, ttl)


export const getCache = (key: string) => keyv.get(key)

export const delCache = (key: string) => keyv.delete(key)