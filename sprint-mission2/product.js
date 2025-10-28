export class Product {
  #name;

  #description;

  #price;

  #tags;

  #images;

  #favoriteCount;

  constructor(name, description, price, tags, images, favoriteCount = 0) {
    this.#name = name;
    this.#description = description;
    this.#price = price;
    this.#tags = tags;
    this.#images = images;
    this.#favoriteCount;
  }

  get name() {
    return this.#name;
  }
  // getNmae() {
  //   return this.#name;
  // }

  get description() {
    return this.#description;
  }
  // getDescription() {
  //   return this.#description;
  // }

  get price() {
    return this.#price;
  }
  // getPrice() {
  //   return this.#price;
  // }

  get tags() {
    return this.#tags;
  }
  // getTags() {
  //   return this.#tags;
  // }

  get images() {
    return this.#images;
  }
  // getImages() {
  //   return this.#images;
  // }

  get favoriteCount() {
    return this.#favoriteCount;
  }
  // getFavoriteCount() {
  //   return this.#favoriteCount;
  // }

  favorite() {
    this.#favoriteCount += 1;
  }
}
