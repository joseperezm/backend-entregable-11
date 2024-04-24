const cartService = require('../services/cartService');
const errorCodes = require('../utils/errorCodes');

exports.createCart = async (req, res, next) => {
    try {
        const cart = await cartService.createCart();
        res.status(201).json({ cid: cart._id, message: "Carrito creado correctamente" });
    } catch (error) {
        console.error("Error al crear el carrito: ", error);
        next({ code: 'INTERNAL_SERVER_ERROR', original: error });
    }
};

exports.getAllCarts = async (req, res, next) => {
    try {
        const carts = await cartService.getAllCarts();
        res.json(carts);
    } catch (error) {
        console.error("Error al obtener los carritos: ", error);
        next({ code: 'INTERNAL_SERVER_ERROR', original: error });
    }
};

exports.getCart = async (req, res, next) => {
    try {
        const cart = await cartService.getCart(req.params.cid);
        if (cart) {
            res.json(cart);
        } else {
            next({ code: 'NOT_FOUND', message: "Carrito no encontrado" });
        }
    } catch (error) {
        console.error("Error al obtener el carrito por ID: ", error);
        next({ code: 'INTERNAL_SERVER_ERROR', original: error });
    }
};

exports.addToCart = async (req, res, next) => {
    const { cid, pid } = req.params;
    const { quantity = 1 } = req.body;

    try {
        const { success, message, cart } = await cartService.addToCart(cid, pid, quantity);
        if (success) {
            res.json({ message, cart });
        } else {
            next({ code: 'NOT_FOUND', message });
        }
    } catch (error) {
        console.error("Error al agregar producto al carrito: ", error);
        next({ code: 'INTERNAL_SERVER_ERROR', original: error });
    }
};

exports.updateCartProducts = async (req, res, next) => {
    const { cid } = req.params;
    const { products } = req.body;

    try {
        const updatedCart = await cartService.updateCartProducts(cid, products);
        if (updatedCart) {
            res.json({ message: "Carrito actualizado con éxito", cart: updatedCart });
        } else {
            next({ code: 'NOT_FOUND', message: "Carrito no encontrado" });
        }
    } catch (error) {
        console.error("Error al actualizar el carrito: ", error);
        next({ code: 'INTERNAL_SERVER_ERROR', original: error });
    }
};

exports.updateProductQuantity = async (req, res, next) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        const result = await cartService.updateProductQuantity(cid, pid, quantity);
        if (result.success) {
            res.json({ message: "Cantidad actualizada correctamente", cart: result.cart });
        } else {
            next({ code: 'NOT_FOUND', message: result.message });
        }
    } catch (error) {
        console.error("Error al actualizar la cantidad del producto en el carrito: ", error);
        next({ code: 'INTERNAL_SERVER_ERROR', original: error });
    }
};

exports.emptyCart = async (req, res, next) => {
    try {
        const success = await cartService.emptyCart(req.params.cid);
        if (success) {
            res.json({ message: "Carrito vaciado correctamente" });
        } else {
            next({ code: 'NOT_FOUND', message: "Carrito no encontrado" });
        }
    } catch (error) {
        console.error("Error al vaciar el carrito: ", error);
        next({ code: 'INTERNAL_SERVER_ERROR', original: error });
    }
};

exports.deleteCart = async (req, res, next) => {
    try {
        const success = await cartService.deleteCart(req.params.cid);
        if (success) {
            res.json({ message: "Carrito eliminado correctamente" });
        } else {
            next({ code: 'NOT_FOUND', message: "Carrito no encontrado" });
        }
    } catch (error) {
        console.error("Error al eliminar el carrito: ", error);
        next({ code: 'INTERNAL_SERVER_ERROR', original: error });
    }
};

exports.deleteProductFromCart = async (req, res, next) => {
    try {
        const { success, message, cart } = await cartService.deleteProductFromCart(req.params.cid, req.params.pid);
        if (success) {
            res.json({ message, cart });
        } else {
            next({ code: 'NOT_FOUND', message });
        }
    } catch (error) {
        console.error("Error al eliminar producto del carrito: ", error);
        next({ code: 'INTERNAL_SERVER_ERROR', original: error });
    }
};

exports.finalizePurchase = async (req, res, next) => {
    const cartId = req.params.cid;
    const userEmail = req.user.email;
    try {
        const result = await cartService.finalizePurchase(cartId, userEmail);
        if (result.failedProducts.length > 0) {
            res.status(206).json({
                success: true,
                message: "Compra parcialmente exitosa",
                totalAmount: result.totalAmount,
                ticketId: result.ticketId,
                failedProducts: result.failedProducts
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Compra finalizada con éxito",
                totalAmount: result.totalAmount,
                ticketId: result.ticketId
            });
        }
    } catch (error) {
        console.error("Error al finalizar la compra: ", error);
        next({ code: 'INTERNAL_SERVER_ERROR', original: error });
    }
};