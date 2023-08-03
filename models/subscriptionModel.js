// models/subscriptionModel.js
const db = require('../config/dbConfig')
// 订阅模型

const SubItem = (form) => {
  return new Promise((resolve, reject) => {
    try {
      const selectSql = `SELECT * FROM subscriptions WHERE name = ? OR account = ?`;
      db.promise()
        .query(selectSql, [form.name, form.account])
        .then(([rows, fields]) => {
          // rows 是查询结果的数据部分
          if (rows.length > 0) {
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
          console.log(error);
          reject(error);
        });
    } catch (error) {
      console.error(error);
    }
  });
};


const UnSubItem = (form) => {
  return new Promise((resolve, reject) => {
    try {
      const selectSql = `SELECT * FROM subscriptions WHERE name = ? AND account = ?`;
      db.promise()
        .query(selectSql, [form.name, form.account])
        .then(([rows, fields]) => {
          if (rows.length === 0) {
            reject(new Error('用户未订阅'));
          } else {
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