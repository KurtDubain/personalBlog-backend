const express = require('express');

const router = express.Router();
const likesController = require('../controllers/likesController');

// 获取指定项目指定id的点赞信息
router.get('/:likeType/:itemId/:userId/getlikes', likesController.getLikesbyItemId);
// 对指定项目进行点赞
router.post('/:likeType/liked',likesController.postLiked)
// 对指定项目进行取消点赞
router.post('/:likeType/disliked',likesController.postDisliked)

module.exports = router;
