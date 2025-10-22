export class Product {
  constructor(name, description, price, tags, images) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.tags = tags;
    this.images = images;
    this.favoriteCount = 0;
  }

  /*
  이부분 의문,
  조건에서는 프로퍼티로 favoriteCout가 필요함.
  아래 함수를 통해 찜하기가 호출 될 시 1이 증가해야함.
  위의 생성자에서 this.favoriteCount = 0;을 한 뒤에 해야하는걸로 생각드는데,
  서버API로 보내면, favoriteCount는 서버에서 관리하는 거라 생성자에 존재하면 안됨 으로 나타남
  ("favoriteCount" is an excess property and therefore is not allowed")
  생성자에 나오는 favoriteCount를 삭제하고 favorite()만 둬야하는지 아니면,
  생성자에 favoriteCount를 넣은 다음, Service에서 favvoriteCount만 제외시킨 다음 나머지를 삽입하는건지가 의문.
  */

  favorite() {
    this.favoriteCount++;
  }

  /*
  #name;
  #description;
  #price;
  #tags;
  #images;
  #favoriteCount;

  constructor(name, description, price, tags, images) {
    this.#name = name;
    this.#description = description;
    this.#price = price;
    this.#tags = tags;
    this.#images = images;
    this.#favoriteCount = 0;
  }

  favorite() {
    this.#favoriteCount++;
  }

  get name() {
    return this.#name;
  }

  get description() {
    return this.#descripsion;
  }

  get price() {
    return this.#price;
  }

  get tags() {
    return this.#tags;
  }

  get images() {
    return this.#images;
  }

  get favoriteCount() {
    return this.#favoriteCount;
  }
    */
}

export class ElectronicProduct extends Product {
  constructor(
    name,
    description,
    price,
    tags,
    images,
    favoriteCount,
    manufacturer
  ) {
    super(name, description, price, tags, images, favoriteCount);
    this.manufacturer = manufacturer;
  }

  /*
  #manufacturer;

  constructor(name, description, price, tags, images, manufacturer) {
    super(name, description, price, tags, images);
    this.#manufacturer = manufacturer;
  }

  get manufacturer() {
    return this.#manufacturer;
  }
  */
}
