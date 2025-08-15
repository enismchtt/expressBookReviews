const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let userTaken = users.find((user) => user.username == username );
 
  return !userTaken  ? true : false; // we want to be username not taken
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
      let authUser = users.find( (user) => user.username == username && user.password == password);
      return authUser ? true : false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {

  const { username , password } = req.body ;

  //Write your code here
  if(authenticatedUser(username,password)){

      const accessToken = jwt.sign({ user : username} , "secret123" , { expiresIn : "25m"}) // 25m is minutes

      req.session.authentication = { accessToken , username } ;

      res.status(201).json({ message : ` User ${username}  succesfully logged in ! `});

  }else {
    return res.status(301).json({message: "Authentication failed "});
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //If it's done to ISBN which certain user already reviewed it will be updated. But if's first time for THAT user than it will created from scratch.
  //const username = req.session.username ;
  const username = req.session.authentication["username"] ;
  console.log(`Put request by user ${username}.`)
  // not checking the range of isbn 
  const isbn = req.params.isbn;


  const updatedBook = books[isbn]; // reference here 

  if(updatedBook){
    updatedBook.reviews[username] = req.body.review
    res.status(201).send(`The book with ${isbn} review added to system.`)
  }
  else
    {
    res.status(301).send(`The book with ${isbn} doesn't exists.`);
    }

});


regd_users.delete("/auth/review/:isbn" , (req, res ) => {   // DON'T FORGET /    as prefix !!!! 

  const username = req.session.authentication["username"] ;
  const isbn = req.params.isbn;

  const book = books[isbn]; // passed by reference

  if(book){
    delete book.reviews[username] ; 
    res.status(201).send(`The review from ${username} on book with isbn : ${isbn} has been deleted.`);
  }else{
    res.status(301).send(`The isbn : ${isbn} not valid.`);
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
