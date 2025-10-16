export class Article {
  #title;

  #content;

  #writer;

  #likeCount;

  #createdAt;

  constructor(title, content, writer, likeCount = 0) {
    this.#title = title;
    this.#content = content;
    this.#writer = writer;
    this.#likeCount = likeCount;
    this.#createdAt = new Date();
  }

  getTitle() {
    return this.#title;
  }

  getContent() {
    return this.#content;
  }

  getWriter() {
    return this.#writer;
  }

  getLikeCount() {
    return this.#likeCount;
  }

  getCreatedAt() {
    return this.#createdAt;
  }

  like() {
    this.#likeCount += 1;
  }
}
