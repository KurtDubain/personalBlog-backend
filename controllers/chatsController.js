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
const imageUpload = async(req,res)=>{
  try{
    const imageUrl = await chatModel.imageUpload(req.file)
    res.json({imageUrl})
  }catch(error){
    console.error('图片上传失败',error);
    res.status(500).json({error:'图片未能成功上传'})
  }
}

const formUpload = async (req,res)=>{
  try{  
    await chatModel.FormUpload(req.body)
    res.json({success:true})
    
  }catch(error){
    console.error(error);
    res.status(500).json({error:'留言表单发送失败'})
  }
}

const getChatInfo = async(req,res)=>{
  const chatId = req.params.chatId
  try{
    const ChatInfo = await chatModel.getChatInfo(chatId)
    res.json(ChatInfo);
  }catch(error){
    console.error('获取指定留言失败');
    res.status(500).json({error:'获取指定留言失败'})

  }
}
const getChatCommentInfo = async(req,res)=>{
  const chatId = req.params.chatId

  try{
    const ChatCommentInfo = await chatModel.getChatCommentInfo(chatId)
    res.json(ChatCommentInfo);
  }catch(error){
    console.error('获取指定留言下的评论失败',error);
    res.status(500).json({error:'获取指定留言下的评论失败'})

  }

}
const postChatComment = async(req,res)=>{
  try{
    await chatModel.postChatComment(req.body)
    res.json({success:true})
  }catch(error){
    console.error('留言评论表单发送失败',error);
    res.status(500).json({error:'留言评论表单发送失败'})
  }
}

module.exports = {
  getAllChats,
  formUpload,
  imageUpload,
  getChatInfo,
  getChatCommentInfo,
  postChatComment
};
