// controllers/subscriptionController.js
const systemModel = require('../models/systemModel');

// 订阅信息的处理
const SubItem = async (req, res) => {
  
  try{
    // 处理订阅成功的数据，返回成功信息
      const subCondition = await subscriptionModel.SubItem(req.body);
      res.status(200).json({ success: true, message: subCondition });

  }catch(error){
    // 根据不同的错误信息进行返回
    if (error.message === '用户未注册') {
      res.status(400).json({ success: false, message: '用户未注册，请先注册' });
    } else if (error.message === '该用户已经订阅') {
      res.status(400).json({ success: false, message: '该用户已经订阅' });
    } else if (error.message === '用户信息错误') {
      res.status(400).json({ success: false, message: '用户信息错误，请检查姓名和账户' });
    } else {
      // 其他异常，返回通用错误信息
      res.status(500).json({ success: false, message: '发生了服务器错误' });
    }
  }
};

// 取消订阅的操作
const UnSubItem = async (req, res) => {

  try{
      const subCondition = await subscriptionModel.UnSubItem(req.body);
      res.json({ message: '取消订阅成功',
                subCondition });
  }catch(error){
    // 对不同的异常进行处理
    if (error.message === '用户未订阅') {
      res.status(400).json({ success: false, message: '用户未订阅，无法取消订阅' });
    } else {
      // 其他异常，返回通用错误信息
      res.status(500).json({ success: false, message: '发生了服务器错误' });
    }
  }
};

module.exports = {
  SubItem,
  UnSubItem

}