const express = require('express');
app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');

const userRoute = require('./routes/userRoute')
require('dotenv').config();

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use( express.static( "public" ) );

const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));
app.use(cookieParser());

app.set('view engine', 'ejs');

app.use('/', userRoute);

mongoose.connect(process.env.mydb, 
    {useNewUrlParser: true, useUnifiedTopology: true},
    () => {
        console.log("connected..")
    });


app.listen(process.env.port)