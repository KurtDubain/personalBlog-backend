const express = require('express');
const router = express.Router();
const articlesController = require('../controllers/articlesController');

//对文章操作的接口
router.get('/', articlesController.getAllArticles);//获取全部文章信息
router.get('/:articleId', articlesController.getArticleById);//获取指定文章信息
router.get('/:articleId/content', articlesController.getArticleContent);//获取指定文章信息的文本内容
router.get('/:articleId/ctlTitles', articlesController.getArticleCtlTitles);//获取指定文章的前后文章信息
router.get('/lastId/return', articlesController.getLastId);//获取文章中最后一个文章的id
router.get('/ByTag/PageCtrl',articlesController.getArticlesByTag)
router.get('/search/Page',articlesController.getSearchedArticles)

module.exports = router;
