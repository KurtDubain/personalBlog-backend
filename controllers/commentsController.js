const commentModel = require('../models/commentModel');

const submitCommentForm = async (req, res) => {
    try {
      const formData = req.body; // 表单数据
  
      const insertedData = await commentModel.insertCommentForm(formData);
  
      res.json({ message: '评论表单提交成功',
                data:insertedData });
    } catch (error) {
      console.error('未能正常提交评论表单', error);
      res.status(500).json({ error: '未能正常提交评论表单' });
    }
  };

const getCommentsByArticleId = async (req, res) => {
    const articleId = req.params.articleId;
    try {
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
