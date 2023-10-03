// middleware/authenticate.js

const jwt = require('jsonwebtoken');

const tokenDeal = (req, res, next) => {
  const token = req.header('Authorization'); // 从请求头中获取 token
    // console.log(token)
  if (!token) {
    // 如果没有 token，直接放行请求
    return next();
  }

  try {
    // 验证 token
    const decoded = jwt.verify(token, 'dypdypdypdypdypdypdypdypdypdypdypdypdypdypdyp'); // 替换成你的密钥

    // 将解析后的用户信息存储在 req.user 中

    req.userData = decoded;

    // 继续处理请求
    next();
  } catch (error) {
    console.error('Token 解析失败', error);
    // 如果 token 不合法，也放行请求
    next();
  }
};

module.exports = tokenDeal;
