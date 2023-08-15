// routes/subscription.js
const express = require('express');
const router = express.Router();
const announceController = require('../controllers/announceController');

// 处理订阅表单的POST请求
router.post('/PostAnnounceForm', announceController.PostItem);//订阅处理
router.get('/GetAnnounceFormByNum',announceController.GetItemByNum)//取消订阅处理

module.exports = router;
