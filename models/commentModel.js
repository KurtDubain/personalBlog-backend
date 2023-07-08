const db = require('../config/dbConfig')
const moment = require('moment')
//插入评论表单操作
const insertCommentForm = (formData) => {
    return new Promise((resolve, reject) => {
      //将表单信息插入制定数据库表格中
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
//获取指定文章下的评论信息
const getCommentsByArticleId = (articleId) => {
  //使用Promise处理数据库语句的异步操作
    return new Promise((resolve, reject) => {
      //未使用模板字符串来书写SQL语句，使用参数化形式执行，能够防止SQL注入攻击、提高可读性、方便处理参数类型的转换
      //查询评论表下的各个数据
      const query = 'SELECT id, content, name, contact, likes, created_Date FROM commenttotal WHERE article_id = ?';
      db.query(query, [articleId], (err, results) => {
        if (err) {
          console.error('指定文章评论获取失败');
          reject(err);
        } else {
          console.log('指定文章评论获取成功');
          //使用map遍历获取数据，生成一个数组对象，便于前端获取
          const commentsData = results.map(row => ({
            id: row.id,
            content: row.content,
            name: row.name,
            contact: row.contact,
            likes: row.likes,
            //使用moment修改日期格式
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