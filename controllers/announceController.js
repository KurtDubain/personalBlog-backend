const announceModel = require('../models/announceModel')


const GetItemByNum = async (req,res) =>{
    try{
        const announceData = await announceModel.GetItemByNum()
        res.json({
            success:true,
            announceData
        })
    }catch(error){
        console.error(error);
        res.status(500).json({error:'未能获取公告'})
    }
}

const PostItem = async (req,res)=>{
    try{
        
        const { author,content} = req.body
        await announceModel.PostItem(author,content)
        res.status(200).json({
            success:true
        })
    }catch(error){
        console.error(error);
        res.status(500).json({error:'更新公告失败'})
    }

}

module.exports = {
    GetItemByNum,
    PostItem
}