const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken')
// const { use } = require('../routes/users');

// 根据用户名获取指定用户
const getusersByName = async (req, res) => {
  // console.log(req.params)
    const username = req.params.formInlineName
  try {
    const users = await userModel.getusersByName(username);
    res.json(users);
  } catch (error) {
    console.error('获取用户信息失败', error);
    res.status(500).json({ error: '未能成功获取用户信息' });
  }
};
// 通过ID获取用户信息
const getusersByID = async(req,res)=>{
  // console.log(req.userData)
  // 先判断是否携带token信息
  if(req.userData){
    const userData = {
      id: req.userData.userID,
      username: req.userData.username,
      account: req.userData.account,
      comment_count: req.userData.comment_count,
      like_count: req.userData.like_count,
      level: req.userData.level,
      created_at: req.userData.created_at
    }
    // console.log('jixie')
    res.json({
      userData,
      message:'通过解析token获得'
    })
  }else{
    const userID = req.params.formInlineID
  try{
    const userData = await userModel.getusersByID(userID)
    res.json({
      userData:userData[0],
      message:'通过直接查找数据库获得'     
    })
  }catch(error){
    console.error('用户信息获取失败',error);
    res.status(500).json({error:'用户信息获取失败'})
  }}
}
// 通过用户行为获取token
const getTokenByFormName = async (req,res)=>{
  const username = req.params.formInlineName
  try{
    const userData = await userModel.getusersByName(username)
    // console.log(userData)
    // if(!userData.id){
    //   return res.status(404).json({message:'用户未找到'})
    // }
    // 颁发token，有效期两天
    const token = jwt.sign(userData[0],'dypdypdypdypdypdypdypdypdypdypdypdypdypdypdyp',{expiresIn:'2d'})
    res.json({userID:userData[0].id,token})
  }catch(error){
    console.error('token获取出现了问题',error);
    res.status(500).send('服务器内部错误，token获取处理出现了问题')
  }
}
// 确认用户是否成功登录
const makeUserLogin = async(req,res)=>{
  try {
    const formData = req.body; // 获取表单数据
      //异步等待文章信息处理
    const dealData = await userModel.makeUserLogin(formData);
    res.json({ data:dealData });
  } 
  catch (error) {
    console.error('用户名或账号错误', error);
    res.status(500).json({ error: '用户名或账号错误' });
  }
  
}
// 验证token有效性，是否允许放行
const verifyToken = async(req,res)=>{
  try{
    if(req.userData.username==='哈哈'){
      res.status(200).json({
        message:true
      })
    }else{
      res.status(200).json({
        message:false
      })
    }
  }catch(error){
    console.error('路由返回数据处理异常',error);
    res.status(500).json({
      message:false
    })
  }
}

module.exports = {
    getusersByName,
    makeUserLogin,
    getusersByID,
    getTokenByFormName,
    verifyToken
};
