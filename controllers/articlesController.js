const articleModel = require('../models/articleModel');
const fs = require('fs');
const path = require('path');
//获取所有文章信息的逻辑处理
const getAllArticles = async (req, res) => {
  try {
    const articles = await articleModel.getAllArticles();
    res.json(articles);
  } catch (error) {
    console.error('文章罗列失败:', error);
    res.status(500).json({ error: '文章罗列失败' });
  }
};
//获取指定文章信息的逻辑处理
const getArticleById = async (req, res) => {
  const articleId = req.params.articleId;
  try {
    const article = await articleModel.getArticleById(articleId);
    res.json(article);
  } catch (error) {
    console.error('精确查找文章失败', error);
    res.status(500).json({ error: '精确查找文章失败' });
  }
};
//获取指定文章内容的逻辑处理
const getArticleContent = (req, res) => {
  const articleId = req.params.articleId;
  //文章内容和文章信息是分开存储的，所以需要读取服务端的文件资源
  const filePath = path.join(__dirname, '../assets/mdStorage', `${articleId}.md`);
  //同步读取，编码格式为utf-8
  fs.readFile(filePath, 'utf8', (error, content) => {
    if (error) {
      console.error('未能读取文章内容', error);
      return res.status(500).json({ error: '未能读取文章内容' });
    } else {
      console.log('文章内容读取成功');
      res.send(content);
    }
  });
};
//获取指定文章前后文章标题的逻辑处理
const getArticleCtlTitles = async(req,res)=>{
  const articleId = req.params.articleId
  try{
    const ctlTitles = await articleModel.getArticleCtlTitles(articleId)
    res.json(ctlTitles)
  }catch(error){
    console.error('文章前后标题查找失败',error)
    res.status(500).json({error:'文章前后标题查找失败'})
  }
}
//获取最后一个文章的id的逻辑处理
const getLastId = async(req,res)=>{
  try {
    const lastId = await articleModel.getLastId();
    console.log('最后一个id查询成功',lastId)
    res.json(lastId);
  } catch (error) {
    console.error('最后一个标题获取失败:', error);
    res.status(500).json({ error: '最后一个标题获取失败' });
  }
}
module.exports = {
  getAllArticles,
  getArticleById,
  getArticleCtlTitles,
  getArticleContent,
  getLastId
};
