import { Product } from "./class/Product.js";
import { ElectronicProduct } from "./ElectronicProduct.js";
import { Article } from "./class/Article.js";
import * as ArticleService from "./services/ArticleService.js";
import * as ProductService from "./services/ProductService.js";

async function main() {
  try {
    // Article
    // 1. getArticleList() : GET 메소드를 사용해 주세요.
    const articleList = await ArticleService.getArticleList(1, 1, "");
    console.log("===getArticleList 시작===");
    console.log(articleList);
    console.log("===getArticleList 끝===");

    // 2. getArticle() : GET 메소드를 사용해 주세요.
    const article = await ArticleService.getArticle(4963);
    console.log("===getArticle 시작===");
    console.log(article);
    console.log("===getArticle 끝===");

    // 3. createArticle() : POST 메소드를 사용해 주세요.
    const postArticleResponse = await ArticleService.createArticle(
      "추석",
      "잘보내셨나요",
      "https://example.com/..."
    );
    console.log("===createArticle 시작===");
    console.log(postArticleResponse);
    console.log("===createArticle 끝===");

    // 4. patchArticle() : PATCH 메소드를 사용해 주세요.
    const patchArticleResponse = await ArticleService.patchArticle(
      postArticleResponse.id,
      "즐거운 추석",
      "잘보내셨나요?",
      postArticleResponse.image
    );
    console.log("===patchArticle 시작===");
    console.log(patchArticleResponse);
    console.log("===patchArticle 끝===");

    // 5. deleteArticle() : DELETE 메소드를 사용해 주세요.
    const deleteArticleResponse = await ArticleService.deleteArticle(
      postArticleResponse.id
    );
    console.log("===deleteArticle 시작===");
    console.log(deleteArticleResponse);
    console.log("===deleteArticle 끝===");

    // 6. 새로운 객체가 생성되어 constructor가 호출될 시 createdAt에 현재 시간을 저장합니다.
    const newArticle = new Article("타이틀", "콘텐츠", "작성자", 0);
    console.log("===newArticle 시작===");
    console.log(newArticle);
    newArticle.like();
    console.log(newArticle);

    console.log("===newArticle 끝===");

    // =========Product============
    // 1. getProductList() : GET 메소드를 사용해 주세요.
    const productsData = await ProductService.getProductList(1, 3, "전자제품");
    console.log("===getProductList 시작===");
    console.log(productsData);
    console.log("===getProductList 끝===");

    // 2. getProduct() : GET 메소드를 사용해 주세요.
    const product = await ProductService.getProduct(2478);
    console.log("===getProduct 시작===");
    console.log(product);
    console.log("===product 끝===");

    // 3. createProduct() : POST 메소드를 사용해 주세요.
    const postProductResponse = await ProductService.createProduct(
      "갤럭시 V9",
      "삼성우승기념폰",
      999999,
      ["#삼성라이온즈", "#이재현빼뱀", "#끝내기만루홍라런"],
      ["https://example.com/..."]
    );
    console.log("===createProduct 시작===");
    console.log(postProductResponse);
    console.log("===createProduct 끝===");

    // 4. patchProduct() : PATCH 메소드를 사용해 주세요.
    const patchProductResponse = await ProductService.patchProduct(
      postProductResponse.id,
      postProductResponse.name,
      postProductResponse.description,
      Math.round(postProductResponse.price * 0.9),
      postProductResponse.tags,
      postProductResponse.images
    );
    console.log("===patchProduct 시작===");
    console.log(patchProductResponse);
    console.log("===patchProduct 끝===");

    // 5. deleteProduct() : DELETE 메소드를 사용해 주세요.
    const deleteProductResponse = await ProductService.deleteProduct(
      patchProductResponse.id
    );
    console.log("===deleteProduct 시작===");
    console.log(deleteProductResponse);
    console.log("===deleteProduct 끝===");

    // 6. getProductList()를 통해서 받아온 상품 리스트를 각각 인스턴스로 만들어 products 배열에 저장해 주세요.
    // 해시태그에 "전자제품"이 포함되어 있는 상품들은 Product 클래스 대신 ElectronicProduct 클래스를 사용해 인스턴스를 생성해 주세요.
    // 나머지 상품들은 모두 Product 클래스를 사용해 인스턴스를 생성해 주세요.
    const productList = productsData.list;
    const products = productList.map((item) => {
      // 해시태그에 "전자제품"이 포함되어 있는지 확인
      const isElectronic = item.tags && item.tags.includes("전자제품");

      // 조건에 따라 다른 클래스로 인스턴스 생성
      if (isElectronic) {
        // ElectronicProduct 클래스에 맞는 인자를 전달
        return new ElectronicProduct(
          item.name,
          item.description,
          item.price,
          item.tags,
          item.images,
          item.favoriteCount,
          // API 응답에 manufacturer가 있다면 추가
          item.manufacturer
        );
      } else {
        // Product 클래스에 맞는 인자를 전달
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

    console.log("===products 시작===");
    console.log(products);
    console.log("===products 끝===");
  } catch (error) {
    console.error("미션 실행 중 오류 발생:", error);
  }
}

// main 함수 호출
main();
