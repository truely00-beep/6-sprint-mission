import prisma from '../lib/prismaclient.js';

export async function likeCountUp() {
  console.log('product +1');
}

export async function likeCountDown() {
  console.log('product -1');
}
