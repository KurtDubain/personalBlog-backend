const multer = require('multer');
const upload = multer();
const path = require('path');

// const addCustomRandomName = (req, res, next) => {
//     // console.log('表单的数据为',req.body)
//     const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
//     req.body.filename = uniqueSuffix; // 设置 customRandomName 属性的值
//     next();
// };

module.exports = {
  uploadAndAddName: (req, res, next) => {
    // console.log("一开始的数据",req.body)
    upload.single('file')(req, res, (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: '文件上传失败' });
      }
      next()
      // addCustomRandomName(req, res, next);
      // console.log('file中的数据',req.file)
      // console.log('body中的数据',req.body)
    });
  }
};
