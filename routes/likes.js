const express = require('express');

const router = express.Router();
const likesController = require('../controllers/likesController');

// 根据用户名来获取用户信息
router.get('/:likeType/:itemId/:userId/getlikes', likesController.getLikesbyItemId);//获取跳转指定文章Id
// 判断用户是否登录来判断是否需要注册新用户等
router.post('/:likeType/liked',likesController.postLiked)
router.post('/:likeType/disliked',likesController.postDisliked)

module.exports = router;
