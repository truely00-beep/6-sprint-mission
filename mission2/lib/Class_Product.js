export default class Product {
  #favoriteCount;
  constructor({ name, description, price, tags, images, favoriteCount = 0 }) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.tags = tags;
    this.images = images;
    this.#favoriteCount = favoriteCount;
  }

  get favoriteCount() {
    return this.#favoriteCount;
  }
  set favoriteCount(count) {
    console.log('');
    console.log('favoriteCount: NO MANUAL UPDATE is allowed');
    console.log(`               (${this.#favoriteCount} currently)`);
    console.log('');
  }

  favorite() {
    this.#favoriteCount++;
  }

  viewAll() {
    // expose all properties manually to visualize private property
    return {
      name: this.name,
      descritpion: this.description,
      price: this.price,
      tags: this.tags,
      images: this.images,
      favoriteCount: this.#favoriteCount,
      manufacturer: this.manufacturer,
    };
  }
}
