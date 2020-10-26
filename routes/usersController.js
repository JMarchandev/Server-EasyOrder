// Imports
var bcrypt = require('bcrypt');
var jwtUtils = require('./utils/jwt.utils');
var models = require('../models');
var asyncLib = require('async');

// Constants
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//const PASWWORD_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-+!*$@%_])([-+!*$@%_\w]{8,15})$/;

// Routes 
module.exports = {
    register: function (req, res) {
        var firstName = req.body.firstName;
        var lastName = req.body.lastName;
        var email = req.body.email;
        var password = req.body.password;
        var isAdmin = req.body.isAdmin;
        var phone = req.body.phone;
        var mobile = req.body.mobile;

        if (firstName == null || lastName == null || email == null || password == null) {
            return res.status(400).json({ 'error': 'missing parameters' })
        }

        if (!EMAIL_REGEX.test(email)) {
            return res.status(400).json({ 'error': 'email not valid' })
        }

        // if (!PASWWORD_REGEX.test(email)) {
        //     return res.status(400).json({ 'error': 'invalid password (must length 4 - 15)' })
        // }

        asyncLib.waterfall([
            function (done) {
                models.User.findOne({
                    attributes: ['email'],
                    where: { email: email }
                })
                    .then(function (userFound) {
                        done(null, userFound)
                    })
                    .catch(function (err) {
                        return res.status(500).json({ 'error': 'unable to verify user' })
                    });
            },
            function (userFound, done) {
                if (!userFound) {
                    bcrypt.hash(password, 5, function (err, bcryptedPassword) {
                        done(null, userFound, bcryptedPassword)
                    })
                } else {
                    return res.status(409).json({ 'error': 'user already exist ' });
                }
            },
            function (userFound, bcryptedPassword, done) {
                var newUser = models.User.create({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: bcryptedPassword,
                    isAdmin: 0,
                    phone: phone,
                    mobile: mobile
                })
                    .then(function (newUser) {
                        done(newUser)
                    })
                    .catch(function (err) {
                        return res.status(500).json({ 'error': 'cannot add user' })
                    });
            }
        ], function (newUser) {
            if (newUser) {
                return res.status(201).json({
                    'userId': newUser.id
                });
            } else {
                return res.status(500).json({ 'error': 'cannot add user' })
            }
        })
    },
    login: function (req, res) {
        var email = req.body.email;
        var password = req.body.password;

        if (email == null || password == null) {
            return res.status(400).json({ 'error': 'missing parameters' })
        }
        asyncLib.waterfall([
            function (done) {
                models.User.findOne({
                    where: { email: email }
                })
                    .then(function (userFound) {
                        done(null, userFound);
                    })
                    .catch(function (err) {
                        return res.status(500).json({ 'error': 'unable to verify user' })
                    });
            },
            function (userFound, done) {
                if (userFound) {
                    bcrypt.compare(password, userFound.password, function (errBycrypt, resBycrypt) {
                        done(null, userFound, resBycrypt);
                    });
                } else {
                    return res.status(404).json({ 'error': 'user not exist in database' });
                }
            },
            function (userFound, resBycrypt, done) {
                if (resBycrypt) {
                    done(userFound)
                } else {
                    return res.status(403).json({ 'error': 'invalid password' });
                }
            }
        ], function (userFound) {
            if (userFound) {
                return res.status(201).json({
                    'userId': userFound.id,
                    'token': jwtUtils.generateTokenForUser(userFound)
                });
            } else {
                return res.status(500).json({ 'error': 'cannot log on user' });
            }
        });
    },
    getUserProfile: function (req, res) {
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);

        if (userId < 0)
            return res.status(400).json({ 'error': 'wrong token' })

        models.User.findOne({
            attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'mobile'],
            where: { id: userId }
        })
            .then(function (user) {
                if (user) {
                    res.status(201).json(user)
                } else {
                    return res.status(400).json({ 'error': 'user not found' })
                }
            })
            .catch(function (err) {
                res.status(500).json({ 'error': 'cannot fetch user' })
            })
    },
    getAllUserProfile: function (req, res) {
        models.User.findAll()
            .then(function (users) {
                if (users) {
                    res.status(201).json(users)
                } else {
                    return res.status(400).json({ 'error': 'cannot found users' })
                }
            })
            .catch(function (err) {
                res.status(500).json({ 'error': 'cannot fetch users' })
            })
    },
    updateUserProfile: function (req, res) {
        // Getting auth header
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);

        // Params
        var phone = req.body.phone;

        asyncLib.waterfall([
            function (done) {
                models.User.findOne({
                    attributes: ['id', 'phone'],
                    where: { id: userId }
                }).then(function (userFound) {
                    done(null, userFound);
                })
                    .catch(function (err) {
                        return res.status(500).json({ 'error': 'unable to verify user' });
                    });
            },
            function (userFound, done) {
                if (userFound) {
                    userFound.update({
                        phone: (phone ? phone : userFound.phone)
                    }).then(function () {
                        done(userFound);
                    }).catch(function (err) {
                        res.status(500).json({ 'error': 'cannot update user' });
                    });
                } else {
                    res.status(404).json({ 'error': 'user not found' });
                }
            },
        ], function (userFound) {
            if (userFound) {
                return res.status(201).json(userFound);
            } else {
                return res.status(500).json({ 'error': 'cannot update user profile' });
            }
        });
    }
}