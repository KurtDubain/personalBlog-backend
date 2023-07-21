const multer = require('multer');
const fs = require('fs');
const path = require('path');

// 配置multer，用于处理上传的图片
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../assets/imageForOwners')); // 将上传的图片保存在imageForOwners文件夹中
  },
  filename: function (req, file, cb) {
    // 手动添加文件扩展名
    const fileExtension = file.mimetype.split('/')[1];
    const filename = file.originalname + '.' + fileExtension;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

// 导出中间件
module.exports = upload.single('image'); // 'image' 是你前端上传图片时的字段名
