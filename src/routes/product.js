const express = require('express');
const router = express.Router();
const { Product } = require('../models');
const { body, validationResult, query } = require('express-validator');

// 유효성 검사 미들웨어
const validateProduct = [
  body('name').isString().withMessage('Name is required').notEmpty(),
  body('description').isString().withMessage('Description is required').notEmpty(),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
];

// 상품 등록 API
router.post('/', validateProduct, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, description, price, tags } = req.body;
    const product = await Product.create({ name, description, price, tags });
    return res.status(201).json(product);
  } catch (error) {
    next(error);
  }
});

// 상품 상세 조회 API
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      attributes: ['id', 'name', 'description', 'price', 'tags', 'createdAt'],
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    return res.json(product);
  } catch (error) {
    next(error);
  }
});

// 상품 수정 API (PATCH)
router.patch('/:id', validateProduct, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const { name, description, price, tags } = req.body;
    await product.update({ name, description, price, tags });
    return res.json(product);
  } catch (error) {
    next(error);
  }
});

// 상품 삭제 API
router.delete('/:id', async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    await product.destroy();
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// 상품 목록 조회 API (offset pagination, 검색, 최신순 정렬)
router.get('/', 
  [
    query('offset').optional().isInt({ min: 0 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('search').optional().isString(),
    query('sort').optional().isIn(['recent'])
  ],
  async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    let { offset = 0, limit = 10, search = '', sort } = req.query;

    // 검색 조건
    const where = {};
    if (search) {
      where[Sequelize.Op.or] = [
        { name: { [Sequelize.Op.iLike]: `%${search}%` } },
        { description: { [Sequelize.Op.iLike]: `%${search}%` } },
      ];
    }

    // 정렬 조건
    const order = [];
    if (sort === 'recent') order.push(['createdAt', 'DESC']);

    const products = await Product.findAll({
      attributes: ['id', 'name', 'price', 'createdAt'],
      where,
      offset,
      limit,
      order,
    });

    return res.json(products);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
