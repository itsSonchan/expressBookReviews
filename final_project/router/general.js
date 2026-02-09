const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
let username=req.body.username;
let password=req.body.password;
    if (username && password){
        if (isValid(username)){
            users.push({"username":username, "password":password})
            return res.status(200).json({message:"User with name "+username+" was created successfully."})
        }
        else{
           return res.status(404).json({message:"User already exists"})
        }}
   else{
    return res.status(404).json({message:"Please check your details."})}
   }
);

// Get the book list available in the shop
public_users.get('/',function (req, res) {
   res.send(JSON.stringify(books,null, 4))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn=req.params.isbn;
res.send(books[isbn])
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author=req.params.author;
  const authorBooks=Object.keys(books)
  .filter((isbn)=>{
    const bookAuthor=books[isbn].author.toLowerCase().replace(/\s+/g, '')
    return bookAuthor===author})
  .map(isbn=>books[isbn]);
  if (authorBooks.length>0){
    res.send(JSON.stringify(authorBooks, null, 4))
  }
  else{
    res.send("No books found for this author.")
  }
  }
);

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title=req.params.title;
    const titleBooks=Object.keys(books)
    .filter((isbn)=>{
      const bookTitle=books[isbn].title.toLowerCase().replace(/\s+/g, '')
      return bookTitle===title})
    .map(isbn=>books[isbn]);
    if (titleBooks.length>0){
      res.send(JSON.stringify(titleBooks, null, 4))
    }
    else{
      res.send("No books found for this title.")
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
const isbn=req.params.isbn;
let booksLength=Object.keys(books).length;
if (isbn<=booksLength){
res.send(JSON.stringify(books[isbn].reviews,null,4))}
else{
    res.send("No book with this ISBN.")
}
});

module.exports.general = public_users;
