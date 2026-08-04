const express = require('express');
const router = express.Router();
const proceduresController = require('../controllers/procedures.controller');

router.get('/', proceduresController.list);
router.get('/categories', proceduresController.getCategories);
router.get('/:cod_tramite', proceduresController.getById);

module.exports = router;
