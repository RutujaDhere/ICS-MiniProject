require('dotenv').config()

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");    //Level 2 
const md5 = require("md5");             //level 3
const bcrypt = require("bcrypt");       //level 4
const saltRounds = 10;                  //level 4 with salting

const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const { initialize } = require('passport');


const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'Any secrate string',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useCreateIndex', true);

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);

//const secret = "thisisthesecrate";                  //level 2
//userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] })       //level 2


//userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });     //Level 2 with dotenv

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function (req, res) {
    res.render("home");
})
app.get("/login", function (req, res) {
    res.render("login");
})
app.get("/register", function (req, res) {
    res.render("register");
});
app.get("/secrets", function (req, res) {
    if (req.isAuthenticated()) {
        res.render("secrets");
    } else {
        res.render("login")
    }
})

app.post("/register", function (req, res) {

    User.register({ username: req.body.username }, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/secrets");
            })
        }
    })


    //Level 5 Hasing + Salting
    // const newUser = new User({
    //     email: req.body.username,
    //     password: req.body.password
    //     //password: md5(req.body.password)            //level 3
    // })
    // newUser.save(function (err) {
    //     if (err) {
    //         console.log(err);
    //     }
    //     else {
    //         res.render("secrets");
    //     }
    // })
});


//level 4
// app.post("/register", function (req, res) {
//     bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
//         const newUser = new User({
//             email: req.body.username,
//             password: hash
//         })
//         newUser.save(function (err) {
//             if (err) {
//                 console.log(err);
//             }
//             else {
//                 res.render("secrets");
//             }
//         })
//     });

// })




app.post("/login", function (req, res) {


    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user, function (err) {
        if (err) {
            console.log(err);
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/secrets");
            })
        }
    })




    //Level 5 Hasing + Salting
    // const username = req.body.username;
    // const password = req.body.password;
    // //const password = md5(req.body.password);            //level 3
    // User.findOne({ email: username }, function (err, foundUser) {
    //     if (err) {
    //         console.log(err);
    //     }
    //     else {
    //         if (foundUser) {
    //             res.render("secrets");
    //         }
    //     }
    // })
})

//Level 4
// app.post("/login", function (req, res) {

//     const username = req.body.username;
//     const password = req.body.password;
//     User.findOne({ email: username }, function (err, foundUser) {
//         if (err) {
//             console.log(err);
//         }
//         else {
//             if (foundUser) {
//                 bcrypt.compare(password, foundUser.password, function (err, result) {
//                     if (result == true) {
//                         res.render("secrets");
//                     }
//                 });
//             }
//         }
//     })
// })

app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
})

app.listen(3000, function () {
    console.log("server is running at port 3000");
})