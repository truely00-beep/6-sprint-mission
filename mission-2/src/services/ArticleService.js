const url = "https://panda-market-api-crud.vercel.app/articles";

export function getArticleList(page = 1, pageSize = 10, keyword = "") {
  return fetch(`${url}?page=${page}&pageSize=${pageSize}&keyword=${keyword}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error("서버 요청 실패");
      }
      return res.json();
    })
    .then((data) => data.list)
    .catch((err) => console.error(err.message));
}

export function getArticle(id) {
  return fetch(`${url}/${id}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error("서버 요청 실패");
      }
      return res.json();
    })
    .then((data) => data)
    .catch((err) => {
      console.error(err.message);
    });
}

export function createArticle(articleData) {
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(articleData),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("서버 요청 실패");
      }
      return res.json();
    })
    .then((data) => data)
    .catch((err) => console.error(err.message));
}

export function patchArticle(id, patchData) {
  return fetch(`${url}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(patchData),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("서버 요청 실패");
      }
      return res.json();
    })
    .then((data) => data)
    .catch((err) => console.error(err.message));
}

export function deleteArticle(id) {
  return fetch(`${url}/${id}`, {
    method: "DELETE",
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("서버 요청 실패");
      }
      return res.json();
    })
    .then((data) => data)
    .catch((err) => console.error(err.message));
}
