const express = require('express');
const router = express.Router();
const chatsController = require('../controllers/chatsController');
const imageUpload = require('../middlewares/imageUpload')

//获取全部留言信息
router.get('/', chatsController.getAllChats);
router.post('/imageUpload',imageUpload.single('file'),chatsController.imageUpload)
router.post('/FormUpload',chatsController.formUpload)

module.exports = router;
