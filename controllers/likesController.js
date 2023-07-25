const likeModel = require('../models/likeModel');
// const { use } = require('../routes/articles');

const getLikesbyItemId = async (req, res) => {
    // console.log(req.params);
    const { likeType, itemId, userId } = req.params;
    try{
        const likesData = await likeModel.getLikesByItemId(likeType, itemId, userId);
        res.json(likesData);
    }catch(error){
        console.error('未能获取指定点赞信息', error);
        res.status(500).json({ error: '未能获取指定点赞信息' });
    }
  };
  
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
