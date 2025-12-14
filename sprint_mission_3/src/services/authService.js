import * as authRepo from '../repositories/authRepository.js'
import bcrypt from 'bcrypt'
import { generateTokens, verifyRefreshToken } from "../lib/token.js";

/**
 * 회원가입
 */
export async function registerUserService({ email, nickname, password }) {
  // 1. 이메일 중복 체크
  const existingUser = await authRepo.findUserByEmail(email);
  if (existingUser) {
    // 에러 객체 생성
    const err = new Error('Email already exists~~');
    // 메타 정보를 에러 객체에 붙임 
    err.status = 409;
    throw err;
  }

  // 2. 비밀번호 해싱
  const salt = await bcrypt.genSalt(10) // salt 생성
  const hashedPassword = await bcrypt.hash(password, salt)
  
  // 3. 유저 생성
  const user = await authRepo.createUser({
    email,
    nickname,
    password: hashedPassword
  });

  // 4. password 제거 후 반환
  const { password: _, ...userWithoutPassword } = user; // 객체 분해 할당
  // 밑에 차례대로 출력해보자.
  console.log('user: ', user)
  console.log('_: ', _)
  console.log('userWithoutPassword: ', userWithoutPassword)
  return userWithoutPassword
}


/**
 * 로그인
 */
export async function loginUserService({ email, password }) {
  // 1. email이 DB에 있는지 확인
  const user = await authRepo.findUserByEmail(email);
  // user에 들어온 email의 row데이터가 들어간다.
  if (!user) {
    const err = new Error('Invalid credentials')
    err.status = 401;
    console.log('email이 잘못됨: ', err)
    throw err;
  }

  // 2. 비밀번호 체크 (들어온 비밀번호를 해싱해서 DB에 있는 hashedPassword와 비교)
  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    console.log('비밀번호가 틀림: ', err)
    throw err;
  }

  // 3. 토큰 생성 
  const { accessToken, refreshToken } = generateTokens(user.id);
  // 이건 JS 문법상 “함수의 return 값을 바로 구조 분해”
  // console.log('service의 accessToken: ', accessToken)
  // console.log('service의 refreshToken: ', refreshToken)

  // 4. 토큰 반환 (Controller에게 반환)
  return { accessToken, refreshToken};
}


/**
 * refreshToken으로 accessToken 발급 받기
 */
export async function refreshAccessTokenService(refreshToken) {
  // 1) refreshToken 존재 여부
  if (!refreshToken) {
    const err = new Error('Unauthorized')
    err.status = 401;
    throw err; //asyncHandler의 catch(e)가 잡아서 errorHandler로 보낸다.
  }

  // 2) refreshToken 검증 (서명/만료/위조 등)
  // verifyRefreshToken이 실패하면 throw할 것이고 asyncHandler가 잡아줌
  const { userId } = verifyRefreshToken(refreshToken)
  // 이 refresh토큰을 가지고 있는 즉, 이전에 로그인 했던 유저 확인 가능

  // 3) 유저 존재 확인
  const user = await authRepo.findUserById(userId);
  if (!user) {
    const err = new Error('Unauthorized');
    err.status = 401;
    throw err;
  }

  // 4) 새 토큰 발급
  const { accessToken, refreshToken: newRefreshToken } = generateTokens(user.id)

  // constroller가 쿠키로 세팅하도록 토큰만 반환
  return { accessToken, refreshToken: newRefreshToken };
}



