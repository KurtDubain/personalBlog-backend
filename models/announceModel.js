const db = require('../config/dbConfig')
const moment = require('moment');

// 获取公告列表
const GetItemByNum = () => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM announce ORDER BY created_at DESC LIMIT 6';
    db.query(query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        const announceData = results.map((announcement)=>{
            return{
                id:announcement.id,
                created_at:moment(announcement.created_at).format('YYYY-MM-DD HH:mm'),
                content:announcement.content,
                author:announcement.author,
                is_top:announcement.is_top
            }
        })
        resolve(announceData);
      }
    });
  });
};

// 创建新公告
const PostItem = (author,content) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO announce (created_at, content, author, is_top) VALUES (?, ?, ?, ?)';
    const values = [new Date(), content, author,false];
    db.query(query, values, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

module.exports = {
  GetItemByNum,
  PostItem
};
