// main.js - 이외의 코드들은 모두 main.js 파일에 작성해 주세요.

// import를 활용해 주세요.
import {
  getArticleList,
  getArticle,
  createArticle,
  patchArticle,
  deleteArticle,
} from "./lib/ArticleService.js";

import {
  getProductList,
  getProduct,
  createProduct,
  patchProduct,
  deleteProduct,
} from "./lib/ProductService.js";

// ========== 클래스 구현하기 ==========

// Product 클래스
// name(상품명) description(상품 설명), price(판매 가격), tags(해시태그 배열),
// images(이미지 배열), favoriteCount(찜하기 수) 프로퍼티를 가집니다.
class Product {
  constructor(
    name,
    description,
    price,
    tags = [],
    images = [],
    favoriteCount = 0
  ) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.tags = tags;
    this.images = images;
    this.favoriteCount = favoriteCount;
  }

  // favorite 메소드를 가집니다. favorite 메소드가 호출될 경우 찜하기 수가 1 증가합니다.
  favorite() {
    this.favoriteCount++;
  }
}

// ElectronicProduct 클래스는 Product를 상속하며, 추가로 manufacturer(제조사) 프로퍼티를 가집니다.
class ElectronicProduct extends Product {
  constructor(
    name,
    description,
    price,
    tags = [],
    images = [],
    favoriteCount = 0,
    manufacturer = ""
  ) {
    super(name, description, price, tags, images, favoriteCount);
    this.manufacturer = manufacturer;
  }
}

// Article 클래스
// title(제목), content(내용), writer(작성자), likeCount(좋아요 수) 프로퍼티를 가집니다.
// Article 클래스에 createdAt(생성일자) 프로퍼티를 만들어 주세요. (심화)
class Article {
  constructor(title, content, writer, likeCount = 0) {
    this.title = title;
    this.content = content;
    this.writer = writer;
    this.likeCount = likeCount;
    // 새로운 객체가 생성되어 constructor가 호출될 시 createdAt에 현재 시간을 저장합니다.
    this.createdAt = new Date();
  }

  // like 메소드를 가집니다. like 메소드가 호출될 경우 좋아요 수가 1 증가합니다.
  like() {
    this.likeCount++;
  }
}

// ========== 유틸리티 함수 ==========

