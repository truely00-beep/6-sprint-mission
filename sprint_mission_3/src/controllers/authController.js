// register, login, refreshToken, logout
import { prisma } from '../lib/prismaClient.js';
import bcrypt from 'bcrypt'
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { generateTokens, verifyRefreshToken } from "../lib/token.js";
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
  NODE_ENV
} from '../lib/constants.js'
import { assert } from 'superstruct';
import { CreateUser } from '../struct.js';


// 회원가입 (토큰 전달 X)
export const register = asyncHandler(async(req, res) => {
  assert( req.body, CreateUser) // 이부분 새로 추가
  const { email, nickname, password } = req.body;
  
  const salt = await bcrypt.genSalt(10) //salt 생성
  const hashedPassword = await bcrypt.hash(password, salt)
  const user = await prisma.user.create({
    data: {
      email,
      nickname,
      password: hashedPassword
    }
  })
  const { password:_, ...userWithoutPassword } = user
  res.status(201).json(userWithoutPassword)
})

// 로그인 (Set-Cookies에 토큰 넣어서 브라우저에게 전달)
export const login = asyncHandler(async(req, res) => {
  const { email, password } = req.body;
  
  const user = await prisma.user.findUnique({ where: { email }})
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials'})
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }
  
  const { accessToken, refreshToken } = generateTokens(user.id)
  setTokenCookies(res, accessToken, refreshToken);
  res.status(200).send();  
})


//refresh 토큰을 이용하여 access_token 발급받기
export const refreshToken = asyncHandler(async(req, res) => {
  // console.log(req.headers.cookies)
  const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME] //refresh 토큰 꺼냄
  // console.log("refreshToken: ", refreshToken)
  if (!refreshToken) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const { userId } = verifyRefreshToken(refreshToken) //payload의 userId가 return 됨

  const user = await prisma.user.findUnique({ where: { id: userId }})
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const { accessToken, refreshToken:newRefreshToken } = generateTokens(user.id)
  
  setTokenCookies(res, accessToken, newRefreshToken)
  res.status(200).send()
})

// 로그아웃
export const logout = asyncHandler(async(req, res) => {
  clearTokenCookies(res)
  res.status(200).send()
})


// res.cookie()는 응답헤더에 Set-Cookie를 추가하는 작업만 한다(전달x)
const setTokenCookies = (res, accessToken, refreshToken) => {
  res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    maxAge: 20 * 60 * 60 * 1000
  })
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/auth/refresh'
  })
}

// res.clearCookie()도 응답헤더에 Set-Cookie를 추가하는 작업인데 여기서는
// 토큰의 만료기간을 1970년대로 돌린다. 그래서 이전에 만들어준 refresh토큰을 1970년대로 돌려야하기 때문에
// refresh 토큰을 생성했던 곳에 있는 refresh 토큰을 만료 시켜야되는 것이다.
const clearTokenCookies = (res) => {
  res.clearCookie(ACCESS_TOKEN_COOKIE_NAME)
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME , {
    path: '/auth/refresh'
  })
}