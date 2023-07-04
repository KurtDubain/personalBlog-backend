const db = require('../config/dbConfig')
const moment = require('moment')

const insertCommentForm = (formData) => {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO commenttotal (article_id, content, name,contact,likes,created_Date) VALUES (?, ?, ?,?,?,?)';
      const values = [
        formData.articleId,
        formData.content,
        formData.name,
        formData.contact,
        0, // 初始化 likes 为 0
        new Date(), // 使用当前日期作为 created_Date
      ];
      db.query(query, values, (err, results) => {
        if (err) {
          console.error('未能成功插入表单数据', err);
          reject(err);
        } else {
          console.log('成功插入表单数据', results);
          resolve(results);
        }
      });
    });
  };

const getCommentsByArticleId = (articleId) => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT id, content, name, contact, likes, created_Date FROM commenttotal WHERE article_id = ?';
      db.query(query, [articleId], (err, results) => {
        if (err) {
          console.error('指定文章评论获取失败');
          reject(err);
        } else {
          console.log('指定文章评论获取成功');
          const commentsData = results.map(row => ({
            id: row.id,
            content: row.content,
            name: row.name,
            contact: row.contact,
            likes: row.likes,
            created_Date: moment(row.created_Date).format('YYYY-MM-DD HH:mm'),
          }));
          resolve(commentsData);
        }
      });
    });
  };

module.exports={
    insertCommentForm,
    getCommentsByArticleId

}