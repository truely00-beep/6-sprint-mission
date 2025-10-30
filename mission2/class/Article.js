export class Article {
  constructor(title, content, writer, likeCount) {
    this.title = title;
    this.content = content;
    this.writer = writer;
    this.likeCount = likeCount || 0;
    this.createdAt = new Date();
  }

  like() {
    this.likeCount++;
  }
}
