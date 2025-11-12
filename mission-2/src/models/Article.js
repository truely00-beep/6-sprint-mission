export class Article {
  #title;
  #likeCount;
  constructor(title, content, writer = "익명", likeCount = 0) {
    this.#title = title;
    this.content = content;
    this.writer = writer;
    this.#likeCount = likeCount;
    this.createdAt = new Date();
  }

  get title() {
    return this.#title;
  }

  set title(name) {
    if (typeof name === "string") {
      if (!name.includes("[인기]")) {
        this.#title = name;
      } else {
        console.log(`'[인기]' 는 입력할 수 없습니다.`);
      }
    } else {
      console.log("문자열을 입력하세요.");
    }
  }

  get likeCount() {
    return this.#likeCount;
  }

  like() {
    this.#likeCount++;
    if (this.#likeCount >= 3) {
      if (!this.#title.includes("[인기]")) {
        this.#title = "[인기] " + this.#title;
      }
    } else {
      if (this.#title.includes("[인기]")) {
        this.#title = this.#title.replace("[인기] ", "");
      }
    }
  }
}
