import jwt from 'jsonwebtoken'
import { 
  JWT_ACCESS_TOKEN_SECRET ,
  JWT_REFRESH_TOKEN_SECRET
} from './constants.js'

export const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: "20h",
  })
  const refreshToken = jwt.sign({ id: userId }, JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: "1d"
  })
  return { accessToken, refreshToken }
}

export const verifyAccessToken = (token) => {
  const decoded = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET)
  return { userId: decoded.id }
}

export const verifyRefreshToken = (token) => {
  const decoded = jwt.verify(token, JWT_REFRESH_TOKEN_SECRET)
  return { userId: decoded.id }
}