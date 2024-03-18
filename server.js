const express = require('express');
const path = require('path');
const bodyparser = require("body-parser")
const session = require("express-session")
const nocache = require("nocache");
const {v4:uuidv4} = require("uuid");

const router = require('./router')

const app = express();

const port = process.env.PORT || 3000;

//serializing form data
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:true}))

app.set('view engine', 'ejs');

//load static assets
app.use("/static", express.static(path.join(__dirname, 'public')))
app.use("/assets1", express.static(path.join(__dirname, 'public/assets')))

app.use(nocache());

app.use(session({
    // We can use uuid to make secret string
    secret: uuidv4(), 
    resave: false,
    saveUninitialized:true
}))

//This middleware will add all this routers inside this server
app.use('/route', router)
// => /route is the name of the router. We use /route/login to access it.

//home route
app.get('/', (req, res)=>{

    if(req.session.user){
        res.render('dashboard', {user: req.session.user})
    }else{
    res.render('base', {title: "Login System"}) 
    }
    
})

app.listen(port, () => {
    console.log("Listening to the server on http://localhost:3000")
})