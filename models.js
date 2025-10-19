// ✅ Product 클래스
export class Product {
  constructor(
    name,
    description,
    price,
    tags = [],
    images = [],
    favoriteCount = 0
  ) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.tags = tags;
    this.images = images;
    this.favoriteCount = favoriteCount;
  }

  favorite() {
    this.favoriteCount++;
  }

  toJSON() {
    return {
      name: this.name,
      description: this.description,
      price: this.price,
      tags: this.tags,
      images: this.images,
      favoriteCount: this.favoriteCount,
    };
  }
}

// ✅ ElectronicProduct
export class ElectronicProduct extends Product {
  constructor(
    name,
    description,
    price,
    tags,
    images,
    favoriteCount,
    manufacturer = 'Unknown'
  ) {
    super(name, description, price, tags, images, favoriteCount);
    this.manufacturer = manufacturer;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      manufacturer: this.manufacturer,
    };
  }
}

// ✅ Article 클래스
export class Article {
  constructor(title, content, writer, likeCount = 0, image = null) {
    this.title = title;
    this.content = content;
    this.writer = writer;
    this.likeCount = likeCount;
    this.image = image;
    this.createdAt = new Date().toISOString();
  }

  like() {
    this.likeCount++;
  }

  toJSON() {
    return {
      title: this.title,
      content: this.content,
      writer: this.writer,
      likeCount: this.likeCount,
      image: this.image,
      createdAt: this.createdAt,
    };
  }
}