// 시간 포맷팅 함수
function formatDateTime(dateString) {
  if (!dateString) return "시간정보 없음";
  const date = new Date(dateString);
  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

// 대기 함수 (수정 전후 시간 차이를 만들기 위함)
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ========== 실행 및 테스트 코드 ==========

// products 배열 선언
let products = [];

async function testProductAPIs() {
  console.log("\n========== Product API 테스트 시작 ==========");

  try {
    // 1. Product 목록 조회
    console.log("\n1. Product 목록 조회");
    const productList = await getProductList({ page: 1, pageSize: 10 });
    console.log(">> Product 목록:", productList.list?.length, "개 조회 완료");

    // 조회된 Product 목록 간략히 출력
    if (productList.list && productList.list.length > 0) {
      console.log("--- 조회된 Product 목록 ---");
      productList.list.forEach((product, index) => {
        const tags =
          product.tags && product.tags.length > 0
            ? product.tags.join(", ")
            : "태그없음";
        console.log(
          `  ${index + 1}. [ID: ${product.id}] ${product.name} - ₩${
            product.price?.toLocaleString() || 0
          } (태그: ${tags}, 찜: ${product.favoriteCount || 0})`
        );
      });
    }

    // 해시태그에 "전자제품"이 포함되어 있는 상품들은 ElectronicProduct 클래스 사용
    // 나머지 상품들은 모두 Product 클래스를 사용
    products = productList.list.map((item) => {
      const isElectronic = item.tags && item.tags.includes("전자제품");

      if (isElectronic) {
        return new ElectronicProduct(
          item.name,
          item.description,
          item.price,
          item.tags,
          item.images,
          item.favoriteCount || 0,
          "미상" // API에서 제조사 정보가 없으므로 기본값 설정
        );
      } else {
        return new Product(
          item.name,
          item.description,
          item.price,
          item.tags,
          item.images,
          item.favoriteCount || 0
        );
      }
    });

    console.log("\n>> Product 인스턴스 배열 생성 완료:", products.length, "개");
    // console.log(products);

    // 생성된 인스턴스 목록 간략히 출력
    if (products.length > 0) {
      console.log("--- 생성된 Product 인스턴스 목록 ---");
      products.forEach((product, index) => {
        const type =
          product instanceof ElectronicProduct ? "전자제품" : "일반제품";
        console.log(
          `  ${index + 1}. [${type}] ${product.name} - ₩${
            product.price?.toLocaleString() || 0
          }`
        );
      });
    }

    // 전자제품과 일반 제품 구분 확인
    const electronicProducts = products.filter(
      (p) => p instanceof ElectronicProduct
    );
    const normalProducts = products.filter(
      (p) => !(p instanceof ElectronicProduct)
    );
    console.log("\n전자제품:", electronicProducts.length, "개");
    console.log("일반 제품:", normalProducts.length, "개");

    // 2. Product 생성
    console.log("\n2. Product 생성");
    const newProduct = await createProduct({
      name: "테스트 상품",
      description: "스프린트 미션2 테스트 상품임",
      price: 1000000,
      tags: ["테스트", "미션"],
      images: ["https://example.com/sprint1.jpg"],
    });

    console.log("생성된 Product ID:", newProduct.id);

    // 3. Product 단일 조회
    console.log("\n3. Product 단일 조회");
    const product = await getProduct(newProduct.id);
    console.log("조회된 Product:", product.name);

    // 4. Product 수정
    console.log("\n4. Product 수정");
    const updatedProduct = await patchProduct(newProduct.id, {
      name: "수정된 테스트 상품",
      price: 15000,
    });
    console.log(
      "수정 완료:",
      updatedProduct.name,
      "- 가격:",
      updatedProduct.price
    );

    // 5. Product 삭제
    console.log("\n5. Product 삭제");
    await deleteProduct(newProduct.id);
    console.log("삭제 완료");

    // 6. Product 클래스 메소드 테스트
    console.log("\n6. Product 클래스 메소드 테스트");
    if (products.length > 0) {
      const testProduct = products[0];
      console.log("테스트 상품:", testProduct.name);
      console.log("찜하기 전:", testProduct.favoriteCount);
      testProduct.favorite();
      console.log("찜하기 후:", testProduct.favoriteCount);

      if (testProduct instanceof ElectronicProduct) {
        console.log("전자제품 제조사:", testProduct.manufacturer);
      }
    }
  } catch (error) {
    console.error("Product API 테스트 중 오류:", error);
  }
}

// 각 함수를 실행하는 코드를 작성하고, 제대로 동작하는지 확인해 주세요.
async function testArticleAPIs() {
  console.log("========== Article API 테스트 시작 ==========");

  try {
    // 1. Article 목록 조회
    console.log("\n1. Article 목록 조회");
    const articleList = await getArticleList({ page: 1, pageSize: 5 });
    console.log(">> Article 목록:", articleList.list?.length, "개 조회 완료");

    // 조회된 Article 목록 간략히 출력 (시간 정보 포함)
    if (articleList.list && articleList.list.length > 0) {
      console.log("--- 조회된 Article 목록 (시간 정보 포함) ---");
      articleList.list.forEach((article, index) => {
        console.log(`  ${index + 1}. [ID: ${article.id}] ${article.title}`);
        console.log(
          `     작성자: ${article.writer || "없음"}, 좋아요: ${
            article.likeCount || 0
          }`
        );
        // console.log(`     생성: ${formatDateTime(article.createdAt)}`);
        // console.log(`     수정: ${formatDateTime(article.updatedAt)}`);
      });
    }

    // 2. Article 생성
    console.log("\n2. Article 생성");
    const newArticle = await createArticle({
      title: "시간 테스트용 게시글",
      content: "생성시간과 수정시간을 테스트하는 내용입니다.",
      image: "https://example.com/time-test.jpg",
    });

    console.log(`생성된 Article ID: ${newArticle.id}`);
    console.log(`  - 생성시간: ${formatDateTime(newArticle.createdAt)}`);
    // console.log(`  - 수정시간: ${formatDateTime(newArticle.updatedAt)}`);
    // console.log(
    //   `  - 동일여부: ${
    //     newArticle.createdAt === newArticle.updatedAt ? "동일함" : "다름"
    //   }`
    // );

    // 3. Article 단일 조회 (생성 직후)
    console.log("\n3. Article 단일 조회 (생성 직후)");
    const articleBeforeUpdate = await getArticle(newArticle.id);
    console.log("조회된 Article:", articleBeforeUpdate.title);
    // console.log(
    //   `  - 생성시간: ${formatDateTime(articleBeforeUpdate.createdAt)}`
    // );
    // console.log(
    //   `  - 수정시간: ${formatDateTime(articleBeforeUpdate.updatedAt)}`
    // );

    // 생성시간 저장 (수정 후 비교용)
    const originalCreatedAt = articleBeforeUpdate.createdAt;
    const originalUpdatedAt = articleBeforeUpdate.updatedAt;

    // 시간 차이
    // console.log("\n>>> 2초 대기 중... (시간 차이 생성)");
    // await sleep(2000);

    // 4. Article 수정
    console.log("\n4. Article 수정");
    const updatedArticle = await patchArticle(newArticle.id, {
      title: "시간 테스트 - 수정된 게시글",
      content: "수정시간만 변경되고 생성시간은 그대로인지 확인합니다.",
    });
    console.log("수정 완료:", updatedArticle.title);
    console.log(`  - 생성시간: ${formatDateTime(updatedArticle.createdAt)}`);
    console.log(`  - 수정시간: ${formatDateTime(updatedArticle.updatedAt)}`);

    // 5. Article 삭제
    console.log("\n5. Article 삭제");
    await deleteArticle(newArticle.id);
    console.log("삭제 완료");

    // 6. Article 인스턴스 생성 테스트
    console.log("\n6. Article 클래스 테스트");
    const articleInstance = new Article(
      "클래스 테스트 제목",
      "클래스 테스트 내용",
      "테스터",
      0
    );
    console.log("Article 인스턴스 생성됨:", articleInstance.title);
    console.log(
      "생성 시간 (클래스):",
      formatDateTime(articleInstance.createdAt)
    );
    articleInstance.like();
    console.log("좋아요 후 카운트:", articleInstance.likeCount);

    // 클래스 인스턴스는 updatedAt이 없음을 보여주기
    console.log(
      "수정 시간 (클래스):",
      articleInstance.updatedAt || "클래스에는 updatedAt 없음"
    );
  } catch (error) {
    console.error("Article API 테스트 중 오류:", error);
  }
}

// 메인 실행 함수
async function main() {
  console.log("===== 스프린트 미션2 - SH =====\n");

  // Product API 테스트 (async/await 사용)
  await testProductAPIs();
  console.log("\n\n");

  // Article API 테스트 (then/catch 사용)
  await testArticleAPIs();

  console.log("\n===== 스프린트 미션2 완료 =====");
}

// 실행
main().catch(console.error);
