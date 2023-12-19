const express = require('express');
const {registerUser,authUser,getAllUsers , updatePic} = require('../Controllers/userController');
const {protect} = require('../middleware/AuthMiddleware');
const router = express.Router();


router.route('/').post(registerUser);
router.post('/login',authUser);
router.get('/all-users',protect,getAllUsers)
router.put('/update-pic',protect,updatePic)

module.exports = router;