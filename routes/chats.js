const express = require('express');
const router = express.Router();
const chatsController = require('../controllers/chatsController');

//获取全部留言信息
router.get('/', chatsController.getAllChats);


module.exports = router;
