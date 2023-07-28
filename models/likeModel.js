const db = require('../config/dbConfig');
// const moment = require('moment');

// 获取点赞信息以及参数
const getLikesByItemId = (likeType, itemId, userId) => {
  return new Promise((resolve, reject) => {
    // 定义表名
    let tableName
    // 定义表名下对应的属性名
    let item
    // 使用判断,对类别进行判断,进行查询
    if(likeType === 'article' ){
        tableName = 'articleslikes'
        item = 'aid'
    }else if(likeType === 'comment'){
        tableName = 'commentslikes'
        item = 'coid'
    }else if(likeType === 'chat'){
        tableName = 'chatslikes'
        item = 'cid'
    }else if(likeType === 'chatcomment'){
        tableName = 'chatscommentslikes'
        item = 'cid'
    }else{
        reject(new Error('不正确的属性'))
        return
    }
    // 通过对变量加工,便于即便是使用模版变量也不会有很大的危险
    const countSql = `SELECT COUNT(*) AS likeCount FROM ${tableName} WHERE ${item} = ?`;
    const userLikeSql = `SELECT COUNT(*) AS userLikeCount FROM ${tableName} WHERE ${item} = ? AND uId = ?`;
    db.query(countSql, [itemId], (err, countResults) => {
      if (err) {
        reject(err);
      } else {
        const likeCount = countResults[0].likeCount

        db.query(userLikeSql,[itemId,userId],(err,userLikeResults)=>{
          if(err){
            reject(err)
          }
          else{

            const userLiked = userLikeResults[0].userLikeCount >0
            resolve({likeCount,userLiked})
          }
        })
      }
    });
  });
};

// 点赞操作
const postLiked = (likeType, itemId, userId) => {
  return new Promise((resolve, reject) => {
    // 数据库表名
    let tableName
    // 数据库列名
    let item
    if(likeType === 'article' ){
        tableName = 'articleslikes'
        item = 'aid'
    }else if(likeType === 'comment'){
        tableName = 'commentslikes'
        item = 'coid'
    }else if(likeType === 'chat'){
        tableName = 'chatslikes'
        item = 'cid'
    }else if(likeType === 'chatcomment'){
        tableName = 'chatscommentslikes'
        item = 'cid'
    }else{
        reject(new Error('不正确的属性'))
        return
    }
    // 对对应的表进行插入操作
    const sql = `INSERT INTO ${tableName} (${item}, uid, created_at) VALUES (?,?, ?)`
    db.query(sql, [itemId,userId,new Date()], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// 取消点赞
const postDisliked = (likeType, itemId, userId) => {
  return new Promise((resolve, reject) => {
    // 数据库表名
    let tableName
    // 数据库列名
    let item
    if(likeType === 'article' ){
        tableName = 'articleslikes'
        item = 'aid'
    }else if(likeType === 'comment'){
        tableName = 'commentslikes'
        item = 'coid'
    }else if(likeType === 'chat'){
        tableName = 'chatslikes'
        item = 'cid'
    }else if(likeType === 'chatcomment'){
        tableName = 'chatscommentslikes'
        item = 'cid'
    }else{
        reject(new Error('不正确的属性'))
        return
    }
    // 执行删除操作,通过删除,直接删除点赞历史
    const sql = `delete from ${tableName} where ${item} = ? and uid = ?`;
    db.query(sql, [itemId,userId], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

module.exports = {
  getLikesByItemId,
  postLiked,
  postDisliked,
};
