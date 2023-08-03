// controllers/subscriptionController.js
const subscriptionModel = require('../models/subscriptionModel');

const SubItem = async (req, res) => {
  
  try{
      const subCondition = await subscriptionModel.SubItem(req.body);
      res.json({ message: '订阅成功',
                subCondition });
  }catch(error){
      console.error('未能正常实现订阅', error);
      res.status(500).json({ error: '未能正常实现订阅' });
  }
};

const UnSubItem = async (req, res) => {

  try{
      const subCondition = await subscriptionModel.UnSubItem(req.body);
      res.json({ message: '取消订阅成功',
                subCondition });
  }catch(error){
      console.error('未能正常取消订阅', error);
      res.status(500).json({ error: '未能正常取消订阅' });
  }
};

module.exports = {
  SubItem,
  UnSubItem

}