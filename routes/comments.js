const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/commentsController');


router.post('/form', commentsController.submitCommentForm);//获取文章评论表单

router.get('/:articleId', commentsController.getCommentsByArticleId);//获取跳转指定文章Id

module.exports = router;
