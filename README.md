# 스프린트 미션2 - API 통신 및 OOP

## 📋 프로젝트 개요

코드잇 스프린트 미션 2 - API 통신 및 OOP 개념 이해

## 🚀 주요 기능

- **Article API**: 게시글 CRUD (Promise 기반)
- **Product API**: 상품 CRUD (Async/Await 기반)
- **OOP 클래스 설계**: Product, ElectronicProduct, Article 클래스 구현
- **데이터 모델링**: API 응답을 객체 인스턴스로 변환

## 📁 프로젝트 구조

```
/project-root
├─ lib/
│  ├─ ArticleService.js   # Article API 통신 함수 (Promise/then/catch)
│  └─ ProductService.js   # Product API 통신 함수 (async/await)
└─ main.js                # 메인 실행 파일 (클래스 정의 및 테스트)
└─ README.md              # 프로젝트 설명
```

## 📌 주요 클래스

### Product 클래스

- **속성**: name, description, price, tags, images, favoriteCount
- **메서드**: `favorite()` - 찜하기 수 증가

### ElectronicProduct 클래스

- Product 클래스 상속
- **추가 속성**: manufacturer (제조사)

### Article 클래스

- **속성**: title, content, writer, likeCount, createdAt
- **메서드**: `like()` - 좋아요 수 증가

## 🔍 API 함수

### Article API (Promise 기반)

```javascript
getArticleList(); // 목록 조회
getArticle(id); // 단일 조회
createArticle(); // 생성
patchArticle(id); // 수정
deleteArticle(id); // 삭제
```

### Product API (Async/Await 기반)

```javascript
getProductList(); // 목록 조회
getProduct(id); // 단일 조회
createProduct(); // 생성
patchProduct(id); // 수정
deleteProduct(id); // 삭제
```

## 💡 핵심 구현 사항

1. **비동기 처리 패턴**

   - Article: Promise chain (`.then()/.catch()`)
   - Product: Async/Await (`try/catch`)

2. **다형성 구현**

   - 태그에 "전자제품" 포함 → `ElectronicProduct` 인스턴스
   - 그 외 → `Product` 인스턴스

3. **에러 처리**
   - HTTP 상태 코드 검증 (2XX가 아닌 경우 에러)
   - 다층 에러 처리 구조

## 🌐 API 문서

- [Panda Market API Documentation](https://panda-market-api-crud.vercel.app/docs)
