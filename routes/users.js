const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

router.get('/FromComments/:formInlineName', usersController.getusersByName);//获取跳转指定文章Id
router.post('/FromChatLogin',usersController.makeUserLogin)

module.exports = router;
