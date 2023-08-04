const db = require('../config/dbConfig');
const moment = require('moment');

// const ITEMS_PER_PAGE = 3; // 每页显示的文章数目
// const ITEMS_PER_PAGE_BY_TAG = 4

// 获取分页文章
const getAllArticles = (page, size) => {
  return new Promise((resolve, reject) => {
    try {
      const offset = (page - 1) * size; // 计算分页偏移量
      const query = 'SELECT id, title, date, tags FROM articles ORDER BY date DESC LIMIT ?, ?'; // 查询分页文章的SQL语句
      const queryParams = [offset, Number(size)]; // 查询参数

      db.query(query, queryParams, (error, results) => {
        if (error) {
          console.error('获取分页文章时出现错误:', error);
          reject(error);
        } else {
          // 处理查询结果并返回数据
          const articlesData = results.map(row => ({
            id: row.id,
            title: row.title,
            date: moment(row.date).format('YYYY-MM-DD HH:mm'),
            tags: row.tags,
          }));
          resolve(articlesData);
        }
      });
    } catch (error) {
      console.error('获取分页文章时出现错误:', error);
      reject(error);
    }
  });
};

// 获取文章总数
const getTotalArticles = () => {
  return new Promise((resolve, reject) => {
    try {
      const query = 'SELECT COUNT(*) AS total FROM articles';
      db.query(query, (error, results) => {
        if (error) {
          console.error('获取文章总数时出现错误:', error);
          reject(error);
        } else {
          const totalArticles = results[0].total;
          resolve(totalArticles);
        }
      });
    } catch (error) {
      console.error('获取文章总数时出现错误:', error);
      reject(error);
    }
  });
};

const getArticlesByTag = (page,tag,size)=>{
  return new Promise((resolve, reject) => {
    try {
      const offset = (page - 1) * size; // 计算分页偏移量
      const query = 'SELECT id, title, date, tags FROM articles  WHERE tags LIKE ? ORDER BY date DESC LIMIT ?, ? '; // 查询分页文章的SQL语句
      const queryParams = [`%${tag}%`, offset, Number(size)]; // 查询参数

      db.promise()
        .query(query, queryParams)
        .then(([results]) => {
          // 处理查询结果并返回数据
          const articlesData = results.map(row => ({
            id: row.id,
            title: row.title,
            date: moment(row.date).format('YYYY-MM-DD HH:mm'),
            tags: row.tags,
          }));
          resolve(articlesData);
        })
        .catch((error) => {
          console.error('获取某一种类的分页文章时出现错误:', error);
          reject(error);
        });
    } catch (error) {
      console.error('获取某一种类的分页文章时出现错误:', error);
      reject(error);
    }
  })

}
const getTotalArticlesByTag = (tag) =>{
  return new Promise((resolve, reject) => {
    try {
      const query = 'SELECT COUNT(*) AS total FROM articles WHERE tags LIKE ?';
      const queryParams = [`%${tag}%`];

      db.promise()
        .query(query, queryParams)
        .then(([results]) => {
          const totalArticles = results[0].total;
          resolve(totalArticles);
        })
        .catch((error) => {
          console.error('获取某一种类的文章数量汇总时出现错误:', error);
          reject(error);
        });
    } catch (error) {
      console.error('获取某一种类的文章数量汇总时出现错误:', error);
      reject(error);
    }
  });
}

const getSearchedArticles = (keyword, page, size)=>{
  return new Promise((resolve,reject)=>{
    try{
      const offset = (page - 1) * size 
      const query = `
      select id, title, date, tags From articles 
      where title Like ? or tags like ?
      ORDER BY date DESC
      limit ? ,?
      `
      const queryParams = [`%${keyword}%`,`%${keyword}%`,offset,Number(size)]
      db.promise()
        .query(query,queryParams)
        .then(([results])=>{
          const articles = results.map((row)=>({
            id:row.id,
            title:row.title,
            date: moment(row.date).format('YYYY-MM-DD HH:mm'),
            tags:row.tags
          }))
          resolve(articles)
        })
        .catch((error)=>{
          console.error('搜索文章时出现错误',error);
          reject(error)
        })
    }catch(error){
      reject(error)
    }
  })
}
const getTotalSearchedArticles = ( keyword ) =>{
  return new Promise((resolve,reject)=>{
    try{
      const totalQuery = `
        select count(*) as total From articles
        where title like ? or tags like ?
      `
      const totalParams = [`%${keyword}%`,`%${keyword}%`]
      db.promise()
        .query(totalQuery,totalParams)
        .then(([totalResults])=>{
          const totalArticles = totalResults[0].total
          resolve(totalArticles)
        })
        .catch((error)=>{
          console.log(error);
          reject(error)
        })
    }catch(error){
      console.error(error);
      reject(error)
    }
  })
}


//获取指定文章信息的操作
const getArticleById = (articleId) => {
  return new Promise((resolve, reject) => {

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
  getTotalArticles,
  getArticleById,
  getArticleCtlTitles,
  getLastId,
  getArticlesByTag,
  getTotalArticlesByTag,
  getSearchedArticles,
  getTotalSearchedArticles
};


