const chatModel = require('../models/chatModel');
const fs = require('fs');
const path = require('path');
const sparkMD5 = require('spark-md5');

const fileMD5Arr = []

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

const mergeChunks = async (fileType, filename, fileExtension) => {
  try {
    const chunkDir = path.resolve(__dirname, `../assets/chunkDeal`);
    const chunks = await fs.promises.readdir(chunkDir);

    // 按照索引排序分片
    chunks.sort((a, b) => a - b);

    // 验证分片的MD5
    const valid = await validateChunksMD5(chunkDir, chunks, fileMD5Arr);
    if (!valid) {
      throw new Error('分片MD5验证失败');
    }
    const filePath = path.resolve(__dirname, `../assets/${fileType}Upload/${filename}.${fileExtension}`);
    
    const writeStream = fs.createWriteStream(filePath);

    // 合并分片
    for (const chunk of chunks) {
      const chunkPath = path.resolve(chunkDir, chunk);
      const readStream = fs.createReadStream(chunkPath);
    
      await new Promise((resolve, reject) => {
        readStream.pipe(writeStream, { end: false });
        readStream.on('end', () => {
          fs.unlinkSync(chunkPath);
          resolve();
        });
        readStream.on('error', (error) => {
          reject(error);
        });
      });
    }

    writeStream.on('finish', () => {
      fs.rmdirSync(chunkDir);
      // const url = `http://www.dyp02.vip:3000/assets/${fileType}Upload/${filename}.${fileExtension}`;
      const url = `http://localhost:3000/assets/${fileType}Upload/${filename}.${fileExtension}`
      return url; // 返回URL
    });

    const url = `http://localhost:3000/assets/${fileType}Upload/${filename}.${fileExtension}`
    return url; // 返回URL
  } catch (error) {
    console.error('合并分片失败', error);
    throw new Error('合并分片失败');
  }
};

const uploadChunk = async (req, res) => {
  try {
    const { index, totalChunks, fileMD5, fileType, filename, fileExtension } = req.body;
    const chunkDir = path.resolve(__dirname, `../assets/chunkDeal`);
    const filePath = path.resolve(__dirname,`../assets/${fileType}Upload/${filename}.${fileExtension}`)

    // const urlLast = `http://www.dyp02.vip:3000/assets/${fileType}Upload/${filename}.${fileExtension}`
    const urlLast = `http://localhost:3000/assets/${fileType}Upload/${filename}.${fileExtension}`

    if(fs.existsSync(filePath)){
      return res.json({
        success:true,
        message:'成功实现秒传',
        isOk:true,
        url:urlLast
      })
    }
    if (!fs.existsSync(chunkDir)) {
      fs.mkdirSync(chunkDir);
    }
    if(index==0){
      if(fileMD5Arr[0]===fileMD5){
        return res.json({ needUpload: true, uploadedChunks: fileMD5Arr.length-1 });
      }else{
        fileMD5Arr.length = 0
      }
    }

    const chunkPath = path.resolve(chunkDir, `${index}`);
    fileMD5Arr[index] = fileMD5
    await fs.promises.writeFile(chunkPath, req.file.buffer, { encoding: 'binary' });
    if (index == totalChunks - 1) {
      // 当所有分片上传完毕时，调用合并分片的函数
      const url = await mergeChunks(fileType, filename, fileExtension);

      fileMD5Arr.length=0
      return res.json({
        success:true,
        isOk:true,
        url:url
      })
    }

    res.json({ success: true, message: '分片上传成功' });
  } catch (error) {
    console.error('分片上传失败', error);
    res.json({ success: false, message: '分片上传失败' });
  }
};


const validateChunksMD5 = async (chunkDir, chunks, fileMD5s) => {
  try {
    for (let i = 0; i < chunks.length; i++) {
      const chunkPath = path.resolve(chunkDir, chunks[i]);
      const chunkMD5 = await calculateFileMD5(chunkPath);
      if (chunkMD5 !== fileMD5s[i]) {
        return false;
      }
    }
    return true;
  } catch (error) {
    console.error('MD5验证失败', error);
    return false;
  }
};

const calculateFileMD5 = (filePath) => {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(filePath);
    const spark = new sparkMD5.ArrayBuffer();

    stream.on('data', (chunk) => {
      spark.append(chunk);
    });

    stream.on('end', () => {
      const md5 = spark.end();
      resolve(md5);
    });

    stream.on('error', (error) => {
      reject(error);
    });
  });
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
