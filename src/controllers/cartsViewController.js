const cartService = require('../services/cartService');
const errorCodes = require('../utils/errorCodes');

exports.showCarts = async (req, res, next) => {
    try {
        const carts = await cartService.getAllCarts();
        const cartsObjects = carts.map(cart => cart.toObject ? cart.toObject() : cart);
        res.render('carts', { carts: cartsObjects });
    } catch (error) {
        console.error("Error al obtener todos los carritos", error);
        next({ code: 'INTERNAL_SERVER_ERROR', original: error });
    }
};


exports.showCart = async (req, res, next) => {
    try {
        const cart = await cartService.getCart(req.params.cid);
        if (cart) {
            const cartObject = cart.toObject ? cart.toObject() : cart;
            res.render('cart', { cart: cartObject });
        } else {
            next({ code: 'NOT_FOUND', message: "Carrito no encontrado" });
        }
    } catch (error) {
        console.error("Error al obtener el carrito por ID", error);
        next({ code: 'INTERNAL_SERVER_ERROR', original: error });
    }
};