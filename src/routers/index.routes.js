const { Router } = require('express');

const router = Router();

const { renderIndex, renderAcercade} = require('../controllers/index.controlers');

router.get('/', renderIndex);

router.get('/acercade', renderAcercade);

module.exports = router;
