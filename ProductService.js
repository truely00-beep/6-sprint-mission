import { Product, ElectronicProduct } from './models.js';

const BASE_URL = 'https://panda-market-api-crud.vercel.app/products';

// Product 리스트 조회
export async function getProductList(page = 1, pageSize = 10, keyword = '') {
  try {
    const res = await fetch(
      `${BASE_URL}?page=${page}&pageSize=${pageSize}&keyword=${keyword}`
    );
    if (!res.ok) throw new Error('Failed to fetch product list');
    const data = await res.json();

    const products = data.items.map((item) => {
      if (item.tags.includes('전자제품')) {
        return new ElectronicProduct(
          item.name,
          item.description,
          item.price,
          item.tags,
          item.images,
          item.favoriteCount,
          item.manufacturer || 'Unknown'
        );
      } else {
        return new Product(
          item.name,
          item.description,
          item.price,
          item.tags,
          item.images,
          item.favoriteCount
        );
      }
    });

    return products;
  } catch (err) {
    console.error(err.message);
    return [];
  }
}

//  Product 조회
export async function getProduct(id) {
  try {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error('Failed to fetch product');
    return await res.json();
  } catch (err) {
    console.error(err.message);
  }
}

// Product 생성
export async function createProduct({
  name,
  description,
  price,
  tags,
  images,
}) {
  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, price, tags, images }),
    });
    if (!res.ok) throw new Error('Failed to create product');
    return await res.json();
  } catch (err) {
    console.error(err.message);
  }
}

// Product 수정
export async function patchProduct(id, data) {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to patch product');
    return await res.json();
  } catch (err) {
    console.error(err.message);
  }
}

// Product 삭제
export async function deleteProduct(id) {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete product');
    return await res.json();
  } catch (err) {
    console.error(err.message);
  }
}
