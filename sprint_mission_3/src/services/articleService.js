import { assert } from 'superstruct';
import * as articleRepo from '../repositories/articleRepository.js'

// 1. 게시글 생성
// JS는 파라미터에 {}을 써서 객체로 들어온 데이터를 자동으로 구조 분해 할당을 한다. 그래서 들어온 객체로 데이터중 필요한것만 쓸 수 있다. 
export async function createArticleService({ user, articleData, imageFile }) {
  const imageUrl = imageFile? `/upload/${imageFile.filename}` : null;

  const article = await articleRepo.createArticle({
    ...articleData,
    imageUrl,
    user: { // user모델의 PK가 user.id인 user모델의 PK를 FK로 userId에 넣어라. 
      connect: { id: user.id } // 파라미터로 넘어온 user의 id
    }
  });
  return article;
}

// Router에 설정한 multer객체인 upload를 거치고 나오면 req.file이 생김
// req.file = {
//   fieldname: "image",
//   originalname: "cat.png",
//   mimetype: "image/png",
//   filename: "cat-982383.png",
//   destination: "/root/uploads",
//   path: '/root/uploads/cat-982383.png',
//   size: 123456
// }


// 2. 게시글 수정
export async function updateArticleService({ articleId, user, articleData }) {
  const article = await articleRepo.findArticleById(articleId);

  // article이 없다면
  if (!article) {
    const err = new Error('Article not found');
    err.status = 404;
    throw err;
  }

  // Article 테이블의 id와 로그인 한 유저가 맞는지 확인
  if (article.userId !== user.id) {
    const err = new Error('Forbidden') // 권한 없음
    err.status = 403;
    throw err;
  }

  const updated = await articleRepo.updateArticle(articleId, {
    ...articleData,
    user: {
      connect: { id: user.id }
    }
  });

  return updated;
}

// 3. 게시글 삭제
export async function deleteArticleService({ articleId, user }) {
  const article = await articleRepo.findArticleById(articleId)
  // article에서 가지고 온 article row한번 찍어보자.
  console.log('findArticleById에서 id만 넣고 options만 안넣고 가져온 article row: ', article)

  if (!article) {
    const err = new Error('Article not found')
    err.status = 404;
    throw err;
  }

  if (article.userId !== user.id) {
    const err = new Error('Forbidden')
    err.status = 403;
    throw err;
  }

  const deleted = await articleRepo.deleteArticle(articleId)
  return deleted
}

// const article = { 
//   id: 1,
//   title: '축구선수 이야기',
//   content: '축구',
//   imageUrl: null,
//   createdAt: 2025-12-12T14:34:46.249Z,
//   updatedAt: 2025-12-12T14:34:46.249Z,
//   userId: 1
// }

// 4. 단일 게시글 조회 (likes + comments 포함)
export async function getArticleDetailService(articleId) {
  const article = await articleRepo.findArticleById(articleId, {
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      likes: {
        select: { userId: true },
      },
      comments: {
        select: {
          id: true,
          userId: true,
          content: true,
        }
      }
    }
  });

  if (!article) {
    const err = new Error('Article not found')
    err.status = 404;
    throw err;
  }
  
  return article;
}


// 5. 목록 조회
export async function getArticleListService({ offset=0, limit=10, order='newest', keyword}) {
  // orderBy: 최신순/오래된순으로 정렬
  let orderBy;
  switch(order) {
    case 'oldest':
      orderBy = { createdAt: 'asc'}
      break;
    case 'newest':
      orderBy = { createdAt: 'desc'}
      break;
    default:
      orderBy = { createdAt: 'desc'}
  }

  // where : title에 keyword 포함 OR content에 keyword 포함(대소문자 구분 없이)
  const where = keyword
  ? {
      OR: [
        { title: { contains: keyword, mode: 'insensitive' }},
        { content: { contains: keyword, mode: 'insensitive' }}
      ]
  }
  : undefined;
  
  const articles = await articleRepo.findArticles({
    where,
    orderBy,
    skip: parseInt(offset), // 몇 개 건너뛸지
    take: parseInt(limit), // 몇 개 가져올지 
    select: {
      id: true,
      title: true,
      content: true,
      imageUrl: true,
      createdAt: true,
      updatedAt: true,
      comments: true,
      userId: true
    }
  });

  return articles
}
