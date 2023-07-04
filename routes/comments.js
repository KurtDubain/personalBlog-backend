const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/commentsController');

router.post('/form', commentsController.submitCommentForm);

router.get('/:articleId', commentsController.getCommentsByArticleId);

module.exports = router;
