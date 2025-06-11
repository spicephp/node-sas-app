const connection = require('../config/database');
const bcrypt = require('bcrypt');
const flash = require('connect-flash')
const { response, request } = require('express');
/*
@login
Description: Renders the login page and displays any flash messages.
*/
exports.login = (request, response) => {
    const successMsg = request.flash('successMsg');
    const errorMsg = request.flash('errorMsg');
    response.render('login', { successMsg: successMsg, errorMsg: errorMsg });
};
/*
@signup
Description: Renders the signup page and displays any flash messages.
*/
exports.signup = (request, response) => {
    const successMsg = request.flash('successMsg');
    const errorMsg = request.flash('errorMsg');
    response.render('signup', { successMsg: successMsg, errorMsg: errorMsg });
};
/*
@authenticate
Description: Authenticates the user by checking the username and password against the database, and sets session variables if successful.
*/
exports.authenticate = (request, response) => {
    let username = request.body.username;
    let password = request.body.password;
    if (username && password) {
        connection.query('SELECT * FROM accounts WHERE username = ? ', [username], async (error, results) => {
            if (error) {
                console.error('Database Error:', error);
                request.flash('errorMsg', 'Internal server error.');
                return response.redirect('/');
            }
            if (results.length === 0) {
                request.flash('errorMsg', 'Incorrect Username and/or Password!');
                return response.redirect('/');
            }
            const user = results[0];
            const hashedPassword = user.password;
            const match = await bcrypt.compare(password, hashedPassword);
            if (match) {
                request.session.loggedin = true;
                request.session.username = username;
                request.session.userinfo = user; // Save user info for later use
                return response.redirect('/dashboard');
            } else {
                request.flash('errorMsg', 'Incorrect Username and/or Password!');
                return response.redirect('/');
            }
        });
    } else {
        response.send('Please enter Username and Password!');
    }
};
/*
@register
Description: Handles user registration by checking if the username already exists, hashing the password, and inserting the new user into the database.
*/
exports.register = (request, response) => {
    const { username, password, email } = request.body;
    connection.query('SELECT * FROM accounts WHERE username = ?', [username], (error, results) => {
        if (error) {
            console.error('Database Error:', error);
            request.flash('errorMsg', 'Internal server error.');
            return response.redirect('/signup');
        } else if (results.length > 0) {
            request.flash('errorMsg', 'Username already exists!');
            return response.redirect('/signup');
        } else {
            bcrypt.hash(password, 10, (err, hashedPassword) => {
                if (err) {
                    console.error('Hashing Error:', err);
                    request.flash('errorMsg', 'Internal server error.');
                    return response.redirect('/signup');
                } else {
                    connection.query('INSERT INTO accounts (username, password, email) VALUES (?, ?, ?)', 
                        [username, hashedPassword, email], (insertError) => {
                            if (insertError) {
                                console.error('Insert Error:', insertError);
                                request.flash('successMsg', 'Internal server error.');
                                return response.redirect('/signup');
                            } else {
                                request.flash('successMsg', 'Registration successful! Please log in.');
                                return response.redirect('/');
                            }
                        });
                }
            });
        }
    });
};

