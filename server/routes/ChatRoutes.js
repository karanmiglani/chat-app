const express = require('express');
const { protect } = require('../middleware/AuthMiddleware');
const { accessChat , fetchChats , createGroupChat , renameGroup , addToGroup , removeFromGroup} 
= 
require('../Controllers/ChatController');
const router = express.Router();

router.route('/').post(protect,accessChat);
router.get('/all-chats',protect,fetchChats);
router.post('/create-group',protect,createGroupChat);
router.put('/rename-group',protect,renameGroup);
router.post('/add-to-group',protect,addToGroup);
router.put('/remove-from-group',protect,removeFromGroup);


module.exports = router;