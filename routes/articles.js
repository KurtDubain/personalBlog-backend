const express = require('express');
const router = express.Router();
const articlesController = require('../controllers/articlesController');

router.get('/', articlesController.getAllArticles);
router.get('/:articleId', articlesController.getArticleById);
router.get('/:articleId/content', articlesController.getArticleContent);
router.get('/:articleId/ctlTitles', articlesController.getArticleCtlTitles);
router.get('/lastId/return', articlesController.getLastId);


module.exports = router;
