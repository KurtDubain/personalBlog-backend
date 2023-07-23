const db = require('../config/dbConfig');
// const moment = require('moment');

// 将文章信息存入到数据库中
const postOtherMsg = (otherMsg)=>{
    return new Promise((resolve,reject)=>{
    
    const query = 'insert into articles (title,date,tags,views,id) values(?,?,?,?,?)';
  
      db.query(query,[otherMsg.title,new Date(),otherMsg.tags,1,otherMsg.name], (err, results) => {
        if (err) {
          console.error('表单提交失败');
          reject(err);
        } else {
          
          resolve({success:true});
        }
      });
    });
  }

module.exports={
    postOtherMsg
}