const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
// 用于解析token的中间件
const tokenDeal = require('../middlewares/tokenDeal')

// 根据用户名来获取用户信息
router.get('/FromComments/:formInlineName', usersController.getusersByName);//获取跳转指定文章Id
// 判断用户是否登录来判断是否需要注册新用户等
router.post('/FromChatLogin',usersController.makeUserLogin)
// 通过用户ID返回用户信息
router.get('/getUserInfo/:formInlineID',tokenDeal,usersController.getusersByID)
// 通过用户ID生成对应的token
router.get('/GetTokenById/:formInlineName',usersController.getTokenByFormName)
// 验证token是否有效
router.get('/verifyToken',tokenDeal,usersController.verifyToken)
module.exports = router;
