const mysql = require('mysql2');


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'blog',
});

connection.connect((err) => {
  if (err) {
    console.error('数据库连接失败');
  } else {
    console.log('数据库连接成功');
  }
});



module.exports = connection;
