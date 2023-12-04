// models/subscriptionModel.js
const db = require('../config/dbConfig')
// 订阅模型
// 判断用户是否已经注册，返回结果
const isUserRegistered = async (form) => {
  const selectSql = `SELECT * FROM users WHERE username = ? AND account = ?`;
  const [rows, fields] = await db.promise().query(selectSql, [form.name, form.account]);
  return rows.length > 0;
};

// 实现订阅操作
const SubItem = (form) => {
  return new Promise(async (resolve, reject) => {
    try {
      // 判断用户是否已注册
      const isRegistered = await isUserRegistered(form);
      if (!isRegistered) {
        reject(new Error('用户未注册'));
        return;
      }
      // 若用户已注册，则执行信息插入操作
      const selectSql = `SELECT * FROM subscriptions WHERE name = ? OR account = ?`;
      db.promise()
        .query(selectSql, [form.name, form.account])
        .then(([rows, fields]) => {
          // rows 是查询结果的数据部分
          if (rows.length > 0) {
            // 判断是否存在该用户
            const existingSubscription = rows.find(
              (row) => row.name === form.name && row.account === form.account
            );
            if (existingSubscription) {
              reject(new Error('该用户已经订阅'));
            } else {
              reject(new Error('用户信息错误'));
            }
          } else {
            // 用户不存在，插入订阅信息
            const insertSql = `INSERT INTO subscriptions (name, account) VALUES (?, ?)`;
            return db.promise().query(insertSql, [form.name, form.account]);
          }
        })
        .then(() => {
          resolve('该用户订阅成功');
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    } catch (error) {
      console.error(error);
    }
  });
};

// 取消订阅操作
const UnSubItem = (form) => {
  return new Promise((resolve, reject) => {
    try {
      const selectSql = `SELECT * FROM subscriptions WHERE name = ? AND account = ?`;
      db.promise()
        .query(selectSql, [form.name, form.account])
        .then(([rows, fields]) => {
          if (rows.length === 0) {
            // 直接判断是否存在，未存在则抛出异常
            reject(new Error('用户未订阅'));
          } else {
            // 执行delete命令直接删除用户数据
            const deleteSql = `DELETE FROM subscriptions WHERE name = ? AND account = ?`;
            return db.promise().query(deleteSql, [form.name, form.account]);
          }
        })
        .then(() => {
          resolve('用户删除成功');
        })
        .catch((error) => {
          reject(error);
        });
    } catch (error) {
      console.error(error);
    }
  });
};


module.exports = {
  SubItem,
  UnSubItem
};