const db = require('../config/dbConfig');
const moment = require('moment');
//根据用户姓名获取用户信息
const getusersByName = (username) => {
  return new Promise((resolve, reject) => {
    //SQL语句查询全部留言
    const query = 'SELECT id, username, account, comment_count, like_count,level,created_at FROM users where username = ?';
    db.query(query, [username], (err, results) => {
        if (err) {
          console.error('对应用户登陆信息获取失败');
          reject(err);
        } else {
          console.log('对应用户登陆信息获取成功');
          //使用map遍历获取数据，生成一个数组对象，便于前端获取
          const userData = results.map(row => ({
            id: row.id,
            username: row.username,
            account: row.account,
            comment_count: row.comment_count,
            like_count: row.like_count,
            level:row.level,
            //使用moment修改日期格式
            created_at: moment(row.created_at).format('YYYY-MM-DD HH:mm'),
          }));
          console.log(userData)
          resolve(userData);
        }
      });
  });
};
// 确认用户是否存在，实现用户的登录或者注册
const makeUserLogin = (FormData)=>{
  return new Promise((resolve, reject) => {
    try {
      // 首先进行查找，根据是否存在结果，来判断用户是否存在
      const userQuery = 'SELECT id, level, comment_count, like_count, created_at FROM users WHERE username=? AND account = ?';
      const userParams = [FormData.username, FormData.account];
      db.promise().query(userQuery, userParams)
        .then(([userRows]) => {
          if (userRows.length > 0) {
            resolve(true)
          } else {
            // 若用户名或账户存在其一且不对应，则失败；否则注册新账号
            const usernameQuery = 'SELECT EXISTS(SELECT 1 FROM users WHERE username = ?) AS UsernameExistValue'
            const accountQuery ='SELECT EXISTS(SELECT 1 FROM users WHERE account = ?) AS AccountExistValue'
            const accountPromise = db.promise().query(accountQuery, [FormData.account]);
            const usernamePromise = db.promise().query(usernameQuery, [FormData.username]);
            return Promise.all([accountPromise,usernamePromise])
              .then(([accountResult,usernameResult])=>{
                const accountExist = accountResult[0][0].AccountExistValue === 1;
                const usernameExist = usernameResult[0][0].UsernameExistValue === 1;

                if(usernameExist||accountExist){
                  throw new Error('用户名与账户不匹配')
                }else{
                  // 创建新用户
                  const createUserQuery = 'INSERT INTO users (username, account, like_count, comment_count, level, created_at) VALUES (?, ?, ?, ?, ?, ?)';
                  const createUserParams = [FormData.username, FormData.account, 1, 1, 1, new Date()];
      
                  return db.promise().query(createUserQuery, createUserParams)
                }
              })
          }
        })
        .then(() => {
          console.log('新用户创建成功')
          resolve(true)
        })
        .catch(error => {
          console.error('用户验证失败', error);
          reject(error);
        });
    } catch (error) {
      console.error('用户验证出现问题', error);
      reject(error);
    }
  });
}


module.exports = {
  getusersByName,
  makeUserLogin
};
