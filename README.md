# 스프린트 미션 4

1. **토큰과 쿠키를 활용한 인증 인가\_** 구현
2. **유저 모델과 유저API, 좋아요기능** 구현
3. **에러핸들러** 구현
4. **리프레쉬 토큰을 활용한 JWT슬라이딩 세션** 구현

---

- 디렉토리 새롭게 재구성
- 기존의 미흡한 코드 개선 및 수정
- 유효성 검증 강화

---

```
[디렉토리 구조]

6-sprint-mission

├─ **http**/
│ ├─ article.http
│ ├─ comment.http
│ ├─ product.http
│ └─ user.http
├─ .github/
├─ mission-2/
├─ prisma/
│ ├─ migrations/
│ └─ schema.prisma
├─ src/
│ ├─ controller/
│ │ ├─ articleController.js
│ │ ├─ commentController.js
│ │ ├─ imageController.js
│ │ ├─ productController.js
│ │ └─ userController.js
│ ├─ lib/
│ │ ├─ asyncHandler.js
│ │ ├─ constants.js
│ │ ├─ error.js
│ │ └─ prismaClient.js
│ ├─ middlewares/
│ │ ├─ errorHandler/
│ │ │ └─ errorHandler.js
│ │ ├─ validate/
│ │ │ ├─ validateArticle.js
│ │ │ ├─ validateComment.js
│ │ │ ├─ validateId.js
│ │ │ ├─ validateProduct.js
│ │ │ └─ validateUser.js
│ │ └─ auth.js
│ ├─ router/
│ │ ├─ articleRouter.js
│ │ ├─ commentRouter.js
│ │ ├─ imageRouter.js
│ │ ├─ productRouter.js
│ │ └─ userRouter.js
│ ├─ seed/
│ │ ├─ mock.js
│ │ └─ seed.js
│ ├─ service/
│ │ └─ userService.js
│ └─ server.js
│ └─ uploads.js
├─ uploads/
├─ .env.sample
├─ .gitignore
├─ .prettierrc
├─ package-lock.json
├─ package.json
└─ README.md
```

```

### 실행방법

```

npm install
npx prisma migrate dev
npm run dev

```

### 테스트 방법

```

RESTClient 설치
**http** 디렉토리 활용

```

---

#### 작성자 정보

이름 : 오윤

이메일 : passfile2@naver.com

제출일 : 2025-11-26
```
