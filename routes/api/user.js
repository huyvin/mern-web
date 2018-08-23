const express = require('express');
const router  = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');


//load input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginIpnut = require('../../validation/login');

const keys = require('../../config/keys');

const User = require('../../models/User');

// @route GET api/users/test
// @desc test user route
// @access public
router.get('/test', (req, res) => res.json({msg: "user works"}));

router.post('/register', (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);

    if(!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({email: req.body.email })
    .then(user => {
        if(user) { // on checke si l'utilisateur n'est pas deja enregistre
            errors.email = 'Email already exists';
            return res.status(400).json(/*{email: "email already exists"}*/ errors);
        } else {
            const avatar = gravatar.url(req.body.email, {
                s: '200', // taille
                r: 'pg', // rating
                d: 'mm' // défaut
            });

            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                avatar,
                password: req.body.password
            });

            bcrypt.genSalt(10, (err, salt) => {
                if (err) throw err;
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                });
            });
        }
    })
});

//login user / return token
router.post('/login', (req, res) => {
    const { errors, isValid } = validateLoginIpnut(req.body);

    // if(!isValid) {
    //     return res.status(400).json(errors);
    // }

    const email = req.body.email;
    const password = req.body.password;

    //
    User.findOne({email})
        .then(user => {
            if(!user) {

                console.log('hello');
                errors.email = 'user not found';
                return res.status(404).json(errors); /*{email: 'user not found'}*/
                
                // return res.status(404).json({email: 'User not found'});
                
            }

            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(isMatch) {
                        // creation du jwt payload pour identifier le token    
                        const payload = {
                            id: user.id,
                            name: user.name,
                            avatar: user.avatar
                        };

                        jwt.sign(payload, keys.secret, {expiresIn: 3600}, (err, token) => {
                            res.json({success: true, token: 'Bearer '+ token });
                        });
                    } else {
                        errors.password= 'password incorrect';
                        return res.status(404).json(/*{password: 'password incorrect'}*/errors);
                    }
                })
        })
});

router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.json({id: req.user.id, name: req.user.name});
});


module.exports = router;