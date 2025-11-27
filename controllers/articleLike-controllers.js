import prisma from '../lib/prismaclient.js';

export async function likeCountUp() {
  console.log('articles +1');
}

export async function likeCountDown() {
  console.log('articles -1');
}
