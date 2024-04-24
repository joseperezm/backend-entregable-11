const productService = require('../services/productService');
const { generateProductsApi } = require('../utils/mockData');
const errorCodes = require('../utils/errorCodes');

exports.getProducts = async (req, res, next) => {
    const limit = req.query.limit === undefined ? 10 : parseInt(req.query.limit, 10);
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort;
    const query = req.query.query;

    try {
        const { products, totalPages } = await productService.getProducts({ limit, page, sort, query });
        const hasPrevPage = page > 1;
        const hasNextPage = page < totalPages;
        const prevPage = hasPrevPage ? page - 1 : null;
        const nextPage = hasNextPage ? page + 1 : null;
        const baseUrl = '/api/products?';

        res.json({
            status: "success",
            products,
            totalPages,
            prevPage,
            nextPage,
            page,
            hasPrevPage,
            hasNextPage,
            prevLink: hasPrevPage ? `${baseUrl}page=${prevPage}` : null,
            nextLink: hasNextPage ? `${baseUrl}page=${nextPage}` : null
        });
    } catch (error) {
        next({ code: 'INTERNAL_SERVER_ERROR', original: error });
    }
};

exports.getProductById = async (req, res, next) => {
    try {
        const product = await productService.getProductById(req.params.pid);
        if (!product) {
            next({ code: 'NOT_FOUND' });
        } else {
            res.json(product);
        }
    } catch (error) {
        next({ code: 'INTERNAL_SERVER_ERROR', original: error });
    }
};

exports.addProduct = async (req, res, next) => {
    try {
        const { title, price, description, code, stock, category } = req.body;
        const fieldTypes = {
            title: 'String',
            price: 'Number',
            description: 'String',
            code: 'String',
            stock: 'Number',
            category: 'String'
        };

        const requiredFields = [];
        const missingFieldDetails = [];

        for (const [field, type] of Object.entries(fieldTypes)) {
            if (!req.body[field]) {
                requiredFields.push(field);
                missingFieldDetails.push(`${field}: ${type}`);
            }
        }

        if (requiredFields.length > 0) {
            console.log("Faltan campos requeridos con sus tipos:", missingFieldDetails.join(", "));
            throw {
                code: 'MISSING_FIELDS',
                message: 'Campos requeridos faltantes: ' + missingFieldDetails.join(", "),
                fields: requiredFields
            };
        }

        const newProduct = { title, price, description, code, stock, category };
        const product = await productService.addProduct(newProduct);
        res.status(201).json({ id: product._id, message: 'Producto agregado correctamente' });
    } catch (error) {
        next({ code: error.code || 'INTERNAL_SERVER_ERROR', original: error });
    }
};

exports.updateProduct = async (req, res, next) => {
    try {
        const updatedProduct = await productService.updateProduct(req.params.id, req.body);
        if (updatedProduct) {
            res.json({ message: 'Producto actualizado correctamente', product: updatedProduct });
        } else {
            next({ code: 'NOT_FOUND' });
        }
    } catch (error) {
        next({ code: 'INTERNAL_SERVER_ERROR', original: error });
    }
};

exports.deleteProduct = async (req, res, next) => {
    try {
        const success = await productService.deleteProduct(req.params.pid);
        if (success) {
            res.status(200).json({ message: 'Producto eliminado correctamente' });
        } else {
            next({ code: 'NOT_FOUND' });
        }
    } catch (error) {
        next({ code: 'INTERNAL_SERVER_ERROR', original: error });
    }
};

exports.mockProducts = (req, res) => {
    const products = generateProductsApi();
    res.json(products);
};