const Router = require('express').Router;
const router = Router();

const { getCartsByCid, addCart, addProductInCart } = require ('../handlers/carts.handler');

router.get('/:cid', getCartsByCid);

router.post('/', addCart);

router.post('/:cid/product/:pid', addProductInCart);

module.exports = router;