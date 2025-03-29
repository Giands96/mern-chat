const express = require('express');
const { registerUser, authUser, allUsers, updateUserProfile } = require ('../controllers/userControllers')
const {protect} = require('../middleware/authMiddleware');
const {upload}  = require('../config/cloudinaryConfig');

const router = express.Router();

router.post('/login',authUser);
router.route('/').post(registerUser).get(protect,allUsers);
router.post('/profile',protect, updateUserProfile);


module.exports = router