/*
@dashboard
Description: Renders the dashboard page if the user is logged in.
*/
exports.dashboard = (request, response) => {
     if (request.session.loggedin) {
        const username = request.session.username;
        const successMsg = request.flash('successMsg');
        const errorMsg = request.flash('errorMsg');
        connection.query('SELECT * FROM accounts WHERE username = ?', [username], (error, results) => {
            if (error) throw error;
            if (results.length > 0) {
                const user = results[0];
                response.render('dashboard', { userinfo: user,successMsg : successMsg , errorMsg : errorMsg });
            } else {
                response.status(404).send('User not found.');
            }
        });
    } else {
        request.flash('successMsg', 'Please enter Username and Password!');
        response.redirect('/');
    }
};
/*
@profile
 Description: Fetches the user's profile information from the database and renders the profile page.
*/
exports.profile = (request, response) => {
    if (request.session.loggedin) {
        const username = request.session.username;
        const successMsg = request.flash('successMsg');
        const errorMsg = request.flash('errorMsg');
        connection.query('SELECT * FROM accounts WHERE username = ?', [username], (error, results) => {
            if (error) throw error;
            if (results.length > 0) {
                const user = results[0];
                response.render('profile', { userinfo : user,successMsg : successMsg, errorMsg : errorMsg });
            } else {
                response.status(404).send('User not found.');
            }
        });
    } else {
        request.flash('successMsg', 'Please enter Username and Password!');
        response.redirect('/');
    }
};
/*
@updateProfile
Description: Updates the user's profile information in the database.
*/
exports.updateProfile = (request, response)=>{
    if (request.session.loggedin) {
        const username = request.session.username;
        const { designation,phone,address } = request.body; 
        // Update query
        connection.query(
            'UPDATE accounts SET designation = ?, phone = ?, address = ? WHERE username = ?',
            [designation,phone,address,username],
            (error, results) => {
                if (error) {
                    console.log('Error updating profile:', error);
                    request.flash('errorMsg', 'An error occurred while updating your profile');
                    response.redirect('/profile');
                    
                }
                if (results.affectedRows > 0) {
                    request.flash('successMsg', 'Profile updated successfully!');
                    response.redirect('/profile');
                } else {
                    request.flash('errorMsg', 'User not found!');
                    response.redirect('/profile');
                }
            }
        );
    } else {
        request.flash('errorMsg', 'Please log in to update your profile!');
        response.redirect('/');
    }
};
/*
@updateProfilePicture
Description: Handles the profile picture upload and updates the user's profile image in the database.
*/
exports.updateProfilePicture = (request, response) => {
    if (request.session.loggedin) {
        const username = request.session.username;
        const imagePath = `/uploads/${request.file.filename}`; // Save relative path

        // Update image path in the database
        connection.query(
            'UPDATE accounts SET profile_image = ? WHERE username = ?',
            [imagePath, username],
            (error,results) => {
                if (error) {
                    console.error('Database error:', error);
                    return res.status(500).send('An error occurred while updating the profile image.');
                }
                if (results.affectedRows > 0) {
                    request.flash('successMsg', 'Image uploaded successfully!');
                    response.redirect('/profile');
                } else {
                    response.status(404).send('User not found.');
                }
            }
        );
    } else {
        request.flash('errorMsg', 'Please log in to update your profile!');
        response.redirect('/');
    }
}
/*
@users
Description: Fetch all users from the database and render the users page if the user is logged in.
*/
exports.users = (request, response) => {
    if (request.session.loggedin) {
        const username = request.session.username;
        const successMsg = request.flash('successMsg');
        const errorMsg = request.flash('errorMsg');

        connection.query('SELECT * FROM accounts', (error, results) => {
            if (error) {
                console.error('Database Error:', error);
                return response.status(500).send('Internal server error.');
            }
            response.render('users', {userinfo:username, successMsg: successMsg, errorMsg : errorMsg , users: results });
        });
    } else {
        request.flash('info', 'Please log in to view all users!');
        response.redirect('/');
    }
}
/**
 * @addUser
 * Description: Renders the add user page if the user is logged in.
 */
exports.addUser = (request,response) =>{
    if(request.session.loggedin){
        const username = request.session.username;
        const successMsg = request.flash('successMsg');
        const errorMsg = request.flash('errorMsg');
        response.render('users/adduser', {userinfo:username, successMsg: successMsg , errorMsg: errorMsg });
    }
}
/*
@createUser
Description: Handles the creation of a new user by checking if the username already exists, hashing the password, and inserting the new user into the database.
*/
exports.createUser = (request, response) => {
    const { username, password, email, designation, phone, address } = request.body;
    connection.query('SELECT * FROM accounts WHERE username = ?', [username], (error, results) => {
        if (error) {
            request.flash('errorMsg', 'Internal server error.');
             return response.redirect('/users/add');
        } else if (results.length > 0) {
            request.flash('errorMsg', 'Username already exists!');
            return response.redirect('/users/add');
        } else {
            bcrypt.hash(password, 10, (err, hashedPassword) => {
                if (err) {
                    console.error('Hashing Error:', err);
                    request.flash('errorMsg', 'Internal server error.');
                    return response.redirect('/users/add');
                } else {
                    connection.query('INSERT INTO accounts (username, password, email, designation, phone, address) VALUES (?, ?, ?, ?, ?, ?)', 
                        [username, hashedPassword, email, designation, phone, address], (insertError) => {
                            if (insertError) {
                                console.error('Insert Error:', insertError);
                                request.flash('errorMsg', 'Internal server error.');
                                return response.redirect('/users/add');
                            } else {
                                request.flash('successMsg', 'User created successfully!');
                                return response.redirect('/users');
                            }
                        });
                }
            });
        }
    });
};
/*@editUser
 Description: Fetches the user by ID and renders the edit user page if the user is logged in.
 */
