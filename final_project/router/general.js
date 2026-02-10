const express = require('express');
const axios=require("axios").default;
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
public_users.get('/', async (req, res)=> {
    const getBooks=()=>{
        return new Promise((resolve)=>
{
    resolve(books)
}    )}
  try{
    const bookList=await getBooks();
    res.send(JSON.stringify(bookList,null,4))
  }
  catch(error){
    res.status(404).json({message:"Cannot get books."})  }
});


  

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async (req, res)=> {
    const isbn=req.params.isbn;
    const getBookByIsbn=()=>{
        return new Promise((resolve,reject)=>{
            if(books[isbn]){
            resolve(books[isbn])
            }
        else{
            reject("Book not found.")
        }        })
    }
    try{
        const bookResult= await getBookByIsbn();
        res.send(bookResult)
    }
    catch(error){
        res.status(404).json({message:"Book not found."})
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author=req.params.author;

    const getBookByAuthor=new Promise ((resolve, reject)=>{
            const authorBooks=Object.keys(books)
            .filter((isbn)=>{
             const bookAuthor=books[isbn].author.toLowerCase().replace(/\s+/g, '')
             return bookAuthor===author})
            .map(isbn=>books[isbn]);
            if (authorBooks.length>0){
                resolve(authorBooks)
              }
              else{
                reject("No books found for this author.")
              }
        })
       
            getBookByAuthor
            .then((result)=>res.status(200).send(JSON.stringify(result,null,4)))
            .catch((error)=>res.status(404).json({message:error}))
        
    }
);

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title=req.params.title;
    const getBookByTitle=new Promise((resolve,reject)=>
{
    const titleBooks=Object.keys(books)
    .filter((isbn)=>{
      const bookTitle=books[isbn].title.toLowerCase().replace(/\s+/g, '')
      return bookTitle===title})
    .map(isbn=>books[isbn]);
    if (titleBooks.length>0){
        resolve(titleBooks)
    }
      else{
        reject("No books found for this title.")
      }
})
    getBookByTitle
    .then((result)=>res.status(200).send(JSON.stringify(result, null, 4)))
    .catch((error)=>res.status(404).json({message:error}))
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
