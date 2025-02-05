const mysql = require("mysql2");

// 数据库部分的配置

// 数据库的连接的创建
// const connection = mysql.createConnection({
//   // host: 'localhost',
//   // user: 'blog',
//   // password: '20020220duyi+',
//   // database: 'blog',
//   host:'localhost',
//   user:'root',
//   password:'123456',
//   database:'blog'
// });

// const connection = pool.promise()

// connection.connect((err) => {
//   if (err) {
//     console.error('数据库连接失败');
//   } else {
//     console.log('数据库连接成功');
//   }
// });

function handleDisconnect() {
  connection = mysql.createConnection({
    // host: 'localhost',
    // user: 'root',
    // password: '123456',
    // database: 'blog'
    host: "localhost",
    user: "blog",
    password: "20020220duyi+",
    database: "blog",
  });

  connection.connect((err) => {
    if (err) {
      console.error("数据库连接失败");
      console.error(err);
      setTimeout(handleDisconnect, 2000); // 等待2秒后尝试重新连接
    } else {
      console.log("数据库连接成功");
    }
  });

  connection.on("error", (err) => {
    console.error("数据库连接错误");
    console.error(err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      handleDisconnect(); // 连接丢失时重新连接
    } else {
      throw err;
    }
  });
}

handleDisconnect();

module.exports = connection;
