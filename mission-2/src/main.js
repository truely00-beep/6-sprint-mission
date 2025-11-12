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
  const list = await getProductList(1, 2);
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
  products[0].favorite();
  products[0].favorite();
  products[0].favorite();
  console.log(products[0].name);
  console.log(products[0].favoriteCount);
  console.log("Product Instance 완료");
  console.log("");
}

//Product API CRUD Test
async function testProduct() {
  const getProList = await getProductList(1, 2);
  console.log(getProList);

  let postData = {
    images: ["http://Dopophone.com"],
    tags: ["전자제품"],
    price: 5000,
    description: "위험한 물건",
    name: "대포폰",
  };

  const postPro = await createProduct(postData);
  console.log(postPro);

  const getProId = await getProduct(postPro.id);
  console.log(getProId);

  let patchData = {
    images: ["http://Dopophone.com"],
    tags: ["불법제품"],
    price: 500000,
    description: "불법 물건",
    name: "머포폰",
  };

  const patchPro = await patchProduct(postPro.id, patchData);
  console.log(patchPro);

  const deletePro = await deleteProduct(postPro.id);
  console.log(deletePro);
  console.log("Product CRUD Test 완료");
  console.log("");
}

//Atricle Instance Test
async function articleInstance() {
  const list = await getArticleList(1, 2);
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
  Articles[0].like();
  Articles[0].like();
  Articles[0].like();
  console.log(Articles[0].title);
  console.log(Articles[0].likeCount);
  console.log("Atricle Instance 완료");
  console.log("");
}

//Article API CRUD Test
async function testArticle() {
  const getArtList = await getArticleList(1, 2);
  console.log(getArtList);

  let articleData = {
    image: "http://Depophone.com",
    content: "대포폰 이야기 입니다.",
    title: "대포폰",
  };

  const postArt = await createArticle(articleData);
  console.log(postArt);

  const getIdArt = await getArticle(postArt.id);
  console.log(getIdArt);

  let patchData = {
    image: "http://Mopophone.com",
    content: "머포폰 이야기 입니다.",
    title: "머포폰",
  };

  const patchArt = await patchArticle(postArt.id, patchData);
  console.log(patchArt);

  const deleteArt = await deleteArticle(postArt.id);
  console.log(deleteArt);
  console.log("Atricle CRUD Test 완료");
  console.log("");
}

// 전체 Test
async function allTest() {
  await productInstance();
  await testProduct();
  await articleInstance();
  await testArticle();
  console.log("");
  console.log("전체 Test 완료");
}
