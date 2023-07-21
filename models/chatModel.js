const db = require('../config/dbConfig');
const moment = require('moment');
const fs = require('fs')
const path = require('path');

//获取全部留言的操作
const getAllChats = () => {
  return new Promise((resolve, reject) => {
    //SQL语句查询全部留言
    const query = 'SELECT id, username, date, content, account,likes,views,reply,user_id,imgUrl FROM chats';
    db.query(query,(err, results) => {
      if (err) {
        console.error('所有留言查询失败');
        reject(err)  
      } else {
        console.log('所有留言查询成功');
        //使用map生成数组对象，并使用moment来修改日期格式
        const chatsData = results.map(row => ({
          id: row.id,
          username: row.username,
          date: moment(row.date).format('YYYY-MM-DD HH:mm'),
          content: row.content,
          account: row.account,
          likes:row.likes,
          views:row.views,
          reply:row.reply,
          user_id:row.user_id,
          imgUrl:row.imgUrl
        }));
        resolve(chatsData);
      }
    });
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
  
  const query = 'insert into chats (username,date,content,account,likes,views,reply,user_id,imgUrl) values(?,?,?,?,?,?,?,?,?)';

    db.query(query,[chatFrom.username,new Date(),chatFrom.content,chatFrom.account,1,1,0,chatFrom.uid,chatFrom.image], (err, results) => {
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
    const query = 'SELECT username, id, account,content, user_id, likes,views,reply,imgUrl, date FROM chats WHERE id = ?';
    db.query(query, [chatId], (err, results) => {
      if (err) {
        console.error('指定留言查询失败');
        reject(err);
      } else {
        console.log('指定文章查询成功',results);
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
          uid:row.user_id,
          imgUrl:row.imgUrl
        }));
        resolve(ChatInfo);
      }
    });
  })
}
// 获取指定留言下的评论信息
const getChatCommentInfo = (chatId)=>{
  return new Promise((resolve,reject)=>{
    const query = 'SELECT chatComments.id, chatComments.uid, chatComments.cid, chatComments.likes, chatComments.created_at, chatComments.content, users.username FROM chatComments LEFT JOIN users ON chatComments.uid = users.id WHERE chatComments.cid = ?';
    db.query(query, [chatId], (err, results) => {
      if (err) {
        console.error('指定文章查询失败');
        reject(err);
      } else {
        console.log('指定文章查询成功',results);
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
    console.log(commentForm)
    const uidQuery = 'select id from users where username = ?'
    const uidParams = [commentForm.username]
    db.promise().query(uidQuery,uidParams)
      .then(([uidRows])=>{
        const ChatCommentQuery = 'insert into chatcomments (uid,cid,content,likes,created_at) values(?,?,?,?,?)'
        const ChatCommentParams = [uidRows[0].id,commentForm.chatId,commentForm.content,1,new Date()]
        db.promise().query(ChatCommentQuery,ChatCommentParams)
          .then(()=>{
            resolve('评论插入成功')
          })
          .catch((error)=>{
            reject('插入评论的时候发生了错误',error)
          })
      })
      .catch((error)=>{
        reject('用户查询失败',error)
      })

    })
}

module.exports = {
  getAllChats,
  FormUpload,
  imageUpload,
  getChatInfo,
  getChatCommentInfo,
  postChatComment
};
