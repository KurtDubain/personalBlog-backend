const chatModel = require('../models/chatModel');

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
