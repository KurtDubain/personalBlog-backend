// routes/subscription.js
const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');

// 处理订阅表单的POST请求
router.post('/Sub', subscriptionController.SubItem);
router.post('/UnSub',subscriptionController.UnSubItem)

module.exports = router;
