import { Product } from './product.js';

export class ElectronicProduct extends Product {
  #manufacturer;

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
    this.#manufacturer = manufacturer;
  }

  get manufavturer() {
    return this.#manufacturer;
  }
  // getManufacturer() {
  //   return this.#manufacturer;
  // }
  favorite() {
    super.favorite();
  }
}
