import { CommentRepository } from '../repositories/commentRepository.js';
import { UpdateCommentDTO } from '../types/dto.js';
import NotFoundError from '../lib/errors/NotFoundError.js';
import ForbiddenError from '../lib/errors/ForbiddenError.js';

export class CommentService {
  private commentRepository: CommentRepository;

  constructor() {
    this.commentRepository = new CommentRepository();
  }

  async updateComment(id: number, userId: number, data: UpdateCommentDTO) {
    const existingComment = await this.commentRepository.findById(id);
    if (!existingComment) {
      throw new NotFoundError('comment', id);
    }

    if (existingComment.userId !== userId) {
      throw new ForbiddenError('Should be the owner of the comment');
    }

    return this.commentRepository.update(id, data);
  }

  async deleteComment(id: number, userId: number): Promise<void> {
    const existingComment = await this.commentRepository.findById(id);
    if (!existingComment) {
      throw new NotFoundError('comment', id);
    }

    if (existingComment.userId !== userId) {
      throw new ForbiddenError('Should be the owner of the comment');
    }

    await this.commentRepository.delete(id);
  }
}

