import instance from "../lib/axios.js";

export async function getProductList(page = 1, pageSize = 10, keyword = "") {
  try {
    const res = await instance.get(
      `/products?page=${page}&pageSize=${pageSize}&keyword=${keyword}`
    );
    return res.data.list;
  } catch (err) {
    console.error("서버 요청 실패:", err.message);
    return [];
  }
}

export async function getProduct(id) {
  try {
    const res = await instance.get(`/products/${id}`);
    return res.data;
  } catch (err) {
    console.error("서버 요청 실패:", err.message);
    return [];
  }
}

export async function createProduct(productData) {
  try {
    const res = await instance.post("/products", productData);
    return res.data;
  } catch (err) {
    console.error("서버 요청 실패:", err.message);
    return [];
  }
}

export async function patchProduct(id, patchData) {
  try {
    const res = await instance.patch(`/products/${id}`, patchData);
    return res.data;
  } catch (err) {
    console.error("서버 요청 실패:", err.message);
    return [];
  }
}

export async function deleteProduct(id) {
  try {
    const res = await instance.delete(`/products/${id}`);
    return res.data;
  } catch (err) {
    console.error("서버 요청 실패:", err.message);
    return [];
  }
}
