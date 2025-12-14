import { prisma } from '../lib/prismaClient.js'

export function findCommentById(commentId) {
  return prisma.comment.findUnique({
    where: { id: Number(commentId)}
  })
}

export function createComment(data) {
  return prisma.comment.create({ data })
}

export function updateComment(commentId, data) {
  return prisma.comment.update({
    where: { id: Number(commentId) },
    data
  })
}

export function deleteComment(commentId) {
  return prisma.comment.delete({
    where: { id: Number(commentId) }
  })
}

export function findComments(options = {}) {
  return prisma.comment.findMany(options)
}