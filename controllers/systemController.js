// controllers/subscriptionController.js
const systemModel = require('../models/systemModel');

// 订阅信息的处理
const visitThat = async (req, res) => {
  try{
    const { currentDate,ip,userAgent } = req.body
    // const userIP = req.ip
    // const userAgent = req.header['user-agent']
    await systemModel.visitThat({ currentDate,ip,userAgent })
    res.status(200).json({success:true})
  }catch(error){
      // 其他异常，返回通用错误信息
      res.status(500).json({ success: false, message: '发生了服务器错误' });
      console.error('访客记录记录失败',error);
  }
};

// 取消订阅的操作
const getInfor = async (req, res) => {
  try{
      const date = req.query.date
      const todayNum = await systemModel.getTodayVisitCount(date)
      const totalNum = await systemModel.getTotalVisitCount()
      const weekData = await systemModel.getWeekData()

      res.status(200).json({
        todayNum,
        totalNum,
        weekData
      })
  }catch(error){
    res.status(500).json({success:false,message:'服务器错误'})
    console.error('获取访客信息的时候失败',error)
  }
};

module.exports = {
  visitThat,
  getInfor

}