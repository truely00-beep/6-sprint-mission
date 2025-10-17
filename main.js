// main.js
import { Product, ElectronicProduct, Article } from "./classes.js";
import {
  getProductList,
  getProduct,
  createProduct,
  patchProduct,
  deleteProduct,
} from "./ProductService.js";
import {
  getArticleList,
  getArticle,
  createArticle,
  patchArticle,
  deleteArticle,
} from "./ArticleService.js";

// ------------------------------------
// 💡 1. 클래스 테스트
// ------------------------------------
console.log("================ 1. 클래스 테스트 ================");

// Product 인스턴스
const basicProduct = new Product(
  "커피 머그컵",
  "아침 커피를 위한 예쁜 머그컵",
  15000,
  ["생활용품", "주방"],
  ["img1.jpg"],
);
basicProduct.favorite(); // 찜하기 증가
console.log(basicProduct.displayInfo());

// ElectronicProduct 인스턴스 (상속 및 다형성)
const electronicDevice = new ElectronicProduct(
  "노트북 X1",
  "초경량 고성능 노트북",
  2500000,
  ["전자제품", "컴퓨터", "휴대용"],
  ["lap1.png"],
  120,
  "Global Tech",
);
electronicDevice.favorite();
console.log(electronicDevice.displayInfo());

// Article 인스턴스
const firstArticle = new Article(
  "첫 게시글",
  "새해 복 많이 받으세요!",
  "김작성",
);
firstArticle.like(); // 좋아요 증가
console.log(firstArticle.displayInfo());
console.log(`게시글 생성 일자: ${firstArticle.createdAt.toLocaleString()}`);

console.log("==================================================");

// ------------------------------------
// 💡 2. Article API 함수 실행 및 테스트 (.then/.catch)
// ------------------------------------
console.log("\n================ 2. Article API 테스트 ================");

// 테스트용 데이터
const newArticleData = {
  title: "테스트 게시글 (then/catch)",
  content: "비동기 처리 테스트 중입니다.",
  image: "test_img_article.jpg",
};
let createdArticleId;

// 1. 게시글 생성
createArticle(newArticleData)
  .then((result) => {
    console.log("✅ createArticle 성공:", result.title);
    createdArticleId = result.id;

    // 2. 게시글 상세 조회
    return getArticle(createdArticleId);
  })
  .then((result) => {
    console.log("✅ getArticle 성공:", result.title, "ID:", result.id);

    // 3. 게시글 수정
    return patchArticle(createdArticleId, {
      content: "내용이 수정되었습니다.",
    });
  })
  .then((result) => {
    console.log("✅ patchArticle 성공:", result.content);

    // 4. 게시글 목록 조회
    return getArticleList({ page: 1, pageSize: 5 });
  })
  .then((list) => {
    console.log(
      `✅ getArticleList 성공. 총 ${list.total}개 중 ${list.data.length}개 로드.`,
    );

    // 5. 게시글 삭제
    return deleteArticle(createdArticleId);
  })
  .then(() => {
    console.log("✅ Article API 테스트 완료");
  })
  .catch((error) => {
    console.error("❌ Article API 테스트 중 치명적 오류 발생:", error.message);
  });

console.log("=====================================================");

// ------------------------------------
// 💡 3. Product API 함수 실행 및 인스턴스 생성 (async/await, try/catch)
// ------------------------------------

async function runProductTestsAndInstantiate() {
  console.log(
    "\n================ 3. Product API 테스트 및 인스턴스 생성 ================",
  );
  const products = []; // 인스턴스를 저장할 배열
  let createdProductId;

  try {
    // 테스트용 상품 생성
    const newProductData = {
      name: "테스트 전자제품 (async/await)",
      description: "전자제품 클래스 인스턴스화를 위한 데이터",
      price: 500000,
      tags: ["전자제품", "테스트"], // ElectronicProduct로 인스턴스화 됨
      images: ["test_prod_img.jpg"],
    };

    const createdProduct = await createProduct(newProductData);
    console.log("✅ createProduct 성공:", createdProduct.name);
    createdProductId = createdProduct.id;

    // 상품 목록 조회
    const productListResult = await getProductList({
      page: 1,
      pageSize: 5,
      keyword: "테스트",
    });
    console.log(
      `✅ getProductList 성공. 총 ${productListResult.total}개 중 ${productListResult.data.length}개 로드.`,
    );

    // 상품 리스트를 인스턴스로 생성
    productListResult.data.forEach((item) => {
      const isElectronic = item.tags.includes("전자제품");
      let instance;

      if (isElectronic) {
        // ElectronicProduct 인스턴스 생성
        // manufacturer 속성을 API 데이터에 추가하지 않았으므로 임의로 "Unknown" 사용
        // 실제 API라면 manufacturer 속성을 포함하도록 POST 요청을 변경해야 함.
        instance = new ElectronicProduct(
          item.name,
          item.description,
          item.price,
          item.tags,
          item.images,
          item.favoriteCount || 0,
          "Unknown Manufacturer",
        );
      } else {
        // Product 인스턴스 생성
        instance = new Product(
          item.name,
          item.description,
          item.price,
          item.tags,
          item.images,
          item.favoriteCount || 0,
        );
      }
      products.push(instance);
    });

    console.log("\n--- 생성된 인스턴스 목록 (다형성 확인) ---");
    products.forEach((p) => console.log(p.displayInfo()));

    // 상품 상세 조회 및 수정
    await getProduct(createdProductId);
    console.log(`✅ getProduct 성공. (ID: ${createdProductId})`);

    await patchProduct(createdProductId, { price: 550000 });
    console.log(`✅ patchProduct 성공. (ID: ${createdProductId}, 가격 수정)`);

    // 상품 삭제
    await deleteProduct(createdProductId);

    console.log("✅ Product API 테스트 완료");
  } catch (error) {
    console.error("❌ Product API 테스트 중 치명적 오류 발생:", error.message);
  }

  console.log(
    "=======================================================================",
  );
}

runProductTestsAndInstantiate();
