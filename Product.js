export default class Product {
  constructor(name, description, price, tags, images, favoriteCount) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.tags = tags || [];
    this.images = images || [];
    this.favoriteCount = favoriteCount || 0;
  }

  favorite() {
    this.favoriteCount++;
    return this.favoriteCount;
  }
}
