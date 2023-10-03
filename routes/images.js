const express = require('express');
const router = express.Router();
const imagesController = require('../controllers/imagesController');


router.get('/imgUpload/:imgUrl',imagesController.getUploadimg)
router.get('/imgForOwner/:imgUrl',imagesController.getOwners)

module.exports = router;
