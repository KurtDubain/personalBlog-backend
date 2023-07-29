# 个人博客（服务端）

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## 简介



## 技术栈

使用Nodejs技术，结合使用Express框架，更快捷地开发服务端代码；
使用MySQL技术用来开发

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
### 用户表（users）

| 字段          | 类型      | 描述               |
| ------------- | --------- | ------------------ |
| id            | Integer   | 用户ID，用作主键             |
| username      | VarChar(255)    | 用户名             |
| account         | VarChar(255)    | 邮箱               |
| comment_count   | Integer    | 用户评论回复总数  |
| created_at    | Timestamp | 用户创建时间           |
| like_count    | Integer | 用户被点赞总数           |
| level         | Integer | 用户等级           |




## 联系方式

邮箱：kurt.du.cobain@gmail.com

## 常见问题

如果有读者经常问到一些问题，我会在这里列出常见问题和解答。

## 更新日志

目前已经实现了基本功能，但尚未完成最终部署
