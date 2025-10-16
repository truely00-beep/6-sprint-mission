import {
  getArticle,
  getArticleList,
  createArticle,
  patchArticle,
  deleteArticle,
} from "./services/ArticleService.js";
import {
  getProduct,
  getProductList,
  createProduct,
  patchProduct,
  deleteProduct,
} from "./services/ProductService.js";
import { Article } from "./models/Article.js";
import { Product } from "./models/Product.js";
import { ElectronicProduct } from "./models/ElectronicProduct.js";

//Product Instance Test
async function productInstance() {
  const list = await getProductList();
  const products = list.map((item) => {
    if (item.tags.includes("전자제품")) {
      return new ElectronicProduct(
        item.name,
        item.description,
        item.price,
        item.tags ?? [],
        item.images ?? [],
        item.favoriteCount ?? 0,
        item.manufacturer ?? ""
      );
    } else {
      return new Product(
        item.name,
        item.description,
        item.price,
        item.tags ?? [],
        item.images ?? [],
        item.favoriteCount ?? 0
      );
    }
  });
  console.log(products);
  console.log("Product Instance Test 완료");
}

//Product API CRUD Test
async function testProduct() {
  const getProList = await getProductList(1, 5);
  console.log(getProList);
  console.log("Product List GET 완료");

  let postData = {
    images: ["http://Dopophone.com"],
    tags: ["전자제품"],
    price: 5000,
    description: "위험한 물건",
    name: "대포폰",
  };

  const postPro = await createProduct(postData);
  console.log(postPro);
  console.log("Product POST 완료");

  const getId = await getProduct(postPro.id);
  console.log(getId);
  console.log("Product Id GET 완료");

  let patchData = {
    images: ["http://Dopophone.com"],
    tags: ["불법제품"],
    price: 500000,
    description: "불법 물건",
    name: "머포폰",
  };

  const patchPro = await patchProduct(postPro.id, patchData);
  console.log(patchPro);
  console.log("Product PATCH 완료");

  const deletePro = await deleteProduct(postPro.id);
  console.log(deletePro);
  console.log("Product DELETE 완료");
  console.log("");
  console.log("Product CRUD Test 완료");
  console.log("");
}

//Atricle Instance Test
async function articleInstance() {
  const list = await getArticleList(1, 5);
  const Articles = list.map((item) => {
    return new Article(
      item.title,
      item.content,
      item.writer ?? "익명",
      item.likeCount ?? 0,
      item.createdAt ?? new Date()
    );
  });
  console.log(Articles);
}
