import prisma from '../../prismaclient.js';

export async function postArticle(obj) {
  const [title, content] = obj;
  try {
    await prisma.article.create({ data: { title: title, content: content } });
    console.log(`title: ${title}, content: ${content}`, 'is successful');
  } catch (err) {
    console.log(err);

    throw err;
  }
}
