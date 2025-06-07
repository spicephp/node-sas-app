const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const usersController = require('../controllers/usersController');



// Configure multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads');
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});
const upload = multer({ storage });

// Auth routes
router.get('/', usersController.login);
router.get('/signup', usersController.signup);
router.post('/auth', usersController.authenticate);

// Example: Add dashboard, profile, logout, registration, and upload routes
router.get('/dashboard', usersController.dashboard);
router.get('/profile', usersController.profile);
router.post('/updateprofile',usersController.updateProfile);
router.post('/updateprofilepicture', upload.single('profile_picture'), usersController.updateProfilePicture);
router.get('/users',usersController.users);
router.get('/users/add',usersController.addUser); 
router.post('/users/create', usersController.createUser);
router.get('/users/edit/:id', usersController.editUser);
router.post('/users/update/:id',usersController.updateUser);
router.get('/users/view/:id',usersController.viewUser);
router.delete('/users/delete/:id', usersController.deleteUser);
router.get('/logout', usersController.logout);
router.post('/register', usersController.register);
module.exports = router;