const Router = require('express').Router;

const router = Router();

const { getRealProducts } = require('../handlers/realtimeproducts.handler');

router.get('/', getRealProducts);


module.exports = router;