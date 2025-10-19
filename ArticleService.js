const BASE_URL = 'https://panda-market-api-crud.vercel.app/articles';

// Article 리스트 조회
export function getArticleList(page = 1, pageSize = 10, keyword = '') {
  return fetch(
    `${BASE_URL}?page=${page}&pageSize=${pageSize}&keyword=${keyword}`
  )
    .then((res) => {
      if (!res.ok) throw new Error('Failed to fetch article list');
      return res.json();
    })
    .catch((err) => console.error(err.message));
}

// 단일 Article 조회
export function getArticle(id) {
  return fetch(`${BASE_URL}/${id}`)
    .then((res) => {
      if (!res.ok) throw new Error('Failed to fetch article');
      return res.json();
    })
    .catch((err) => console.error(err.message));
}

// Article 생성
export function createArticle({ title, content, image }) {
  return fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content, image }),
  })
    .then((res) => {
      if (!res.ok) throw new Error('Failed to create article');
      return res.json();
    })
    .catch((err) => console.error(err.message));
}

// Article 수정
export function patchArticle(id, data) {
  return fetch(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
    .then((res) => {
      if (!res.ok) throw new Error('Failed to patch article');
      return res.json();
    })
    .catch((err) => console.error(err.message));
}

// Article 삭제
export function deleteArticle(id) {
  return fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  })
    .then((res) => {
      if (!res.ok) throw new Error('Failed to delete article');
      return res.json();
    })
    .catch((err) => console.error(err.message));
}
