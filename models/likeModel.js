const db = require('../config/dbConfig');
// const moment = require('moment');

// 获取点赞信息
const getLikesByItemId = (likeType, itemId, userId) => {
  return new Promise((resolve, reject) => {
    let tableName
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

// 点赞
const postLiked = (likeType, itemId, userId) => {
  return new Promise((resolve, reject) => {
    let tableName
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
    let tableName
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
