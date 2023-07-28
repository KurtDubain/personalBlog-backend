const likeModel = require('../models/likeModel');
// const { use } = require('../routes/articles');

// 获取指定种类的制定id的点赞情况
const getLikesbyItemId = async (req, res) => {
    // console.log(req.params);
    // 解析参数
    const { likeType, itemId, userId } = req.params;
    try{
        const likesData = await likeModel.getLikesByItemId(likeType, itemId, userId);
        res.json(likesData);
    }catch(error){
        console.error('未能获取指定点赞信息', error);
        res.status(500).json({ error: '未能获取指定点赞信息' });
    }
  };
  
//   发送点赞信息，对指定项目进行点赞
  const postLiked = async (req, res) => {
    const { likeType } = req.params;
    const { itemId, userId } = req.body;
    try{
        await likeModel.postLiked(likeType,itemId,userId);
        res.json({ message: '点赞成功' });
    }catch(error){
        console.error('未能正常提交点赞信息', error);
        res.status(500).json({ error: '未能正常提交点赞信息' });
    }
  };
  
//   发送取消点赞信息，对指定项目取消点赞，直接删除
  const postDisliked = async (req, res) => {
    const { likeType } = req.params;
    const { itemId, userId } = req.body;
    try{
        await likeModel.postDisliked(likeType,itemId,userId);
        res.json({ message: '取消点赞成功' });
    }catch(error){
        console.error('未能正常删除点赞信息', error);
        res.status(500).json({ error: '未能正常删除点赞信息' });
    }
  };
  
module.exports = {
    getLikesbyItemId,
    postDisliked,
    postLiked
};
