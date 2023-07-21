const userModel = require('../models/userModel');

//获取所有留言的逻辑处理
const getusersByName = async (req, res) => {
  console.log(req.params)
    const username = req.params.formInlineName
  try {
    const users = await userModel.getusersByName(username);
    res.json(users);
  } catch (error) {
    console.error('获取用户信息失败', error);
    res.status(500).json({ error: '未能成功获取用户信息' });
  }
};
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

module.exports = {
    getusersByName,
    makeUserLogin
};
