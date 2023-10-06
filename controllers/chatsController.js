const chatModel = require('../models/chatModel');
const fs = require('fs');
const path = require('path');
const spark = require('spark-md5');


//获取所有留言的逻辑处理
const getAllChats = async (req, res) => {
  try {
    // 分别获取当前的页面数据和容量数据
    const page = parseInt(req.query.page) || 1
    const size = req.query.size
    // 获取当前页面的留言数据以及留言总量
    const chatsData = await chatModel.getAllChats(page,size);
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
// 获取搜索状态下的留言数据
const getSearchChats = async (req,res) =>{
  try{
    // 获取搜索关键字、页码、页面容量
    const {keyword, page, size} = req.query
    // 获取当前搜索状态下的留言数据和留言总量
    const chats = await chatModel.getSearchChats(keyword, page, size)
    const totalChats = await chatModel.getTotalSearchChats(keyword)
    res.json({
      success:true,
      chats,
      totalChats
    })
  }catch(error){
    console.error(error);
    res.status(500).json({error:'未能获取搜索留言信息'})
  }
}

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

const uploadChunk = async (req,res)=>{
  try {
    const {  fileExtension,totalChunks, chunkIndex,fileMD5,fileType,filename } = req.body;
    const filePath = path.join(__dirname, `../assets/${fileType}Upload`, `${filename}_${chunkIndex}`);
    const writeStream = fs.createWriteStream(filePath, { flags: 'a' });
    writeStream.write(req.file.buffer, 'base64');

    if (parseInt(chunkIndex, 10) === parseInt(totalChunks, 10) ) {
      writeStream.end();
      
      const url = await mergeChunks(filename, totalChunks, fileType, fileMD5,fileExtension);
      res.json({ success: true, url });
    } else {
      res.json({ success: true });
    }
  } catch (error) {
    console.error('分片上传失败', error);
    res.json({ success: false, message: '分片上传失败' });
  }

}
// 合并分片并返回文件URL
// const mergeChunks = async (filename, totalChunks, type, clientMD5,fileExtension) => {
//   try {
//     console.log(totalChunks)
//     if(totalChunks==1){
//       console.log(`执行了他`)
//       const oldChunkPath = path.join(__dirname, `../assets/${type}Upload`, `${filename}_1`);
//       const newFilePath = path.join(__dirname, `../assets/${type}Upload`, `${filename}.${fileExtension}`);
//       await fs.promises.rename(oldChunkPath, newFilePath);
//     }else{
//       console.log(`哈哈哈哈哈`)
//       const filePath = path.join(__dirname, `../assets/${type}Upload`, `${filename}.${fileExtension}`);
//       const writeStream = fs.createWriteStream(filePath);

//       const md5 = new spark(); // 创建 Spark MD5

//       for (let i = 1; i <= totalChunks; i++) {
//         const chunkPath = path.join(__dirname, `../assets/${type}Upload`, `${filename}_${i}`);
//         const chunkData = await fs.promises.readFile(chunkPath);
//         // console.log(`已经执行了${i}个`)
//         md5.append(chunkData); // 更新 MD5 值

//         writeStream.write(chunkData);
//         await fs.promises.unlink(chunkPath); // 删除已合并的分片
//       }

//       writeStream.end();
//     }

//     // const md5Value = md5.end(); // 计算最终 MD5 值

//     // if (md5Value !== clientMD5) {
//     //   throw new Error('MD5 校验失败');
//     // }

//     const publicUrl = `http://www.dyp02.vip:3000/assets/${type}Upload/${filename}.${fileExtension}`;
//     return publicUrl;
//   } catch (error) {
//     console.error('合并分片失败', error);
//     throw new Error('合并分片失败');
//   }
// };
const mergeChunks = async (filename, totalChunks, type, clientMD5, fileExtension) => {
  try {
    console.log(totalChunks);
    if (totalChunks === 1) {
      console.log(`执行了单文件合并`);
      const oldChunkPath = path.join(__dirname, `../assets/${type}Upload`, `${filename}_1`);
      const newFilePath = path.join(__dirname, `../assets/${type}Upload`, `${filename}.${fileExtension}`);
      await fs.promises.rename(oldChunkPath, newFilePath);
    } else {
      console.log(`执行多文件合并`);
      const filePath = path.join(__dirname, `../assets/${type}Upload`, `${filename}.${fileExtension}`);
      const writeStream = fs.createWriteStream(filePath);

      const md5 = new spark(); // 创建 Spark MD5

      for (let i = 1; i <= totalChunks; i++) {
        const chunkPath = path.join(__dirname, `../assets/${type}Upload`, `${filename}_${i}`);
        const chunkData = await fs.promises.readFile(chunkPath);
        md5.append(chunkData); // 更新 MD5 值

        writeStream.write(chunkData);
      }

      writeStream.end();

      // 删除分片
      for (let i = 1; i <= totalChunks; i++) {
        const chunkPath = path.join(__dirname, `../assets/${type}Upload`, `${filename}_${i}`);
        await fs.promises.unlink(chunkPath); // 删除已合并的分片
      }
    }

    const publicUrl = `http://www.dyp02.vip:3000/assets/${type}Upload/${filename}.${fileExtension}`;
    return publicUrl;
  } catch (error) {
    console.error('合并分片失败', error);
    throw new Error('合并分片失败');
  }
};



module.exports = {
  getAllChats,
  formUpload,
  imageUpload,
  getChatInfo,
  getChatCommentInfo,
  postChatComment,
  getSearchChats,
  mergeChunks,
  uploadChunk
};
