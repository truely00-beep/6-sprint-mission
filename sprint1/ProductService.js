
// https://panda-market-api-crud.vercel.app/products

// GET (page, pageSize, keyword)
export async function getProductList(params={}) {
  const url = new URL('https://panda-market-api-crud.vercel.app/products')
  Object.keys(params).forEach((key) => {
    url.searchParams.append(key, params[key])
  })
  const res = await fetch(url)
  
  if (!res.ok) {
    console.log("데이터를 불러올 수 없습니다.")
  }
  const data = await res.json()
  return data;
}


// GET (id)
export async function getProduct(id) {
  const res = await fetch(`https://panda-market-api-crud.vercel.app/products/${id}`)
  
  if (!res.ok) {
    console.log("데이터를 불러올 수 없습니다.")
  }
  const data = await res.json()
  return data;
}

// POST (name, description, price, tags, images)
export async function createProduct(productData) {
  const res = await fetch('https://panda-market-api-crud.vercel.app/products', {
    method: "POST",
    body: JSON.stringify(productData),
    headers: {
      "Content-Type": "application/json"
    }
  })
  if (!res.ok) {
    const text = await res.text()
    console.log(text) // 오류시 내용을 출력해보자. 
    console.log("데이터를 불러올 수 없습니다.")
  }
  const data = await res.json()
  return data;
}

// PATCH (id, name, description, price, tags, images)
export async function patchProduct(id, patchData) {
  const res = await fetch(`https://panda-market-api-crud.vercel.app/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(patchData),
    headers: {
      "Content-Type" : "application/json"
    }
  })
  if (!res.ok) {
    console.log("데이터를 불러올 수 없습니다.")
  }
  const data = await res.json()
  return data;
}

// DELETE (id)
export async function deleteProduct(id) {
  const res = await fetch(`https://panda-market-api-crud.vercel.app/products/${id}`, {
    method: "DELETE"
  })
  if (!res.ok) {
    console.log("데이터를 불러올 수 없습니다.")
  }
  const data = await res.json()
  return data;
}