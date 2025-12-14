import { prisma } from '../lib/prismaClient.js'

// DB에 작업을 요청하고 → 그 결과를 Promise로 반환 →
// 이 함수를 호출한 쪽(service)으로 그대로 전달하는거다.

export function createArticle(data) {
  // data: { 파라미터로 들어온 객체 }
  // console.log('1) data만 찍기:', data);
  // console.log('2) prisma에 넘기는 전체 객체 찍기:', { data }); 
  return prisma.article.create({ data }) // key값을 data로 하고 축약된값 원래는 {data: data(파라미터)}
}

// 1) data만 찍기: {
//   title: '축구선수 이야기',
//   content: '축구',
//   imageUrl: null,
//   user: { connect: { id: 1 } }
// }

// 2) prisma에 넘기는 전체 객체 찍기: {
//   data: {
//     title: '축구선수 이야기',
//     content: '축구',
//     imageUrl: null,
//     user: { connect: [Object] }
//   }

// 이게 prisma가 원하는 형태
// prisma.article.create({
//   data: { /* ArticleCreateInput */ }
// });


// 호출할 때 아무 인자를 안 넣으면 options는 {}로 설정됨
export function findArticleById(id, options = {}) {
  return prisma.article.findUnique({
    where: { id: Number(id)},
    ...options // ...options는 객체라면 중괄호 풀고 들어옴 
  }); // options에 값이 없으면 ...{} 펼칠 게 없기 때문에 아무 변화도 일어나지 않는다.
}

export function updateArticle(id, data) {
  return prisma.article.update({
    where: { id: Number(id)},
    data //여기도 {data}라서 위에서와 같이 {data: {}} 이런식인가?
  });
}

export function deleteArticle(id) {
  return prisma.article.delete({
    where: { id: Number(id) }
  });
}

export function findArticles(options = {}) {
  return prisma.article.findMany(options)
}