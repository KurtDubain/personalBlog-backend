const db = require('../config/dbConfig');
const moment = require('moment');
//获取全部留言的操作
const getAllChats = () => {
  return new Promise((resolve, reject) => {
    //SQL语句查询全部留言
    const query = 'SELECT id, name, date, content, contact FROM chats';
    db.query(query, (err, results) => {
      if (err) {
        console.error('所有留言查询失败');
        reject(err);
      } else {
        console.log('所有留言查询成功');
        //使用map生成数组对象，并使用moment来修改日期格式
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
