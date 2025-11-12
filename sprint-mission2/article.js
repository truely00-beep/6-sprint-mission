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

  get title() {
    return this.#title;
  }
  // getTitle() {
  //   return this.#title;
  // }

  get writer() {
    return this.#writer;
  }
  // getWriter() {
  //   return this.#writer;
  // }

  get content() {
    return this.#content;
  }
  // getContent() {
  //   return this.#content;
  // }

  get LikeCount() {
    return this.#likeCount;
  }
  // getLikeCount() {
  //   return this.#likeCount;
  // }

  get CreatedAt() {
    return this.#createdAt;
  }
  // getCreatedAt() {
  //   return this.#createdAt;
  // }

  like() {
    this.#likeCount += 1;
  }
}
