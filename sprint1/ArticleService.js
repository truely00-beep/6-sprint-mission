
// https://panda-market-api-crud.vercel.app/articles

// GET (page, pagesize, keyword)
export async function getArticleList(params = {}) {
  const url = new URL('https://panda-market-api-crud.vercel.app/articles')
  Object.keys(params).forEach((key) => {
    url.searchParams.append(key, params[key])
  })
  const res = await fetch(url)
  
  if (!res.ok) {
    throw new Error("게시글을 찾을 수 없습니다.")
  }
  
  const data = await res.json()
  return data;
}

// GET (id) // 
export async function getArticle(id) {
  const res = await fetch(`https://panda-market-api-crud.vercel.app/articles/${id}`)
  
  if (!res.ok) {
    throw new Error("데이터를 받아올 수 없습니다.")
  } 
  const data = await res.json()
  return data;
}

// POST (request body)
export async function createArticle(articleData) {
  const res = await fetch('https://panda-market-api-crud.vercel.app/articles', {
    method: "POST",
    body: JSON.stringify(articleData),
    headers: {
      "Content-Type" : "application/json"
    }
  })
  
  if (!res.ok) {
    const text = await res.text()
    console.log(text)
    throw new Error("데이터를 받아올 수 없습니다.")
  }
  console.log(res.status)
  const data = await res.json()
  return data;
}

// PATCH (id, request body)
export async function patchArticle(id, patchData) {
  const res = await fetch(`https://panda-market-api-crud.vercel.app/articles/${id}`, {
    method: "PATCH",
    body: JSON.stringify(patchData),
    headers: {
      "Content-Type" : "application/json"
    }
  })
  if (!res.ok) {
    console.log(res.status)
    throw new Error("데이터를 받아올 수 없습니다.")
  }
  const data = await res.json()
  return data;
}

// DELETE (id) / 비밀번호 따로 필요 없더라 그냥 id값만 입력하더라.
export async function deleteArticle(id) {
  const res = await fetch(`https://panda-market-api-crud.vercel.app/articles/${id}`, {
    method: "DELETE"
  })
  if (!res.ok) {
    throw new Error("데이터를 받아올 수 없습니다.")
  }
  const data = await res.json()
  return data;
}

