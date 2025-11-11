export class Product {
  constructor(name, description, price, tags, images, favoriteCount) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.tags = tags;
    this.images = images;
    this.favoriteCount = favoriteCount || 0;
  }

  favorite() {
    //이 메소드 호출 시에 찜하기 수가 1 증가
    this.favoriteCount++;
  }
}
