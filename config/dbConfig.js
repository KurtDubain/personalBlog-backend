const mysql = require('mysql2');

// 数据库部分的配置

// 数据库的连接的创建
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'blog',
});

// const connection = pool.promise()

connection.connect((err) => {
  if (err) {
    console.error('数据库连接失败');
  } else {
    console.log('数据库连接成功');
  }
});



module.exports = connection;
