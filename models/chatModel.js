const db = require('../config/dbConfig');
const moment = require('moment');
const fs = require('fs')
const path = require('path');

// 获取全部留言数据的操作，进行分页操作
const getAllChats = (page,size) => {
  return new Promise((resolve, reject) => {
    try {
      const offset = (page - 1) * size; // 计算分页偏移量
      const query = `
        SELECT 
          c.id,
          c.username,
          c.date,
          c.content,
          c.views,
          c.account,
          COUNT(l.id) AS likes,
          COUNT(r.id) AS reply,
          c.user_id,
          c.imgUrl
        FROM chats AS c
        LEFT JOIN chatslikes AS l ON c.id = l.cid
        LEFT JOIN chatcomments AS r ON c.id = r.cid
        GROUP BY c.id
        ORDER BY c.date DESC
        LIMIT ?, ?;`; // 查询分页留言的SQL语句

      const queryParams = [offset, Number(size)]; // 查询参数
      db.query(query, queryParams, (error, results) => {
        if (error) {
          console.error('获取分页留言时出现错误:', error);
          reject(error);
        } else {
          // 处理查询结果并返回数据
          const chatsData = results.map(row => ({
            id: row.id,
            username: row.username,
            date: moment(row.date).format('YYYY-MM-DD HH:mm'),
            content: row.content,
            account: row.account,
            likes: row.likes,
            views: row.views,
            reply: row.reply,
            user_id: row.user_id,
            imgUrl: row.imgUrl
          }));

          resolve(chatsData);
        }
      });
    } catch (error) {
      console.error('获取分页留言时出现错误:', error);
      reject(error);
    }
  });
};

// 获取全部留言数目
const getTotalChats = () => {
  return new Promise((resolve, reject) => {
    try {
      const query = 'SELECT COUNT(*) AS total FROM chats;';
      db.query(query, (err, results) => {
        if (err) {
          console.error('获取留言总数时出现错误:', error);
          reject(err);
        } else {
          resolve(results[0].total);
        }
      });
    } catch (error) {
      console.error('获取留言总数时出现错误:', error);
      reject(error);
    }
  });
};
// 获取当前关键字下的文章数据
const getSearchChats = (keyword, page, size) => {
  return new Promise((resolve, reject) => {
    try {
      const offset = (page - 1) * size;
      const query = `
        SELECT 
          c.id,
          c.username,
          c.date,
          c.content,
          c.views,
          c.account,
          COUNT(l.id) AS likes,
          COUNT(r.id) AS reply,
          c.user_id,
          c.imgUrl
        FROM chats AS c
        LEFT JOIN chatslikes AS l ON c.id = l.cid
        LEFT JOIN chatcomments AS r ON c.id = r.cid
        WHERE c.content LIKE ?
        or c.username like ?
        GROUP BY c.id
        ORDER BY c.date DESC
        LIMIT ?, ?;
      `;

      const queryParams = [`%${keyword}%`,`%${keyword}%`, offset,  Number(size)];
      // 根据用户名和文章内容进行模糊搜索
      db.query(query, queryParams, (error, results) => {
        if (error) {
          console.error('获取搜索留言时出现错误:', error);
          reject(error);
        } else {
          const chatsData = results.map(row => ({
            id: row.id,
            username: row.username,
            date: moment(row.date).format('YYYY-MM-DD HH:mm'),
            content: row.content,
            account: row.account,
            likes: row.likes,
            views: row.views,
            reply: row.reply,
            user_id: row.user_id,
            imgUrl: row.imgUrl
          }));

          resolve(chatsData);
        }
      });
    } catch (error) {
      console.error('获取搜索留言时出现错误:', error);
      reject(error);
    }
  });
};
// 获取当前关键字下的所有文章
const getTotalSearchChats = (keyword) => {
  return new Promise((resolve, reject) => {
    try {
      const query = 'SELECT COUNT(*) AS total FROM chats WHERE content LIKE ? ';
      const queryParams = [`%${keyword}%`];

      db.query(query, queryParams, (error, results) => {
        if (error) {
          console.error('获取搜索留言数量时出现错误:', error);
          reject(error);
        } else {
          const totalChats = results[0].total;
          resolve(totalChats);
        }
      });
    } catch (error) {
      console.error('获取搜索留言数量时出现错误:', error);
      reject(error);
    }
  });
};



