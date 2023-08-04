const db = require('../config/dbConfig')
const moment = require('moment');
// const { query } = require('express');
//插入评论表单操作
const insertCommentForm = (formData) => {
  return new Promise((resolve, reject) => {
    try {
      // console.log(formData);
      // 根据用户结果的检索，来判断用户是否存在
      const userQuery = 'SELECT id, level, comment_count, like_count, created_at FROM users WHERE username=? AND account = ?';
      const userParams = [formData.username, formData.account];
      let userId = 0
      let comments = 0
      db.promise().query(userQuery, userParams)
        .then(([userRows]) => {
          // 若存在，则成功登录，并返回数据
          if (userRows.length > 0) {
            userId = userRows[0].id;
            comments = userRows[0].comment_count + 1;

            const updateUserQuery = 'UPDATE users SET comment_count = ? WHERE id = ?';
            const updateUserParams = [comments, userId];

            return db.promise().query(updateUserQuery, updateUserParams);
          } else {
            // 若不存在，则判断是否是输入错误还是未注册的新账号，来判断是否要抛出错误还是创建新用户
            const usernameQuery = 'SELECT EXISTS(SELECT 1 FROM users WHERE username = ?) AS UsernameExistValue'
            const accountQuery ='SELECT EXISTS(SELECT 1 FROM users WHERE account = ?) AS AccountExistValue'
            const accountPromise = db.promise().query(accountQuery, [formData.account]);
            const usernamePromise = db.promise().query(usernameQuery, [formData.username]);
            return Promise.all([accountPromise,usernamePromise])
              .then(([accountResult,usernameResult])=>{
                const accountExist = accountResult[0][0].AccountExistValue === 1;
                const usernameExist = usernameResult[0][0].UsernameExistValue === 1;
                // 当账户和昵称存在但不对应的情况下，抛出错误
                if(usernameExist||accountExist){
                  throw new Error('用户名与账户不匹配')
                }else{
                  const createUserQuery = 'INSERT INTO users (username, account, like_count, comment_count, level, created_at) VALUES (?, ?, ?, ?, ?, ?)';
                  const createUserParams = [formData.username, formData.account, 1, 1, 1, new Date()];
      
                  return db.promise().query(createUserQuery, createUserParams)
                    .then(([createUserResult]) => {
                      userId = createUserResult.insertId;
                      comments = 1;
                    });
                }
              })
          }
        })
        .then(() => {
          // 在用户逻辑执行成功后，也就是登录成功后，执行评论的插入
          const insertCommentQuery = 'INSERT INTO commenttotal (article_id, content, name, account, created_Date, user_id) VALUES (?, ?, ?, ?, ?, ?)';
          const insertCommentParams = [
            formData.articleId,
            formData.content,
            formData.username,
            formData.account,
            
            new Date(),
            userId
          ];

          return db.promise().query(insertCommentQuery, insertCommentParams);
        })
        .then(([insertCommentResult]) => {
          // console.log('数据插入成功');
          resolve(insertCommentResult);
        })
        .catch(error => {
          console.error('未能插入表单数据', error);
          reject(error);
        });
    } catch (error) {
      console.error('未能插入表单数据', error);
      reject(error);
    }
  });
};

//获取指定文章下的评论信息
const getCommentsByArticleId = (articleId) => {
  //使用Promise处理数据库语句的异步操作
    return new Promise((resolve, reject) => {
      //未使用模板字符串来书写SQL语句，使用参数化形式执行，能够防止SQL注入攻击、提高可读性、方便处理参数类型的转换
      //查询评论表下的各个数据
      const query = `
      SELECT 
        c.id,
        c.content,
        c.name,
        c.account,
        COUNT(l.id) AS likes,
        c.created_Date
      FROM commenttotal AS c
      LEFT JOIN commentslikes AS l ON c.id = l.coid
      WHERE c.article_id = ?
      GROUP BY c.id;
    `
        db.query(query, [articleId], (err, results) => {
        if (err) {
          console.error('指定文章评论获取失败');
          reject(err);
        } else {
          // console.log('指定文章评论获取成功');
          //使用map遍历获取数据，生成一个数组对象，便于前端获取
          const commentsData = results.map(row => ({
            id: row.id,
            content: row.content,
            name: row.name,
            account: row.account,
            likes: row.likes,
            //使用moment修改日期格式
            created_Date: moment(row.created_Date).format('YYYY-MM-DD HH:mm'),
          }));
          resolve(commentsData);
        }
      });
    });
  };

module.exports={
    insertCommentForm,
    getCommentsByArticleId

}