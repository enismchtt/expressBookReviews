const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;


const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username , password} = req.body ;

  if (username && password){

    if(isValid(username)){
      users.push({"username" : username , "password" : password});

      res.status(201).send(`The user ${username} is added the system.`);

    }else{
      res.status(301).send("Usernames must be unique.");
    }

  }else{

    res.status(301).send("Both username and password must be provided.");
  }


});




// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  try {
    const response = await new Promise((resolve ,reject ) => { 
      setTimeout(() => resolve(books) , 500) ; } ) // 250ms fake delay to make it look like db 
      
    res.status(201).send(JSON.stringify({ books: response }, null, 4));
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Serverside error occurred. Books unreachable");
  }
});





// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res)  => {
  //Write your code here
  const isbn = req.params.isbn;

  if( isbn <= Object.keys(books).length && isbn >0) {

    try{
      const response = await new Promise ( (res, rej) => {
      setTimeout(() => resolve(books[isbn]) , 500);
    } )

      res.status(201).send(response);
    }catch(err){
      res.status(301).send(`Error fetching data by isbn.`);
    }
  }else{
    res.status(301).send(`The number ${isbn} is out of range.`);
  }

 });
  


// Get book details based on author
public_users.get('/author/:author',async (req, res) => {

  const author = req.params.author;

  try{
    const books_retr = await new Promise ( (res, rej) => {
      setTimeout(() => res(books) , 500);
    } )

    const booksArr = Object.values(books_retr) ; // extracting values from dict 

    const booksByAuthor = booksArr.filter( (book) =>  book.author == author && book.author != "Unknown") ; 
    // 1 param (book) can be book but if no param or more than 1 than it's must.

    if(booksByAuthor.length > 0){
      res.status(201).send(JSON.stringify({booksByAuthor} , null , 4));
    }else{
      res.status(301).send(` No book can found with author named : ${author}`);}
  }
  catch(err){
    res.status(301).send(` Error occured on retrieving books.`);}
  }


);

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  //Write your code here
  const title = req.params.title;


  try{

    const books_retr = await new Promise ( (res, rej) => {
      setTimeout(() => res(books) , 500);
    } )

    const booksArr = Object.values(books_retr);

    booksByTitle = booksArr.filter((book) => book.title == title );

    if (booksByTitle.length > 0) {
      res.status(201).send(JSON.stringify({booksByTitle} , null, 4));
    }else {
      res.status(301).send(` No book can found with title named : ${title}`)
    }
  }catch(err){res.status(301).send("ERROR ON RETIREVING BOOKS.");}

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  if(isbn <= Object.keys(books).length && isbn >0){

    let reviews = books[isbn].reviews;

    res.status(201).send(JSON.stringify({reviews}) ,null ,4);

  }else{
    res.status(301).send(`${isbn} is out of bound .`);
  }



});

module.exports.general = public_users;