// 保存图片的信息至服务端，并且返回一个Http格式的URL给前端，用于显示
const imageUpload = (imageFile)=>{
  return new Promise ((resolve,reject)=>{
    const savePath = path.join(__dirname,'../assets/imageUpload',imageFile.filename)
    const publicUrl = `http://localhost:3000/assets/imageUpload/${imageFile.filename}`
    fs.promises.rename(imageFile.path,savePath)
      .then(()=>{
        resolve(publicUrl)
      })
      .catch((error)=>{
        console.error('!!!');
        reject(error)
      })
  })
}
// 留言表单数据的插入
const FormUpload = (chatFrom)=>{
  return new Promise((resolve,reject)=>{
  
  const query = 'insert into chats (username,date,content,account,views,user_id,imgUrl) values(?,?,?,?,?,?,?)';

    db.query(query,[chatFrom.username,new Date(),chatFrom.content,chatFrom.account,1,chatFrom.uid,chatFrom.image], (err, results) => {
      if (err) {
        console.error('表单提交失败');
        reject(err);
      } else {
        
        resolve({success:true});
      }
    });
  });
}
// 获取指定留言的所有信息
const getChatInfo = (chatId)=>{
  return new Promise((resolve,reject)=>{
    // 同样，联表查询，查询喜欢和评论的总数
    const query = `
    SELECT 
      c.id,
      c.username,
      c.account,
      c.content,
      c.views,
      c.date,
      COUNT(l.id) AS likes,
      COUNT(r.id) AS reply,
      c.user_id AS uid,
      c.imgUrl
    FROM chats AS c
    LEFT JOIN chatslikes AS l ON c.id = l.cid
    LEFT JOIN chatcomments AS r ON c.id = r.cid
    WHERE c.id = ?
    GROUP BY c.id;
  `
      db.query(query, [chatId], (err, results) => {
      if (err) {
        console.error('指定留言查询失败');
        reject(err);
      } else {
        // console.log('指定文章查询成功',results);
        //使用map处理生成数组对象，使用moment生成指定格式
        const ChatInfo = results.map(row => ({
          id: row.id,
          username: row.username,
          account: row.account,
          content:row.content,
          date: moment(row.date).format('YYYY-MM-DD HH:mm'),
          likes: row.likes,
          views: row.views,
          reply:row.reply,
          uid:row.uid,
          imgUrl:row.imgUrl
        }));
        // resolve(ChatInfo);
        const updateViewsQuery = 'update chats set views = ? where id = ? '
        // 更新留言的浏览量
        db.query(updateViewsQuery,[ChatInfo[0].views+1,chatId],(err,results)=>{
          if(err){
            console.error('更新浏览量失败',err);
            reject(err)
          }else{
            resolve(ChatInfo)
          }
        })
      }
    });
  })
}
// 获取指定留言下的评论信息
const getChatCommentInfo = (chatId)=>{
  // 联表查询
  return new Promise((resolve,reject)=>{
    const query = `
    SELECT 
      cc.id,
      cc.uid,
      cc.cid,
      cc.content,
      cc.created_at,
      COUNT(l.id) AS likes,
      u.username
    FROM chatComments AS cc
    LEFT JOIN chatscommentslikes AS l ON cc.id = l.cid
    LEFT JOIN users AS u ON cc.uid = u.id
    WHERE cc.cid = ?
    GROUP BY cc.id;
  `
      db.query(query, [chatId], (err, results) => {
      if (err) {
        console.error('指定文章查询失败');
        reject(err);
      } else {
        // console.log('指定文章查询成功');
        //使用map处理生成数组对象，使用moment生成指定格式
        const ChatCommentInfo = results.map(row => ({
          username:row.username,
          id: row.id,
          uid: row.uid,
          date: moment(row.created_at).format('YYYY-MM-DD HH:mm'),
          likes: row.likes,
          content: row.content,
          cid:row.cid
        }));
        resolve(ChatCommentInfo);
      }
    });
  })
}
// 指定留言下的评论的表单的插入
const postChatComment = (commentForm)=>{
  return new Promise((resolve,reject)=>{
    // console.log(commentForm)
    const uidQuery = 'select id from users where username = ?'
    const uidParams = [commentForm.username]
    db.promise().query(uidQuery,uidParams)
      .then(([uidRows])=>{
        const ChatCommentQuery = 'insert into chatcomments (uid,cid,content,created_at) values(?,?,?,?)'
        const ChatCommentParams = [uidRows[0].id,commentForm.chatId,commentForm.content,new Date()]
        db.promise().query(ChatCommentQuery,ChatCommentParams)
          .then(()=>{
            resolve('评论插入成功')
          })
          .catch((error)=>{
            console.error(error)
            reject('插入评论的时候发生了错误',error)
          })
      })
      .catch((error)=>{
        console.error(error)
        reject('用户查询失败',error)
      })

    })
}

module.exports = {
  getAllChats,
  getTotalChats,
  FormUpload,
  imageUpload,
  getChatInfo,
  getChatCommentInfo,
  postChatComment,
  getSearchChats,
  getTotalSearchChats
};
