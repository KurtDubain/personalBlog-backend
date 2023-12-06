// 系统数据处理控制器
const systemModel = require('../models/systemModel');

// 处理访问方法
const visitThat = async (req, res) => {
  try{
    const { currentDate,ip,userAgent } = req.body
    await systemModel.visitThat({ currentDate,ip,userAgent })
    res.status(200).json({success:true})
  }catch(error){
      // 其他异常，返回通用错误信息
      res.status(500).json({ success: false, message: '发生了服务器错误' });
      console.error('访客记录记录失败',error);
  }
};

// 处理获取访问数据的方法
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