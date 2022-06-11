import jwt from 'jsonwebtoken'
import jwtConfig from '../config/jwt'

export const createToken = (data: string) => jwt.sign({data: data}, jwtConfig.secret, {expiresIn: jwtConfig.ttl})


export const verifyToken = (token: string) => jwt.verify(token, jwtConfig.secret)
