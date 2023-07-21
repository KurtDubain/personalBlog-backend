const multer = require('multer');
const path = require('path');

// 创建multer实例
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 指定文件保存的路径
    cb(null, path.join(__dirname, '../assets'));
  },
  filename: function (req, file, cb) {
    // 指定文件名，这里使用原始文件名
    cb(null, file.originalname);
  },
});

const uploadContent = multer({ storage });

// 导出中间件
module.exports = uploadContent;
