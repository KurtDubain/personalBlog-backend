const db = require('../config/dbConfig');
const moment = require('moment');
const fs = require('fs')
const path = require('path');
const { resolve } = require('path');
const { resolveObjectURL } = require('buffer');
//获取全部留言的操作
const getAllChats = () => {
  return new Promise((resolve, reject) => {
    //SQL语句查询全部留言
    const query = 'SELECT id, name, date, content, contact FROM chats';
    db.query(query, (err, results) => {
      if (err) {
        console.error('所有留言查询失败');
        reject(err);
      } else {
        console.log('所有留言查询成功');
        //使用map生成数组对象，并使用moment来修改日期格式
        const chatsData = results.map(row => ({
          id: row.id,
          name: row.name,
          date: moment(row.date).format('YYYY-MM-DD HH:mm'),
          content: row.content,
          contact: row.contact,
        }));
        resolve(chatsData);
      }
    });
  });
};
const imageUpload = (imageFile)=>{
  return new Promise ((resolve,reject)=>{
    const savePath = path.join(__dirname,'../assets/mdStorage',imageFile.filename)
    fs.promises.rename(imageFile.path,savePath)
      .then(()=>{
        resolve(savePath)
      })
      .catch((error)=>{
        reject(error)
      })
  })
}
const FormUpload = (chatFrom)=>{
  return new Promise((resolve,reject)=>{
    try{
      const Query = 'insert into chats (username,date,content,account,likes,views,reply,user_id,imgUrl) values(?,?,?,?,?,?,?,?,?)'
      const Params = [chatFrom.username,new Date(),chatFrom.content,chatFrom.account,1,1,0,chatFrom.uid,chatFrom.imgUrl]
      db.promise().query(Query,Params)
      resolve({success:true})
    }catch(error){
      console.error('表单提交失败')
      reject(error)
    }

  })
  // const query = 'insert into chats (username,date,content,account,likes,views,reply,user_id,imgUrl) values(?,?,?,?,?,?,?,?,?)';
  //   db.query(query, (err, results) => {
  //     if (err) {
  //       console.error('表单提交失败');
  //       reject(err);
  //     } else {
  //       
  //       resolve({success:true});
  //     }
  //   });
}


module.exports = {
  getAllChats,
  FormUpload,
  imageUpload
};
