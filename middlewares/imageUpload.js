const multer = require('multer');
const path = require('path');

// 配置存储和文件命名
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../assets/imageUpload'); // 设置存储目录
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`; // 生成唯一的文件名
    const fileExtension = path.extname(file.originalname); // 获取文件扩展名
    const filename = `${uniqueSuffix}${fileExtension}`; // 拼接新文件名
    cb(null, filename);
  }
});

// 配置multer中间件
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // 检查文件类型，只接受特定的图片类型
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('只能上传图片文件'));
    }
  }
});

module.exports = upload;