exports.editUser = (request, response) => {
    const userId = request.params.id;
    const username = request.session.username;
    const successMsg = request.flash('successMsg');
    const errorMsg = request.flash('errorMsg');
    connection.query('SELECT * FROM accounts WHERE id = ?', [userId], (error, results) => {
        if (error) {
            console.error('Database Error:', error);
            return response.status(500).send('Internal server error.');
        }
        if (results.length === 0) {
            return response.status(404).send('User not found.');
        }
        response.render('users/edituser', { userinfo:username, successMsg: successMsg,errorMsg : errorMsg , user: results[0] });
    });
};
/**
 * @updateUser
 * Description: Updates the user information in the database based on the provided ID.
 */
exports.updateUser = (request, response) => {
    const userId = request.params.id;
    const {designation, phone, address } = request.body;

    connection.query('UPDATE accounts SET designation = ?, phone = ?, address = ? WHERE id = ?', 
        [designation, phone, address, userId], (error, results) => {
            if (error) {
                console.error('Database Error:', error);
                request.flash('errorMsg', 'Internal server error');
                return response.redirect('/users/edit/' + userId);
            }
            if (results.affectedRows > 0) {
                request.flash('successMsg', 'User updated successfully!');
                return response.redirect('/users');
            } else {
                request.flash('errorMsg', 'User not found.');
                return response.redirect('/users');
            }
        });
}
/**
*@viewUser
*Description: Fetches the user by ID and renders the view user page if the user is logged in.
 */
exports.viewUser = (request, response) => {
    const userId = request.params.id;
    const username = request.session.username;
    const successMsg = request.flash('successMsg');
    const errorMsg = request.flash('errorMsg');
    connection.query('SELECT * FROM accounts WHERE id = ?', [userId], (error, results) => {
        if (error) {
            console.error('Database Error:', error);
            request.flash('errorMsg', 'Internal server error.');
            return response.redirect('/users');
        }
        if (results.length === 0) {
            request.flash('errorMsg', 'User not found.');
            return response.redirect('/users');
        }
        response.render('users/viewuser', { userinfo:username, successMsg: successMsg, errorMsg : errorMsg , user: results[0] });
    });
}
/**@deleteUser
 * Description: Deletes the user by ID from the database and redirects to the users page.
 */

exports.deleteUser = (request, response) => {
    const userId = request.params.id;
    connection.query('DELETE FROM accounts WHERE id = ?', [userId], (error, results) => {
        if (error) {
            console.error('Database Error:', error);
            request.flash('errorMsg', 'Internal server error.');
            return response.redirect('/users');
        }
        if (results.affectedRows > 0) {
            request.flash('successMsg', 'User deleted successfully!');
            return response.redirect('/users');
        } else {
            request.flash('errorMsg', 'User not found.');
            return response.redirect('/users');
        }
    });
}
/**
 * @settings
 * Description: Show the System Configration options.
 */
exports.settings = (request, response) => {
    
        const username = request.session.username;
        const successMsg = request.flash('successMsg');
        const errorMsg = request.flash('errorMsg');
        const Id = 1; // Assuming you want to fetch settings by ID
        connection.query('SELECT * FROM settings WHERE id = ?', [Id], (error, results) => {
            if (error) {
                console.error('Database Error:', error);
                request.flash('errorMsg', 'Internal server error.');
                return response.redirect('/profile');
            }
            if (results.length > 0) {
                response.render('settings', {
                    userinfo: username,
                    successMsg: successMsg,
                    errorMsg: errorMsg,
                    siteinfo: results[0]
                });
            } else {
                request.flash('errorMsg', 'Settings not found.');
                return response.redirect('/profile');
            }
        });
};
/**
 * @updateSettings
 * Description: Updates the system settings in the database.
 */
exports.updateSettings = (request, response) => {
    const { title, description} = request.body;
    const Id = 1; // Assuming you want to update settings by ID
    connection.query(
        'UPDATE settings SET title = ?, description = ? WHERE id = ?',
        [title, description, Id],
        (error, results) => {
            if (error) {
                console.error('Database Error:', error);
                request.flash('errorMsg', 'Internal server error.');
                return response.redirect('/settings');
            }
            if (results.affectedRows > 0) {
                request.flash('successMsg', 'Settings updated successfully!');
                return response.redirect('/settings');
            } else {
                request.flash('errorMsg', 'Settings not found.');
                return response.redirect('/settings');
            }
        });
}
/*
 @logout
 Description: the user from the session and redirect to the home page 
*/
exports.logout = (request, response) => {
    request.session.destroy((err) => {
        if (err) {
            console.error('Session Destroy Error:', err);
        }
        response.redirect('/');
    });
};