const articleModel = require('../models/articleModel');
const fs = require('fs');
const path = require('path');

// 获取全部文章（分页获取）
const getAllArticles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // 从请求参数中获取当前页码，默认为第一页
    const size = req.query.size // 从请求参数中获取当前文章栏容量
    const articlesData = await articleModel.getAllArticles(page,size); // 调用 model 中的函数获取分页文章数据
    const totalArticles = await articleModel.getTotalArticles(); // 调用 model 中的函数获取文章总数
    const totalPages = Math.ceil(totalArticles / articleModel.ITEMS_PER_PAGE); // 计算总页数

    // 将获取到的数据发送给客户端
    res.json({
      success: true,
      articles: articlesData,
      totalArticles,
      totalPages,
    });
  } catch (error) {
    console.error('获取文章时出现错误:', error);
    res.status(500).json({
      success: false,
      message: '获取文章时出现错误',
    });
  }
};
// 获取不同分类下的文章数据
const getArticlesByTag = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // 从请求参数中获取当前页码，默认为第一页
    const tag = req.query.currentCategory //获取当前的分类标签
    const size = req.query.size //获取当前的页面容量
    const articlesData = await articleModel.getArticlesByTag(page,tag,size); // 调用 model 中的函数获取分页文章数据
    const totalArticles = await articleModel.getTotalArticlesByTag(tag); // 调用 model 中的函数获取文章总数
    // console.log("分类文章处理成功",articlesData,totalArticles);
    // 将获取到的数据发送给客户端
    res.json({
      success: true,
      articles: articlesData,
      totalArticles,
    });
  } catch (error) {
    console.error('获取文章时出现错误:', error);
    res.status(500).json({
      message: '获取文章时出现错误',
    });
  }
};
// 获取搜索状态下的文章数据
const getSearchedArticles = async (req, res)=>{
  try{
    const { keyword, page, size} = req.query //解构获取关键字、当前页码、页面容量信息
    const articles = await articleModel.getSearchedArticles(keyword, page, size) // 获取当前页面当前搜索关键字的文章数据
    const totalArticles = await articleModel.getTotalSearchedArticles(keyword) // 获取当前搜索获取的文章总数
    res.json({
      success: true,
      articles,
      totalArticles
    })
  }catch(error){
    console.error('搜索文章异常',error);
    res.status(500).json({
      error:'error!'
    })
  }
}

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
      // console.log('文章内容读取成功');
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
    // console.log('最后一个id查询成功',lastId)
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
  getLastId,
  getArticlesByTag,
  getSearchedArticles
};
