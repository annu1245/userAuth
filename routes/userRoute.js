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

    try {
        // Get user input
        const { name, emailId, password } = req.body; 
    
        // Validate user input
        if (!(emailId && password && name)) {
          return res.status(200).send({state : 0}); 
        }
        const oldUser = await User.findOne({ emailId });

        if (oldUser) {
          return res.status(200).send({state : 1});
        }

        var user = await new User({
            name, 
            emailId,
            password,
        })
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
                return res.send({state : 2}); 
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

userRoute.post('/user/login', async (req,res) => {
    try {
        const {emailId, password} = req.body;
        if (!(emailId && password)){
            return res.status(200).send({status : 0});
        }

        const validUser = await User.findOne({emailId, password});

        if (validUser == null){
            return res.status(200).send({status : 1});            
        }

        if (validUser.isValid) {
            session = req.session;
            session.userid = emailId;
            return res.send({status : 3})
        }
        else{
            return res.status(200).send({status : 2})
        }
        console.log(validUser.isValid);


    } catch (error) {
        console.log(error)
    }
    

    
    // User.findOne({emailId : req.body.uemailId}, (err,user) => {
    //     if (user === null){
    //        return res.send({status : 1})
    //     }
    //     if (user.password === req.body.upassword){
    //         session = req.session;
    //         session.userid = req.body.uemailId;
    //         res.redirect('/');
    //     }
    //     else{
    //         return res.send({status : 1})
    //     }
    // })
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