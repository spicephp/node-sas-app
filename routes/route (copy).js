const express = require('express');
const router = express.Router();


const usersController = require('../controllers/usersController');



router.get('/', usersController.login);

router.get('/signup', usersController.signup);

router.post('/auth', usersController.authenticate);

// router.post('/registration', usersController.register);

// router.get('/logout', usersController.logout);

// router.get('/profile', usersController.profile);

// router.get('/dashboard', usersController.dashboard);


// const connection = require('../config/database');
// const path = require('path');
// const flash = require('connect-flash');
// const multer = require('multer');
// const { request } = require('http');
// const bcrypt = require('bcrypt');
// // Configure multer for file storage
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         const uploadPath = path.join(__dirname, '../uploads');
//         cb(null, uploadPath);
//     },
//     filename: (req, file, cb) => {
//         const uniqueName = `${Date.now()}-${file.originalname}`;
//         cb(null, uniqueName);
//     }
// });

// const upload = multer({ storage });

// router.get('/', (request, response) => {
//     const message = request.flash('info');
//     response.render('login', { message: message });
// });
// router.get('/signup', (request, response) => {
//     const message = request.flash('info');
//     response.render('signup', { message: message });
// });



// router.post('/auth', async (request, response) => {
//     let username = request.body.username;
//     let password = request.body.password;
//     if (username && password) {

//         connection.query('SELECT * FROM accounts WHERE username = ? ', [username], async (error, results) => {
//             if (error) {
//                 console.error('Database Error:', error);
//                 request.flash('info', 'Internal server error.');
//                 response.redirect('/');
//             }
    
//             // Check if the user exists
//             if (results.length === 0) {
//                 request.flash('info', 'Incorrect Username and/or Password!');
//                 response.redirect('/');
//             }

//             if (results.length > 0) {
//                 const user = results[0];
//                 const hashedPassword = user.password; 
                
//                 // Check if the password matches
//                 const match = await bcrypt.compare(password, hashedPassword);
//                 if (match) {
//                     request.session.loggedin = true;
//                     request.session.username = username;
//                     response.redirect('/profile');
//                 } else {
//                     request.flash('info', 'Incorrect Username and/or Password!');
//                     response.redirect('/');
//                 }
//             } else {
//                 request.flash('info', 'Incorrect Username and/or Password!');
//                 response.redirect('/');
//             }
//         });
//     } else {
//         response.send('Please enter Username and Password!');
//     }
// });
// router.post('/registration', async(request,response)=>{
//     const { username, password, email } = request.body;

//             // Hash the password asynchronously
//             const hashedPassword = await bcrypt.hash(password, 10);

//     const insertQuery = 'INSERT INTO accounts (username, password, email) VALUES (?, ?, ?)';

//     connection.query(insertQuery, [username,hashedPassword,email], (error, results) => {
//         if (error) throw error;
//         if (results.affectedRows > 0) {
//             response.render('signup', { message: 'User registered successfully!'});
//         } else {
//             response.status(404).send('User not found.');
//         }
//     });

// });
// router.get('/logout', (request, response) => {
//     request.session.destroy((err) => {
//         if (err) {
//             return response.status(500).send('Could not log out');
//         }
//         response.redirect('/');
//     });
// });

// router.get('/profile', (request, response) => {
//     if (request.session.loggedin) {
//         const username = request.session.username;
//         const message = request.flash('info');
//         connection.query('SELECT * FROM accounts WHERE username = ?', [username], (error, results) => {
//             if (error) throw error;
//             if (results.length > 0) {
//                 const user = results[0];
//                 response.render('profile', { userinfo: user,message:message });
//             } else {
//                 response.status(404).send('User not found.');
//             }
//         });
//     } else {
//         request.flash('info', 'Please enter Username and Password!');
//         response.redirect('/');
//     }
// });
// router.get('/dashboard',(request,response)=>{
//     if (request.session.loggedin) {
//         const username = request.session.username;
//         const message = request.flash('info');
//         connection.query('SELECT * FROM accounts WHERE username = ?', [username], (error, results) => {
//             if (error) throw error;
//             if (results.length > 0) {
//                 const user = results[0];
//                 response.render('dashboard', { userinfo: user,message:message });
//             } else {
//                 response.status(404).send('User not found.');
//             }
//         });
//     } else {
//         request.flash('info', 'Please enter Username and Password!');
//         response.redirect('/');
//     }
// });
// router.post('/updateprofile', (request, response) => {
//     if (request.session.loggedin) {
//         const username = request.session.username;
//         const { designation,phone,address } = request.body; 
//         // Update query
//         connection.query(
//             'UPDATE accounts SET designation = ?, phone = ?, address = ? WHERE username = ?',
//             [designation,phone,address,username],
//             (error, results) => {
//                 if (error) {
//                     console.log('Error updating profile:', error);
//                     return response.status(500).send('An error occurred while updating your profile.');
                    
//                 }
//                 if (results.affectedRows > 0) {
//                     request.flash('info', 'Profile updated successfully!');
//                     response.redirect('/profile');
//                 } else {
//                     response.status(404).send('User not found.');
//                 }
//             }
//         );
//     } else {
//         request.flash('info', 'Please log in to update your profile!');
//         response.redirect('/');
//     }
// });

// // Route to handle image upload
// router.post('/uploadimage', upload.single('profileImage'), (request, response) => {
//     if (request.session.loggedin) {
//         const username = request.session.username;
//         const imagePath = `/uploads/${request.file.filename}`; // Save relative path

//         // Update image path in the database
//         connection.query(
//             'UPDATE accounts SET profile_image = ? WHERE username = ?',
//             [imagePath, username],
//             (error,results) => {
//                 if (error) {
//                     console.error('Database error:', error);
//                     return res.status(500).send('An error occurred while updating the profile image.');
//                 }
//                 if (results.affectedRows > 0) {
//                     request.flash('info', 'Image uploaded successfully!');
//                     response.redirect('/profile');
//                 } else {
//                     response.status(404).send('User not found.');
//                 }
//             }
//         );
//     } else {
//         request.flash('info', 'Please log in to update your profile!');
//         response.redirect('/');
//     }
// });

module.exports = router;
