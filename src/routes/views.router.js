const Router = require('express').Router;

const router = Router();

const { getHomeProducts } = require('../handlers/views.handler');

router.get('/', getHomeProducts);


module.exports = router;