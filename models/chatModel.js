const db = require('../config/dbConfig');
const moment = require('moment');

const getAllChats = () => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT id, name, date, content, contact FROM chats';
    db.query(query, (err, results) => {
      if (err) {
        console.error('所有留言查询失败');
        reject(err);
      } else {
        console.log('所有留言查询成功');
        const chatsData = results.map(row => ({
          id: row.id,
          name: row.name,
          date: moment(row.date).format('YYYY-MM-DD HH:mm'),
          content: row.content,
          contact: row.contact,
        }));
        resolve(chatsData);
      }
    });
  });
};



module.exports = {
  getAllChats,
};
