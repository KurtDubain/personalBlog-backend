const chatModel = require('../models/chatModel');

//获取所有留言的逻辑处理
const getAllChats = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const chatsData = await chatModel.getAllChats(page);
    const totalChats = await chatModel.getTotalChats()
    res.json({
      success:true,
      chats:chatsData,
      totalChats
    });
  } catch (error) {
    console.error('获取留言失败', error);
    res.status(500).json({ error: '未能获取留言信息' });
  }
};
// 留言表单中图片URL的上传保存
const imageUpload = async(req,res)=>{
  try{
    const imageUrl = await chatModel.imageUpload(req.file)
    res.json({imageUrl})
  }catch(error){
    console.error('图片上传失败',error);
    res.status(500).json({error:'图片未能成功上传'})
  }
}
// 留言表单的处理
const formUpload = async (req,res)=>{
  try{  
    await chatModel.FormUpload(req.body)
    res.json({success:true})
    
  }catch(error){
    console.error(error);
    res.status(500).json({error:'留言表单发送失败'})
  }
}

// 获取指定留言的内容
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
// 获取指定留言下的全部评论信息
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
// 发送对应留言下的评论的表单
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
