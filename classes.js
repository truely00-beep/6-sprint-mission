// classes.js (main.js에서 import 될 파일)

// ------------------------------------
// 💡 Product 클래스 (상품)
// ------------------------------------
export class Product {
  // # (private fields)를 사용하여 캡슐화 구현
  #name;
  #description;
  #price;
  #tags;
  #images;
  #favoriteCount;

  /**
   * Product 클래스의 생성자
   * @param {string} name 상품명
   * @param {string} description 상품 설명
   * @param {number} price 판매 가격
   * @param {string[]} tags 해시태그 배열
   * @param {string[]} images 이미지 배열
   * @param {number} [favoriteCount=0] 찜하기 수 (기본값 0)
   */
  constructor(name, description, price, tags, images, favoriteCount = 0) {
    this.#name = name;
    this.#description = description;
    this.#price = price;
    this.#tags = tags;
    this.#images = images;
    this.#favoriteCount = favoriteCount;
  }

  // Getter (캡슐화된 속성 접근)
  get name() { return this.#name; }
  get description() { return this.#description; }
  get price() { return this.#price; }
  get tags() { return this.#tags; }
  get images() { return this.#images; }
  get favoriteCount() { return this.#favoriteCount; }

  // Setter (필요한 경우에만)
  set name(newName) { this.#name = newName; }
  // ... 기타 setter

  /**
   * 찜하기 수를 1 증가시키는 메소드
   */
  favorite() {
    this.#favoriteCount++;
    console.log(`${this.#name} 상품의 찜하기 수가 ${this.#favoriteCount}로 증가했습니다.`);
  }

  /**
   * 상품 정보 출력 (다형성을 위한 기본 메소드)
   */
  displayInfo() {
    return `[상품] ${this.#name} (${this.#price}원). 찜: ${this.#favoriteCount}`;
  }
}

// ------------------------------------
// 💡 ElectronicProduct 클래스 (전자제품 - Product 상속)
// ------------------------------------
export class ElectronicProduct extends Product {
  #manufacturer;

  /**
   * ElectronicProduct 클래스의 생성자
   * @param {string} name 상품명
   * @param {string} description 상품 설명
   * @param {number} price 판매 가격
   * @param {string[]} tags 해시태그 배열
   * @param {string[]} images 이미지 배열
   * @param {number} favoriteCount 찜하기 수
   * @param {string} manufacturer 제조사
   */
  constructor(name, description, price, tags, images, favoriteCount, manufacturer) {
    // 부모 클래스(Product)의 생성자 호출
    super(name, description, price, tags, images, favoriteCount);
    this.#manufacturer = manufacturer;
  }

  get manufacturer() { return this.#manufacturer; }
  set manufacturer(newManufacturer) { this.#manufacturer = newManufacturer; }

  /**
   * 상품 정보 출력 오버라이드 (다형성)
   */
  displayInfo() {
    return `[전자제품] ${this.name} (${this.price}원), 제조사: ${this.#manufacturer}.`;
  }
}

// ------------------------------------
// 💡 Article 클래스 (게시글)
// ------------------------------------
export class Article {
  #title;
  #content;
  #writer;
  #likeCount;
  #createdAt; // 심화 요구사항

  /**
   * Article 클래스의 생성자
   * @param {string} title 제목
   * @param {string} content 내용
   * @param {string} writer 작성자
   * @param {number} [likeCount=0] 좋아요 수 (기본값 0)
   */
  constructor(title, content, writer, likeCount = 0) {
    this.#title = title;
    this.#content = content;
    this.#writer = writer;
    this.#likeCount = likeCount;
    // 심화 요구사항: 객체 생성 시 현재 시간 저장
    this.#createdAt = new Date();
  }

  // Getter (캡슐화된 속성 접근)
  get title() { return this.#title; }
  get content() { return this.#content; }
  get writer() { return this.#writer; }
  get likeCount() { return this.#likeCount; }
  get createdAt() { return this.#createdAt; }

  // Setter (필요한 경우에만)
  set title(newTitle) { this.#title = newTitle; }
  // ... 기타 setter

  /**
   * 좋아요 수를 1 증가시키는 메소드
   */
  like() {
    this.#likeCount++;
    console.log(`'${this.#title}' 게시글의 좋아요 수가 ${this.#likeCount}로 증가했습니다.`);
  }

  /**
   * 게시글 정보 출력
   */
  displayInfo() {
    return `[게시글] 제목: ${this.#title}, 작성자: ${this.#writer}, 좋아요: ${this.#likeCount}, 작성일: ${this.#createdAt.toLocaleString()}`;
  }
}