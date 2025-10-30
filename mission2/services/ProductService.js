const BASE_URL = `https://panda-market-api-crud.vercel.app/products`;
// 복사용   ${BASE_URL}

// 1.getProductList() : GET 메소드를 사용해 주세요.
//  ㄴpage, pageSize, keyword 쿼리 파라미터를 이용해 주세요.
export async function getProductList(page, pageSize, keyword) {
  try {
    const response = await fetch(
      `${BASE_URL}?page=${page}&pageSize=${pageSize}&keyword=${keyword}`
    );

    if (!response.ok) {
      throw new Error(`HTTP 오류: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('getProductList 실패:', error.message);
    throw error;
  }
}

// const Product = await getProductList(1, 1, '노트북');
// console.log(`최종 결과는: `, Product);

// 2. getProduct() : GET 메소드를 사용해 주세요.
export async function getProduct(id) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP 오류: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`getProduct 실패..`, error.message);
    throw error;
  }
}

// 3. createProduct() : POST 메소드를 사용해 주세요.
//     ㄴ request body에 name, description, price, tags, images 를 포함해 주세요.
export async function createProduct(name, description, price, tags, images) {
  try {
    const response = await fetch(`${BASE_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        description: description,
        price: price,
        tags: tags,
        images: images,
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP 오류: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('createProduct 실패:', error.message);
    throw error;
  }
}

//4. patchProduct() : PATCH 메소드를 사용해 주세요.
export async function patchProduct(id, name, description, price, tags, images) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        description: description,
        price: price,
        tags: tags,
        images: images,
      }),
    });
    if (!response.ok) {
      throw new Error(
        `HTTP 오류: ${response.status} - 게시글 ID(${id}) 수정 실패`
      );
    }
    if (response.status === 204) {
      return null;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('patchProduct 실패:', error.message);
    throw error;
  }
}

//5.deleteProduct() : DELETE 메소드를 사용해 주세요.

export async function deleteProduct(id) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(
        `HTTP 오류: ${response.status} - 상품 ID(${id}) 삭제 실패`
      );
    }
    // console.log(response);
    // if (response.status === 204) {
    //   return { success: true, message: `상품 ID(${id}) 삭제 완료` };
    // }
    // // 200 OK 등 응답 본문이 있을 경우에만 파싱합니다.
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('deleteProduct 실패:', error.message);
    throw error;
  }
}
