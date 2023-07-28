const db = require('../config/dbConfig');
const moment = require('moment');

//获取所有文章的数据库操作
const getAllArticles = () => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT id, title, date, tags FROM articles';
    db.query(query, (err, results) => {
      if (err) {
        console.error('文章全部检索查询失败');
        reject(err);
      } else {
        console.log('文章全部检索查询成功');
        //使用map遍历生成数组对象， 使用moment用于解析日期格式
        const articlesData = results.map(row => ({
          id: row.id,
          title: row.title,
          date: moment(row.date).format('YYYY-MM-DD HH:mm'),
          tags: row.tags,
        }));
        console.log(articlesData)
        resolve(articlesData);
      }
    });
  });
};
//获取指定文章信息的操作
const getArticleById = (articleId) => {
  return new Promise((resolve, reject) => {
    // //获取指定文章的信息
    // const query = 'SELECT title, date, tags, views, `like`, commentsNum FROM articles WHERE id = ?';
    // db.query(query, [articleId], (err, results) => {
    //   if (err) {
    //     console.error('指定文章查询失败');
    //     reject(err);
    //   } else {
    //     console.log('指定文章查询成功');
    //     //使用map处理生成数组对象，使用moment生成指定格式
    //     const article = results.map(row => ({
    //       tags: row.tags,
    //       commentsNum: row.commentsNum,
    //       title: row.title,
    //       date: moment(row.date).format('YYYY-MM-DD HH:mm'),
    //       like: row.like,
    //       views: row.views,
    //     }));
    //     resolve(article);
    //   }
    // });

    // 由于更改了数据库表之间的关系，所以此次查询需要调三个表
    const articleQuery = 'SELECT title, date, tags, views FROM articles WHERE id = ?'
    const likesQuery = 'SELECT COUNT(*) as likes FROM articleslikes WHERE aid = ?'
    const commentsQuery = 'SELECT COUNT(*) as commentsNum FROM commenttotal WHERE article_id = ?'
// 使用PromiseAll方法来实现对三个表的查询的依次完成
    Promise.all([
      new Promise((resolve,reject)=>{
        db.query(articleQuery,[articleId],(err,results)=>{
          if(err){
            console.error(err);   
            reject(err)
          }else{
            const articleInfo = results[0]
            resolve(articleInfo)
          }
       })
      }),
      new Promise((resolve, reject) => {
        db.query(likesQuery, [articleId], (err, results) => {
          if (err) {
            console.error('点赞数查询失败');
            reject(err);
          } else {
            console.log('点赞数查询成功');
          // 提取查询结果中的点赞数
            const likes = results[0].likes;
            resolve(likes);
          }
        });
      }),

    // 查询评论数
      new Promise((resolve, reject) => {
        db.query(commentsQuery, [articleId], (err, results) => {
          if (err) {
            console.error('评论数查询失败');
            reject(err);
          } else {
            console.log('评论数查询成功');
          // 提取查询结果中的评论数
            const commentsNum = results[0].commentsNum;
            resolve(commentsNum);
          }
        });
      })
    ]).then(([articleInfo,likes,commentsNum])=>{
      const article = {
        tags:articleInfo.tags,
        commentsNum:commentsNum,
        likes:likes,
        title:articleInfo.title,
        date:moment(articleInfo.date).format('YYYY-MM-DD HH:mm'),
        views:articleInfo.views

      }
      // console.log(article)
      // 更新文章浏览数据
      const updateViewsQuery = 'UPDATE articles SET views = ? WHERE id = ?'
      db.query(updateViewsQuery,[article.views+1,articleId],(err,results)=>{
        if(err){
          console.error('更新文章浏览量失败');
          reject(err)
        }else{
          resolve(article)
        }
      })
    }).catch((err)=>{
      console.error('文章信息获取失败',err);
      reject(err)
    })
  });
};
//获取指定文章前后标题信息
const getArticleCtlTitles=(articleId)=>{
  return new Promise((resolve, reject) => {
    //使用参数化查询，不过需要先用parseInt转化一下数据类型进行计算
    const query = 'SELECT title FROM articles WHERE id in(?,?)';
    db.query(query, [parseInt(articleId)-1,parseInt(articleId)+1 ], (err, results) => {
      if (err) {
        console.error('文章前后标题查询失败');
        reject(err);
      } else {
        console.log('文章前后标题查询成功');
        //使用map遍历，其中第一个数据是前一个标题，第二个数据是后一个标题，当只收到一个标题的时候（当前为第一个文章），前端自行特殊处理
        const ctlTitles = results.map(row => ({
          title:row.title,

        }));
        // console.log(ctlTitles)
        resolve(ctlTitles);
      }
    });
  });
}
//获取文章最后一个id的操作
const getLastId = () => {
  return new Promise((resolve, reject) => {
    //通过倒数获取第一个数据
    const query = 'SELECT id FROM articles ORDER BY id DESC LIMIT 1';
    db.query(query, (err, results) => {
      if (err) {
        console.error('最后一个文章号检索查询失败');
        reject(err);
      } else {
        //只有一个数据，无须使用map
          const lastId = results[0].id
          console.log('最后一个文章号检索查询成功',lastId);
          resolve(lastId);
      }
    });
  });
};

module.exports = {
  getAllArticles,
  getArticleById,
  getArticleCtlTitles,
  getLastId
};
