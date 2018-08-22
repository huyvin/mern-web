const express = require('express');
const router  = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

const User = require('../../models/User');

// @route GET api/users/test
// @desc test user route
// @access public
router.get('/test', (req, res) => res.json({msg: "user works"}));

router.post('/register', (req, res) => {
    User.findOne({email: req.body.email })
    .then(user => {
        if(user) { // on checke si l'utilisateur n'est pas deja enregistre
            return res.status(400).json({email: "email already exists"});
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
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(user => res.json(user))
                        .catch(console.log(err));
                })
            })
        }
    })
});

//login user / return token
router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    //
    User.findOne({email})
        .then(user => {
            if(!user) {
                return res.status(404).json({email: 'user not found'});
            }

            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(isMatch) {
                        res.jkson({msg: 'Success'});
                    } else {
                        return res.status(404).json({password: 'password incorrect'});
                    }
                })
        })
});


module.exports = router;