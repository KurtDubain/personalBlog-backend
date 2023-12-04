// routes/subscription.js
const express = require('express');
const router = express.Router();
const systemController = require('../controllers/systemController');

router.post('/visited', systemController.visitThat);
router.get('/getInfor',systemController.getInfor)

module.exports = router;
