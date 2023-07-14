//node服务端根目录
const express = require('express');
const bodyParser = require('body-parser');
//导入解析包和express框架
const app = express();

app.use(bodyParser.json());

//利用cors方式解决跨域问题（本地）
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

//导入路由管理，并进行注册
const articlesRouter = require('./routes/articles');//文章信息
const chatsRouter = require('./routes/chats');//留言信息
const commentsRouter = require('./routes/comments')//评论信息
const usersRouter = require('./routes/users')


app.use('/articles', articlesRouter);
app.use('/chats', chatsRouter);
app.use('/comments', commentsRouter);
app.use('/users',usersRouter)

app.listen(3000, () => {
  console.log('端口3000，启动！');
});


// const express = require('express')
// const mysql = require('mysql2')
// const bodyParser = require('body-parser')
// const moment = require('moment')
// const path = require('path')
// const fs = require('fs')

// const app = express()

// app.use(bodyParser.json())

// app.use((req,res,next)=>{
//     res.setHeader('Access-Control-Allow-Origin','http://localhost:8080')
//     res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,DELETE')
//     res.setHeader('Access-Control-Allow-Headers','Content-Type')
//     next()
// })

// const connection = mysql.createConnection({
//     host:'localhost',
//     user:'root',
//     password:'123456',
//     database:'blog'

// })

// connection.connect((err)=>{
//     if(err){
//         console.error('数据库连接失败');
//     }else{
//         console.error('数据库连接成功');
//     }
// })

// app.get('/articles',(req,res)=>{
//     const query = 'select id,title,date,tags from articles'
//     connection.query(query,(err,results)=>{
//         if(err){
//             console.error('article查询失败')
//             res.status(500).json({error:'无法正常向articles发送数据'})
//         }else{
//             console.log('article查询成功')
//             try{
//                 const articlesData = results.map(row=>{
//                     // console.log(row.tags)
//                     return{
//                         id:row.id,
//                         title:row.title,
//                         date:row.date,
//                         tags:row.tags
//                     }
//                 })
//                 const changeArticles = articlesData.map((article)=>{
//                     const changeDates = moment(article.date).format('YYYY-MM-DD HH:mm')
//                     return{
//                         ...article,
//                         date:changeDates
//                     }
//                 })
//                 // console.log(articlesData)
//                 res.json(changeArticles)
//             }
//             catch(error){
//                 console.log('标签解析失败',error);
//                 res.status(500).json({error:"无法解析文章标签"})
//             }
            
//         }
//     })
// })

// app.get('/chats',(req,res)=>{
//     const query = 'select id,name,date,content,contact from chats'
//     connection.query(query,(err,results)=>{
//         if(err){
//             console.error('chats查询失败')
//             res.status(500).json({error:'无法正常向chats发送数据'})
//         }else{
//             console.log('chats查询成功')
//             try{
//                 const chatsData = results.map(row=>{
//                     // console.log(row.tags)
//                     return{
//                         id:row.id,
//                         name:row.name,
//                         date:row.date,
//                         content:row.content,
//                         contact:row.contact
//                     }
//                 })
//                 const changeChats = chatsData.map((chat)=>{
//                     const changeDate = moment(chat.date).format('YYYY-MM-DD HH:mm')
//                     return{
//                         ...chat,
//                         date:changeDate
//                     }
//                 })
//                 // console.log(articlesData)
//                 res.json(changeChats)
//             }
//             catch(error){
//                 console.log('标签解析失败',error);
//                 res.status(500).json({error:"无法解析文章标签"})
//             }
            
//         }
//     })
// })

// app.get('/articles/:articleId',(req,res)=>{
//     const articleId = req.params.articleId
//     const query = `select title,date,tags,views,\`like\`,commentsNum from articles where id = ?`
//     connection.query(query,[articleId],(err,results)=>{
//         if(err){
//             console.error('articles精准查询失败',err)
//             res.status(500).json({error:'无法正常向articles发送数据'})
//         }else{
//             console.log('articles查询成功')
//             try{
//                 const articlesData = results.map(row=>{
//                     // console.log(row.tags)
//                     return{

//                         tags : row.tags,
//                         commentsNum:row.commentsNum,
//                         title:row.title,
//                         date:row.date,
//                         like:row.like,
//                         views:row.views
//                     }
//                 })
//                 const changeArticles = articlesData.map((article)=>{
//                     const changeDate = moment(article.date).format('YYYY-MM-DD HH:mm')
//                     return{
//                         ...article,
//                         date:changeDate
//                     }
//                 })
//                 // console.log(articlesData)
//                 res.json(changeArticles)
//             }
//             catch(error){
//                 console.log('文章信息解析失败',error);
//                 res.status(500).json({error:"无法解析文章信息"})
//             }
            
//         }
//     })
// })
// app.get('/articles/:articleId/content',(req,res)=>{
//     const articleId = req.params.articleId
//     const filePath = path.join(__dirname,'/assets/mdStorage',`${articleId}.md`)
    
//     fs.readFile(filePath,'utf8',(error,content)=>{
//         if(error){
//             console.error('未能获取文章内容',error)
//             return res.status(500).json({error:'未能读取到文章内容'})
//         }else{
//             console.log('文章内容获取成功')
//             res.send(content)
//         }
       
//     })
// })
// app.get('/chats/:articleId',(req,res)=>{
//     const articleId = req.params.articleId
//     const query = `select id,content,name,contact,likes,created_Date from commenttotal where article_id = ?`
//     connection.query(query,[articleId],(err,results)=>{
//         if(err){
//             console.error('文章评论精准查询失败',err)
//             res.status(500).json({error:'无法正常获取文章评论数据'})
//         }else{
//             console.log('文章评论数据查询成功')
//             try{
//                 const commentsData = results.map(row=>{
//                     // console.log(row.tags)
//                     return{
//                         id:row.id,
//                         content:row.content,
//                         likes:row.likes,
//                         created_Date:row.created_Date,
//                         name:row.name,
//                         contact:row.contact

//                     }
//                 })
//                 // console.log(commentsData)
//                 const changeComments = commentsData.map((comment)=>{
//                     const changeDate = moment(comment.created_Date).format('YYYY-MM-DD HH:mm')
//                     return{
//                         ...comment,
//                         created_Date:changeDate
//                     }
//                 })
//                 // console.log(articlesData)
//                 res.json(changeComments)
//             }
//             catch(error){
//                 console.log('文章评论解析失败',error);
//                 res.status(500).json({error:"无法解析文章评论信息"})
//             }
            
//         }
//     })
// })

// app.listen(3000,()=>{
//     console.log('端口3000，启动！')
// })
