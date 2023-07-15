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
    console.error('图片上传失败');
    res.status(500).json({error:'图片未能成功上传'})
  }
}

const formUpload = async (req,res)=>{
  const content = req.body.content
  const image = req.body.image
  try{  
    await chatModel.formUpload(content,image)
    res.json({success:true})
    
  }catch(error){
    console.error('留言表单发送失败');
    res.status(500).json({error:'留言表单发送失败'})
  }
}



module.exports = {
  getAllChats,
  formUpload,
  imageUpload
};
