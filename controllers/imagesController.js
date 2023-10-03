const path = require('path');

const getUploadimg = (req,res) =>{
    const url = req.params.imgUrl
    const imgPath = path.join(__dirname,'../assets/imageUpload',url)
    res.sendFile(imgPath)
}

const getOwners = (req,res) =>{
    const url = req.params.imgUrl
    const imgPath = path.join(__dirname,'../assets/imageForOwners',url)
    res.sendFile(imgPath)
}


module.exports = {
    getUploadimg,
    getOwners
};
