// 站点信息管理路由
const express = require('express');
const router = express.Router();
const systemController = require('../controllers/systemController');

// 记录访客访问信息
router.post('/visited', systemController.visitThat);
// 获取访客信息，用于在首页图表展示
router.get('/getInfor',systemController.getInfor)

module.exports = router;
