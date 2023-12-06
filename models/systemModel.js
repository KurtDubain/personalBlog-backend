// 系统数据数据模型
const db = require('../config/dbConfig')

// 用于记录访客到访记录
const visitThat = ({currentDate,ip,userAgent}) => {
  return new Promise(async (resolve, reject) => {
    const insertSql = 'insert into visitor_data (visit_time,ip,user_agent) values(?,?,?)'
    db.promise()
      .query(insertSql,[currentDate,ip,userAgent])
      .then(resolve())
      .catch(error=>{
        console.error(error,'访问信息数据库插入异常');
        reject(error)
      })
  });
};

// 用于获取当日访客数据
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

// 用于记录全部访客数据
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

// 用于获取近一周内的访客数据，返回格式为xxxx-xx-xx
const getWeekData = () =>{
  return new Promise((resolve,reject)=>{
    const selectSql = 'SELECT DATE(visit_time) as day, COUNT(*) as count FROM visitor_data WHERE visit_time >= CURDATE() - INTERVAL 6 DAY GROUP BY day'
    db.promise()
      .query(selectSql)
      .then(([rows])=>{
        const results = rows.map(row => {
          const date = new Date(row.day);
          const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        
          return {
            day: formattedDate,
            count: row.count
          };
        });
        resolve(results)
      })  
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