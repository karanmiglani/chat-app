const express = require('express');
const{ protect} = require('../middleware/AuthMiddleware');
const {sendMessgae , getAllMessages} = require('../Controllers/MessageController');
const router = express.Router();

router.route('/new-message').post(protect , sendMessgae);
router.route('/get-all-messages/:chatId').get(protect,getAllMessages);
module.exports = router;