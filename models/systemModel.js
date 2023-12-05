// models/subscriptionModel.js
const db = require('../config/dbConfig')
// 订阅模型

const visitThat = ({currentDate,userIP,userAgent}) => {
  return new Promise(async (resolve, reject) => {
    const insertSql = 'insert into visitor_data (visit_time,ip,user_agent) values(?,?,?)'
    db.promise()
      .query(insertSql,[currentDate,userIP,userAgent])
      .then(resolve())
      .catch(error=>{
        console.error(error,'访问信息数据库插入异常');
        reject(error)
      })
  });
};

// 取消订阅操作
const getTodayVisitCount = (date) => {
  return new Promise((resolve, reject) => {
    const selectSql = 'select count(*) as count from visitor_data where date(visit_time) = ?'
    db.promise()
      .query(selectSql,[date])
      .then(([rows])=>resolve(rows[0].count))
      .catch(error=>{
        console.error('数据库查找当日访问信息失败',error);
        reject(error)
      })
  });
};

const getTotalVisitCount = ()=>{
  return new Promise((resolve,reject)=>{
    const selectSql = 'select count(*) as count from visitor_data'
    db.promise()
      .query(selectSql)
      .then(([rows])=>resolve(rows[0].count))
      .catch(error=>{
        console.error('数据库查找总访问信息失败',error);
        reject(error)
      })
  })
}

const getWeekData = () =>{
  return new Promise((resolve,reject)=>{
    const selectSql = 'SELECT DATE(visit_time) as day, COUNT(*) as count FROM visitor_data WHERE visit_time >= CURDATE() - INTERVAL 6 DAY GROUP BY day'
    db.promise()
      .query(selectSql)
      .then(([rows])=>resolve(rows))
      .catch(error=>{
        console.error('数据库查找一周访问信息失败',error);
        reject(error)
      })
  })
}


module.exports = {
  visitThat,
  getTodayVisitCount,
  getTotalVisitCount,
  getWeekData
};