const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    if(req.session.authentication){
        let token = req.session.authentication["accessToken"] ;

        jwt.verify(token , "secret123" ,  (err , user) =>{  // user will be equal to payload 
            if(!err){
                req.username = user.username; // adding username as a attribute since request is actually an object
                next(); // returns the next function bounded
            }else{
                return res.status(403).json({"message" : "token failed!"});
            }

        });

    }
    else {
        return res.status(403).json({"message" : "User not logged in!"});
    }


});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log(`Server is running on ${PORT}`));
