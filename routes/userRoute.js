const express = require('express');
userRoute = express.Router();
const User = require('../models/userModule');
const nodemailer = require('nodemailer');
require('dotenv').config();

var session;

userRoute.get('/register', (req,res) => {
    res.render('register', {error : 0})
})


userRoute.post('/user/register', async(req,res) => {
    User.findOne({emailId : req.body.uemailId}, (err, user) => {
        if (user != null){
            return res.send({status : 1});
        }
    })
    var user = new User({
        name : req.body.uname,
        emailId : req.body.uemailId,
        password : req.body.upassword,
    })

    try {
        const userData = await user.save();
        mytoken = userData.token
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.myemail,
                pass: process.env.mypassword
            }
            });
        
        let mailOptions = {
            from: process.env.myemail,
            to: userData.emailId,
            subject: "validation link",
            html : "To reset your password, click this <a href='http://localhost:3000/token/" + mytoken + "'><span>link</span></a>.<br>This is a <b>test</b> email."
            };

            transporter.sendMail(mailOptions, (error, response) => {
                if (error) {
                    console.log(error);
                }
                console.log(response);
                return res.send({status : 0});
            });
    } catch (error) {
        console.log(error)
    }
    
})

userRoute.get('/token/:validate', (req,res) => {
    var mailToken = req.params.validate;
    User.findOneAndUpdate({token: mailToken}, {isValid : "true"}, {new: true}, (err, doc) => {
        if (err) {
            console.log("Something wrong when updating data!");
        }
        res.render('mail_render');
    });
    
})

userRoute.get('/login', (req,res) => {
    res.render("login");
})

userRoute.post('/user/login', (req,res) => {
    User.findOne({emailId : req.body.uemailId}, (err,user) => {
        if (user === null){
           return res.send({status : 1})
        }
        if (user.password === req.body.upassword){
            session = req.session;
            session.userid = req.body.uemailId;
            res.redirect('/');
        }
        else{
            return res.send({status : 1})
        }
    })
})

userRoute.get('/', (req,res) => {
    session = req.session;
    if (session.userid){
        res.render('home')
    }
    else{
        res.redirect('/login');
    }
})





module.exports = userRoute;