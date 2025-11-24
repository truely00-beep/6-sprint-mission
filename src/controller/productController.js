import { prisma } from '../utils/prismaClient.js';

export class ProductController {
  //상품 리스트 조회
  static getProduct = async (req, res) => {
    const { offset = 0, limit = 10, order, search } = req.query;
    const orderbyOption = {
      recent: { createdAt: 'desc' },
      oldest: { createdAt: 'asc' },
    };
    // const where = search ? { name || description:search} : {}; >> 첫 시도
    const where = search
      ? { OR: [{ name: { contains: search } }, { description: { contains: search } }] }
      : {};
    // 프리즈마 내에서 or 사용 방법 {OR:{[{조건1},{조건2}]}}  >  ai 활용
    //{fieldName:{contains:...}} >> contains는 where이라는 옵션 안에있는 특정 필드등에 적용되는 더 세부적인 옵션
    const product = await prisma.product.findMany({
      where,
      orderBy: orderbyOption[order] || orderbyOption['recent'],
      skip: parseInt(offset),
      take: parseInt(limit),
      // include: { description: false, updatedAt: false }, >> 첫 시도, 잠재적 문제 발생 할 수도있음,prisma에서 의도한 사용방법이 아님
      select: {
        //findMany 도움말 참고
        id: true,
        name: true,
        price: true,
        createdAt: true,
      },
    });
    res.status(200).send(product);
  };
  static createProduct = async (req, res) => {
    const product = await prisma.product.create({
      data: req.body,
    });
    res.send(product);
  };
  //상품 상세 조회
  static getProductDetail = async (req, res) => {
    const { id } = req.params;
    const product = await prisma.product.findUniqueOrThrow({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        tag: true,
        createdAt: true,
      },
    });
    res.status(200).send(product);
  };
  //상품 정보 수정
  static patchProduct = async (req, res) => {
    const { id } = req.params;

    const product = await prisma.product.update({
      where: { id },
      data: req.body,
    });
    res.status(200).send(product);
  };
  //상품 삭제
  static deleteProduct = async (req, res) => {
    const { id } = req.params;
    await prisma.product.delete({
      where: { id },
    });
    res.sendStatus(204);
  };
}
