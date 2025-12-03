import { productService } from '../services/productService.js';
import { assert } from 'superstruct';
import { CreateProduct, PatchProduct } from '../structs/structs.js';
import productRepository from '../repositories/productRepository.js';

export default class ProductController {
    async GetProduct(req, res) {
        const { offset = 0, limit = 0, order = 'newset', name = "", description = "" } = req.query;
        let orderBy;
        switch (order) {
            case 'oldest':
                orderBy = { createdAt: 'asc' };
                break;
            case 'newest':
                orderBy = { createdAt: 'desc' };
                break;
            default:
                orderBy = { createdAt: 'desc' };
        }
        const parsedOffset = Number.isNaN(parseInt(offset)) ? 0 : parseInt(offset);
        const parsedLimit = parseInt(limit);

        const findOptions = {
            where: {
                name: {
                    contains: name,
                },
                description: {
                    contains: description,
                },
            },
            orderBy,
            skip: parsedOffset,
        };

        if (!Number.isNaN(parsedLimit) && parsedLimit > 0) {
            findOptions.take = parsedLimit;
        }

        const userId = req.user ? req.user.userId : null;
        const products = await productService.getProducts(findOptions, userId);
        res.send(products);
    }

    async GetProductById(req, res) {
        const id = req.params.id;
        const userId = req.user ? req.user.userId : null;
        const product = await productService.getProductById(id, userId);
        res.send(product);
    }

    async PostProduct(req, res) {
        assert(req.body, CreateProduct);
        const { ...userFields } = req.body;
        const product = await productRepository.create(userFields);
        res.status(201).send(product);
    }

    async PatchProductById(req, res) {
        const id = req.params.id;
        assert(req.body, PatchProduct);
        const { ...userFields } = req.body;
        const Product = await productRepository.update(id, userFields);
        res.send(Product);
    }

    async DeleteProductById(req, res) {
        const id = req.params.id;
        const Product = await productRepository.ondelete(id);
        res.send(Product);
    }

    async likeProduct(req, res) {
        const userId = req.user.userId;
        const productId = req.params.id;
        const result = await productService.likeProduct(userId, productId);
        return res.status(200).json(result);
    }
}