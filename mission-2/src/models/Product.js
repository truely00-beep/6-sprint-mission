export class Product {
  #name;
  #favoriteCount;
  constructor(
    name,
    description,
    price = 0,
    tags = [],
    images = [],
    favoriteCount = 0
  ) {
    this.#name = name;
    this.description = description;
    this.price = price;
    this.tags = tags;
    this.images = images;
    this.#favoriteCount = favoriteCount;
  }

  get name() {
    return this.#name;
  }

  set name(str) {
    if (typeof str === "string") {
      if (!str.includes("[인기]")) {
        this.#name = str;
      } else {
        console.log(`'[인기]' 는 입력할 수 없습니다.`);
      }
    } else {
      console.log("문자열을 입력하세요.");
    }
  }

  get favoriteCount() {
    return this.#favoriteCount;
  }

  favorite() {
    this.#favoriteCount++;
    if (this.#favoriteCount >= 3) {
      if (!this.#name.includes("[인기]")) {
        this.#name = "[인기] " + this.#name;
      }
    } else {
      if (this.#name.includes("[인기]")) {
        this.#name = this.#name.replace("[인기] ", "");
      }
    }
  }
}
