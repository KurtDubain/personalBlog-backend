# 个人博客（服务端）

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## 简介

个人独立博客的后端代码，基于Nodejs开发，主要配置了跨域等响应头、配置了多个中间件来处理请求、配置了不同模块的接口。


## 技术栈

使用Nodejs技术，结合使用Express框架，更快捷地开发服务端代码；
使用MySQL技术用来开发数据库

## 部署方式

### 1.安装和运行
~~~
//安装依赖
npm install

//运行服务
node xx.js
~~~
### 2.接口文档

1.获取全部文章数据
~~~
//请求方式:GET
//路径:/articles
//请求参数：
    参数1：无
//返回结果：
    {
        "code":200,
        "data":''
    }
~~~

### 3.数据库
接下来我将一一展示表结构
#### 用户表（users）

| 字段          | 类型      | 描述               |
| ------------- | --------- | ------------------ |
| id            | Integer   | 用户ID，用作主键             |
| username      | VarChar(255)    | 用户名             |
| account         | VarChar(255)    | 邮箱               |
| comment_count   | Integer    | 用户评论回复总数  |
| created_at    | Timestamp | 用户创建时间           |
| like_count    | Integer | 用户被点赞总数           |
| level         | Integer | 用户等级           |

#### 公告表（announce）

| 字段         | 类型         | 描述                 |
| ------------ | ------------ | -------------------- |
| id           | int(11)      | 公告ID               |
| created_at   | datetime     | 创建时间             |
| content      | text         | 内容                 |
| author       | varchar(255) | 作者                 |
| is_top       | tinyint(1)   | 是否置顶，默认为0    |


#### 文章表（articles）

| 字段         | 类型         | 描述                 |
| ------------ | ------------ | -------------------- |
| id           | int(11)      | 文章ID               |
| title        | varchar(255) | 标题                 |
| date         | datetime     | 日期                 |
| tags         | json         | 标签                 |
| views        | int(11)      | 浏览量               |


#### 文章点赞表（articleslikes）

| 字段         | 类型         | 描述                 |
| ------------ | ------------ | -------------------- |
| id           | int(11)      | 点赞ID               |
| uid          | int(11)      | 用户ID               |
| aid          | int(11)      | 文章ID               |
| created_at   | datetime     | 创建时间             |


#### 留言评论表（chatcomments）

| 字段         | 类型         | 描述                 |
| ------------ | ------------ | -------------------- |
| id           | int(11)      | 评论ID               |
| uid          | int(11)      | 用户ID               |
| cid          | int(11)      | 聊天ID               |
| content      | varchar(255) | 内容                 |
| created_at   | datetime     | 创建时间             |


#### 留言表（chats）

| 字段         | 类型         | 描述                 |
| ------------ | ------------ | -------------------- |
| id           | int(11)      | 聊天ID               |
| username     | varchar(255) | 用户名               |
| date         | datetime     | 日期                 |
| content      | text         | 内容                 |
| account      | varchar(255) | 账号                 |
| views        | int(11)      | 浏览量               |
| user_id      | int(11)      | 用户ID               |
| imgUrl       | varchar(255) | 图片URL              |


#### 留言评论点赞表（chatscommentslikes）

| 字段         | 类型         | 描述                 |
| ------------ | ------------ | -------------------- |
| id           | int(11)      | 点赞ID               |
| uid          | int(11)      | 用户ID               |
| cid          | int(11)      | 评论ID               |
| created_at   | datetime     | 创建时间             |


#### 留言点赞表（chatslikes）

| 字段         | 类型         | 描述                 |
| ------------ | ------------ | -------------------- |
| id           | int(11)      | 点赞ID               |
| uid          | int(11)      | 用户ID               |
| cid          | int(11)      | 聊天ID               |
| created_at   | datetime     | 创建时间             |


#### 文章评论点赞表（commentslikes）

| 字段         | 类型         | 描述                 |
| ------------ | ------------ | -------------------- |
| id           | int(11)      | 点赞ID               |
| uid          | int(11)      | 用户ID               |
| coid         | int(11)      | 评论ID               |
| created_at   | datetime     | 创建时间             |


#### 文章评论表（commenttotal）

| 字段         | 类型         | 描述                 |
| ------------ | ------------ | -------------------- |
| id           | int(11)      | 评论ID               |
| article_id   | int(11)      | 文章ID               |
| content      | text         | 内容                 |
| name         | varchar(255) | 名称                 |
| created_Date | datetime     | 创建日期             |
| account      | varchar(255) | 账号                 |
| user_id      | int(11)      | 用户ID               |


#### 订阅表（subscriptions）

| 字段         | 类型         | 描述                 |
| ------------ | ------------ | -------------------- |
| id           | int(11)      | 订阅ID               |
| account      | varchar(255) | 账号                 |
| name         | varchar(100) | 名称                 |
| subscribed_at| datetime     |                      |




## 联系方式

邮箱：kurt.du.cobain@gmail.com

## 常见问题

如果有读者经常问到一些问题，我会在这里列出常见问题和解答。

## 更新日志

### [1.0.0] - 2023-8-10

- 项目初始化，重构了整体代码，将routes、models、controllers分开处理；
- 完善了基本功能和接口，能够进行部署

### [1.0.4] - 2023-8-15

- 完成了前端分页加载的处理；
- 优化了搜索功能（多个页面下）

### [1.1.2] - 2023-9-10

- 新增了Announce模块，管理公告
- 服务端由CORS解决跨域改为了NGINX代理解决，并修改了部分接口路由
- 配置了https
### [1.2.1] - 2023-8-15

- 新增了jwt的处理，对于用户部分做了一些优化
- 配置了tokenDeal中间件，处理获取的token数据
- 优化了整体逻辑
### [1.2.7] - 2023-8-15

- 修改了数据库连接脚本，解决了自动断开无法重连的问题；
- 实现了文件分片上传，配置了chatMakeUpload中间件，处理上传数据；
- 配置了对应接口，分别用于处理分片的接收、验证、合并等操作；
- 在分片上传的基础上，对应实现了断点续传和秒传的功能；

