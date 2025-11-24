import { productsService } from '../services/productsService.js';

export async function createProduct(req, res, next) {
  try {
    const productData = req.body;
    const newProduct = await productsService.createProductInDb(productData);

    res.status(201).json({
      message: '상품 등록이 성공적으로 등록되었습니다.',
      data: newProduct,
    });
  } catch (error) {
    next(error);
  }
}

export async function getProducts(req, res, next) {
  try {
    const { sort, search } = req.query;
    const { offset: _offset, limit: _limit } = req.paginationParams;

    const { products, totalProducts } = await productsService.findProducts({
      sort,
      search,
      offset: _offset,
      limit: _limit,
    });

    if (search && totalProducts === 0) {
      return res.status(200).json({
        message: `${search}와 일치하는 상품을 찾을 수 없습니다.`,
        data: [],
        pagination: {},
      });
    }

    const totalPages = Math.ceil(totalProducts / _limit);

    res.status(200).json({
      message: '상품 목록을 조회했습니다.',
      data: products,
      pagination: {
        totalItems: totalProducts,
        totalPages: totalPages,
        currentPage: Math.floor(_offset / _limit) + 1,
        itemsPerPage: _limit,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getProduct(req, res, next) {
  try {
    const { id } = req.params;
    const product = await productsService.findProductById(id);

    res.status(200).send(product);
  } catch (error) {
    next(error);
  }
}

export async function patchProduct(req, res, next) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (Object.keys(updateData).length === 0) {
      const emptyBodyError = new Error('수정할 내용이 비어 있습니다.');
      emptyBodyError.status = 400;
      throw emptyBodyError;
    }

    const product = await productsService.updateProductInDb(id, updateData);

    res.status(200).json({
      message: '상품이 성공적으로 수정되었습니다.',
      data: product,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;
    const product = await productsService.deleteProductInDb(id);

    res.status(204).send(product);
  } catch (error) {
    next(error);
  }
}
