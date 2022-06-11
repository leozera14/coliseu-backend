import { verifyToken } from '../utils/jwt'
import { Request, Response, NextFunction } from "express";
import { getCache } from '../utils/cache'

const authMiddleware = async (req: Request, res: Response, next:NextFunction) => {
  try {
    let token = req.headers.authorization
    if  (token && token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }

    if (token) {
      try {
        token = token.trim()

        const isBlackListed = await getCache(token)

        if(isBlackListed) {
          return res.status(401).json({error: 'Unauthorized!'})
        }

        const decoded = verifyToken(token)
        req.body.user = decoded;
        req.body.token = token;
        next()
      } catch (error) {
        return res.status(401).json({error: 'Unauthorized!'})
      }
    }

    return res.status(401).json({error: 'Unauthorized'})
  } catch (error) {
    return res.status(400).json({error: 'Authorization header is missing'})
  }
}

export default authMiddleware