const chatModel = require('../models/chatModel');

//获取所有留言的逻辑处理
const getAllChats = async (req, res) => {
  try {
    const chats = await chatModel.getAllChats();
    res.json(chats);
  } catch (error) {
    console.error('获取留言失败', error);
    res.status(500).json({ error: '未能获取留言信息' });
  }
};



module.exports = {
  getAllChats,
};
