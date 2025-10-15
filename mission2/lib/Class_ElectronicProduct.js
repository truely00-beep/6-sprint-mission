import Product from './Class_Product.js';

export default class ElectronicProduct extends Product {
  constructor(
    name,
    description,
    price,
    tags,
    images,
    favoriteCount,
    manufacturer = '미상'
  ) {
    super(name, description, price, tags, images, favoriteCount);
    this.manufacturer = manufacturer;
  }

  viewAll() {
    // expose all properties manually to visualize private property
    return {
      name: this.name,
      descritpion: this.description,
      price: this.price,
      tags: this.tags,
      images: this.images,
      favoriteCount: this.favoriteCount,
      manufacturer: this.manufacturer,
    };
  }
}
