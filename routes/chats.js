const express = require('express');
const router = express.Router();
const chatsController = require('../controllers/chatsController');

router.get('/', chatsController.getAllChats);


module.exports = router;
