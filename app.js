const express = require("express");
const path = require("path");
const bodyParser = require("body-parser")
const session = require("express-session");
const { createSecretKey } = require("crypto");
// const login = require("./login")
const app = express();

//session handling
app.use(session ({
    secret : 'secret-key-running',
    resave : false,
    saveUninitialized : false,
}));



// Middleware for prevent catching
function noCache(req, res, next) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
}

app.set('view engine', 'ejs');
//middleware for connect my static folder
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'))

//To load each webpage
app.get('/login', (req, res) => {
    res.render('index')

})

//To read the data in form
app.use(bodyParser.urlencoded({ extended: false }));

//Form authentication
app.post('/login', (req, res)=> {
    const {inputEmail, inputPassword} = req.body;
    if(inputEmail === preUsername && inputPassword ===prePassword){
        req.session.user ={inputEmail: preUsername, inputPassword : prePassword}
        res.redirect('/dashboard');
    }else{
        res.render("index", {error: "Entered Username or password is Invalid"})
    }
    })


function requireAuth(req, res, next){
    if(req.session && req.session.user){
        return next();

    }else{
        res.redirect('/login')
    }
}

const authentication =[requireAuth,noCache]

app.get('/dashboard', authentication, (req, res) => {
    res.render('dashboard')
})



//predefining username and password
const preUsername = process.env.PRE_USERNAME || "aneesha@gmail.com";
const prePassword = process.env.PRE_PASSWORD || "anee123";


app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            res.sendStatus(500); // Internal Server Error
        } else {        
            res.render('index',{success:"Successfully Logged Out"})
           
        }
    });
   
});

const PORT = process.env.PORT||3000
app.listen(PORT, () => {
    console.log("server started");
});