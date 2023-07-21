const express = require('express');
const router = express.Router();
const writeController = require('../controllers/writeController');
// 使用中间件处理Formdata格式的表单信息
const contentUploadMid = require('../middlewares/MDcontentUpload')
// 使用中间件处理二进制图片
const imageUpload = require('../middlewares/MDimageUpload')

// 用于上传md文档中的图片
router.post('/imgUpload',imageUpload,writeController.imageUpload)
// 用于上传md文件内容以及文章信息
router.post('/ContentUpload',contentUploadMid.any(),writeController.ContentUpload)

module.exports = router;
