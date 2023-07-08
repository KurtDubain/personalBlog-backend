const db = require('../config/dbConfig');
const moment = require('moment');

const getAllArticles = () => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT id, title, date, tags FROM articles';
    db.query(query, (err, results) => {
      if (err) {
        console.error('文章全部检索查询失败');
        reject(err);
      } else {
        console.log('文章全部检索查询成功');
        const articlesData = results.map(row => ({
          id: row.id,
          title: row.title,
          date: moment(row.date).format('YYYY-MM-DD HH:mm'),
          tags: row.tags,
        }));
        resolve(articlesData);
      }
    });
  });
};

const getArticleById = (articleId) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT title, date, tags, views, `like`, commentsNum FROM articles WHERE id = ?';
    db.query(query, [articleId], (err, results) => {
      if (err) {
        console.error('指定文章查询失败');
        reject(err);
      } else {
        console.log('指定文章查询成功');
        const article = results.map(row => ({
          tags: row.tags,
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
const getArticleCtlTitles=(articleId)=>{
  return new Promise((resolve, reject) => {
    const query = 'SELECT title FROM articles WHERE id in(?,?)';
    db.query(query, [parseInt(articleId)-1,parseInt(articleId)+1 ], (err, results) => {
      if (err) {
        console.error('文章前后标题查询失败');
        reject(err);
      } else {
        console.log('文章前后标题查询成功');
        const ctlTitles = results.map(row => ({
          title:row.title,

        }));
        // console.log(ctlTitles)
        resolve(ctlTitles);
      }
    });
  });
}

const getLastId = () => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT id FROM articles ORDER BY id DESC LIMIT 1';
    db.query(query, (err, results) => {
      if (err) {
        console.error('最后一个文章号检索查询失败');
        reject(err);
      } else {
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
