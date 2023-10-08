const express = require('express');
const router = express.Router();
const chatsController = require('../controllers/chatsController');
// 处理图片格式和上传位置的中间件
// const imageUpload = require('../middlewares/imageUpload')
const {uploadAndAddName} = require('../middlewares/ChatmakeUpload')


//获取全部留言信息
router.get('/', chatsController.getAllChats);
// 处理留言图片的上传
// router.post('/imageUpload',imageUpload.single('file'),chatsController.imageUpload)
// 处理留言表单的上传
router.post('/FormUpload',chatsController.formUpload)
// 处理指定留言信息的获取
router.get('/chatInfo/:chatId',chatsController.getChatInfo)
// 处理置顶留言下的评论获取
router.get('/chatCommentInfo/:chatId',chatsController.getChatCommentInfo)
// 在留言下发送评论
router.post('/postChatComment',chatsController.postChatComment)
// 获取指定关键字下的留言信息
router.get('/search',chatsController.getSearchChats)
//对上传的图片或视频分片的处理
router.post('/uploadChunk',uploadAndAddName,chatsController.uploadChunk)


module.exports = router;
