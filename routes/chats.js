const express = require('express');
const router = express.Router();
const chatsController = require('../controllers/chatsController');

//获取全部留言信息
router.get('/', chatsController.getAllChats);
router.post('/imageUpload',chatsController.imageUpload)
router.post('/FormUpload',chatsController.formUpload)

module.exports = router;
