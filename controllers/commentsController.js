const commentModel = require('../models/commentModel');
//表单数据处理逻辑
const submitCommentForm = async (req, res) => {
    try {

      // console.log('测试Vuex',req.body);

      const formData = req.body; // 获取表单数据
      //异步等待文章信息处理
      const insertedData = await commentModel.insertCommentForm(formData);
  
      res.json({ message: '评论表单提交成功',
                data:insertedData });
    } catch (error) {
      console.error('未能正常提交评论表单', error);
      res.status(500).json({ error: '未能正常提交评论表单' });
    }
  };
//指定文章评论处理逻辑
const getCommentsByArticleId = async (req, res) => {
    const articleId = req.params.articleId;//获取文章Id参数
    try {
      //异步等待文章Id信息处理，返回对应评论
      const comments = await commentModel.getCommentsByArticleId(articleId);
      res.json(comments);
    } catch (error) {
      console.error('未能获取文章评论', error);
      res.status(500).json({ error: '未能获取文章评论' });
    }
  };

module.exports = {
    getCommentsByArticleId,
    submitCommentForm
};
