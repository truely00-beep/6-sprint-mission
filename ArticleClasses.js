// ArticleClasses.js

/**
 * 게시글 클래스 (Article)
 */
export class Article {
  constructor(data) {
    this.id = data.id || null;
    this.title = data.title;
    this.content = data.content;
    this.writer = data.writer || "익명";
    this.likeCount = data.likeCount || 0;
    // 심화 요구사항: 생성일자 저장
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
  }

  /**
   * 좋아요 수를 1 증가시키는 메서드입니다.
   */
  like() {
    this.likeCount += 1;
    console.log(`[${this.title}] 좋아요 1 증가! (총 ${this.likeCount}개)`);
  }

  /**
   * 게시글 정보를 출력하는 메서드입니다.
   */
  displayInfo() {
    const dateString = this.createdAt.toLocaleDateString();
    return `[게시글] ${this.title} (by ${this.writer}) | 좋아요: ${this.likeCount} | 작성일: ${dateString}`;
  }

  /**
   * API 요청 본문을 생성합니다. (createArticle용)
   */
  toRequestBody() {
    return {
      title: this.title,
      content: this.content,
      image: this.image,
    };
  }
}
