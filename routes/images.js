const express = require('express');
const router = express.Router();
const imagesController = require('../controllers/imagesController');

// 对于留言图片上传的处理
router.get('/imgUpload/:imgUrl',imagesController.getUploadimg)
// 对于用户上传的图片处理
router.get('/imgForOwner/:imgUrl',imagesController.getOwners)

module.exports = router;
