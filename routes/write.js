const express = require('express');
const router = express.Router();
const writeController = require('../controllers/writeController');
const contentUploadMid = require('../middlewares/MDcontentUpload')
const imageUpload = require('../middlewares/MDimageUpload')

//获取全部留言信息
router.post('/imgUpload',imageUpload,writeController.imageUpload)
router.post('/ContentUpload',contentUploadMid.any(),writeController.ContentUpload)

module.exports = router;
