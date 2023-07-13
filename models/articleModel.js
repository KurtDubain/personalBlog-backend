const db = require('../config/dbConfig');
const moment = require('moment');

//获取所有文章的数据库操作
const getAllArticles = () => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT id, title, date, tags FROM articles';
    db.query(query, (err, results) => {
      if (err) {
        console.error('文章全部检索查询失败');
        reject(err);
      } else {
        console.log('文章全部检索查询成功');
        //使用map遍历生成数组对象， 使用moment用于解析日期格式
        const articlesData = results.map(row => ({
          id: row.id,
          title: row.title,
          date: moment(row.date).format('YYYY-MM-DD HH:mm'),
          tags: row.tags.tags,
        }));
        console.log(articlesData)
        resolve(articlesData);
      }
    });
  });
};
//获取指定文章信息的操作
const getArticleById = (articleId) => {
  return new Promise((resolve, reject) => {
    //获取指定文章的信息
    const query = 'SELECT title, date, tags, views, `like`, commentsNum FROM articles WHERE id = ?';
    db.query(query, [articleId], (err, results) => {
      if (err) {
        console.error('指定文章查询失败');
        reject(err);
      } else {
        console.log('指定文章查询成功');
        //使用map处理生成数组对象，使用moment生成指定格式
        const article = results.map(row => ({
          tags: row.tags.tags,
          commentsNum: row.commentsNum,
          title: row.title,
          date: moment(row.date).format('YYYY-MM-DD HH:mm'),
          like: row.like,
          views: row.views,
        }));
        resolve(article);
      }
    });
  });
};
//获取指定文章前后标题信息
const getArticleCtlTitles=(articleId)=>{
  return new Promise((resolve, reject) => {
    //使用参数化查询，不过需要先用parseInt转化一下数据类型进行计算
    const query = 'SELECT title FROM articles WHERE id in(?,?)';
    db.query(query, [parseInt(articleId)-1,parseInt(articleId)+1 ], (err, results) => {
      if (err) {
        console.error('文章前后标题查询失败');
        reject(err);
      } else {
        console.log('文章前后标题查询成功');
        //使用map遍历，其中第一个数据是前一个标题，第二个数据是后一个标题，当只收到一个标题的时候（当前为第一个文章），前端自行特殊处理
        const ctlTitles = results.map(row => ({
          title:row.title,

        }));
        // console.log(ctlTitles)
        resolve(ctlTitles);
      }
    });
  });
}
//获取文章最后一个id的操作
const getLastId = () => {
  return new Promise((resolve, reject) => {
    //通过倒数获取第一个数据
    const query = 'SELECT id FROM articles ORDER BY id DESC LIMIT 1';
    db.query(query, (err, results) => {
      if (err) {
        console.error('最后一个文章号检索查询失败');
        reject(err);
      } else {
        //只有一个数据，无须使用map
          const lastId = results[0].id
          console.log('最后一个文章号检索查询成功',lastId);
          resolve(lastId);
      }
    });
  });
};

module.exports = {
  getAllArticles,
  getArticleById,
  getArticleCtlTitles,
  getLastId
};
