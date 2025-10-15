export class Article {
  constructor(title, content, writer) {
    this.title = title;
    this.content = content;
    this.writer = writer;
    this.likeCount = 0;
    this.createAt = this.createAt();
  }

  like() {
    this.likeCount++;
  }

  createAt() {
    const date = new Date();
    return date.toString();
  }

  /*
  #title;
  #content;
  #writer;
  #likeCount;

  constructor(title, content, writer) {
    this.#title = title;
    this.#content = content;
    this.#writer = writer;
    this.#likeCount = 0;
  }

  like() {
    this.#likeCount++;
  }

  get title() {
    return this.#title;
  }

  get content() {
    return this.#content;
  }

  get writer() {
    return this.#writer;
  }

  get likeCount() {
    return this.#likeCount;
  }
    */
}
