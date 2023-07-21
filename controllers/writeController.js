const fs = require('fs');
const path = require('path');
const writeModel = require('../models/writeModel');

const imageUpload = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: '请选择要上传的图片' });
  }


  res.status(200).json({ message: '图片上传成功' });
};
const ContentUpload = async (req, res) => {
  console.log(req.body)
  const { name, content, tags,title } = req.body;

  try {
    // 将Content上传至指定服务端静态资源文件夹位置
    const contentPath = path.join(__dirname, '../assets/mdStorage', name + '.md');
    console.log(contentPath,content)
    fs.writeFileSync(contentPath, content);

    // 将其他属性（例如设置的文件名、标签等属性）添加到数据库中
    const otherMsg = {
      name: name,
      tags: tags,
      title:title
    };

    // 使用writeModel将新数据保存到数据库
    const savedMsg = await writeModel.postOtherMsg(otherMsg);

    res.status(200).json(savedMsg);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '上传过程出错了' });
  }
};

module.exports = {
  ContentUpload,
  imageUpload
};
