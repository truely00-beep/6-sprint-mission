import * as userRepo from '../repositories/userRepository.js';
import bcrypt from 'bcrypt';


/**
 * 내 정보 조회
 */
export async function getMyUserService(userId) {
  const user = await userRepo.findUserById(userId, {
    select: {
      email: true,
      nickname: true,
      products: true,
      articles: true,
      comments: true,
    }
  });

  if (!user) {
    const err = new Error('User not found')
    err.status = 404;
    throw err;
  }

  return user;
}


/**
 * 내 정보 수정
 */
export async function updateMyUserService({ userId, userData }) {
  console.log('userId는: ', userId)
  console.log('그냥 userData는: ', userData) // { nickname: "철수", email: "charles@gmail.com" }
  console.log('그냥 spread userData: ', {...userData })
  const user = await userRepo.updateUserById(
    userId,
    { ...userData }, // 중괄호를 했기 때문에 사실상 값은 그대로다. spread했으면 양 끝에 중괄호 하나씩 빠지는게 맞고
    {
      select: {
        email: true,
        nickname: true
      }
    }
  )

  return user;
}

//객체 분해 할당 예시
// const payload = {
//   userData: { nickname: "철수", email: "charles@gmail.com" }
// };

// const { userData } = payload;

// console.log(userData); // { nickname: "철수", email: "charles@gmail.com" }


/**
 * 비밀번호 변경
 */
export async function updatePasswordService({ userId, password }) {
  const hashedPassword = await hashPassword(password);

  await userRepo.updateUserById(userId, {
    password: hashedPassword
  });

  return;
}


/**
 * 내가 등록한 상품 목록 조회
 */
export async function getMyProductsService(userId) {
  const user = await userRepo.findUserById(userId, {
    select: {
      products: {
        select: {
          name: true,
          description: true,
          price: true
        }
      }
    }
  })
  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }

  return user.products
}


// 내부 유틸 함수
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}