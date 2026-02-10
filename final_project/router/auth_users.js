const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//check is the username is valid
let userToCheck=users.filter((user)=>{return user.username===username})
if(userToCheck.length>0){
    return false
}
else {return true}

}

const authenticatedUser = (username,password)=>{ //returns boolean
//check if username and password match the one we have in records.
let validUser=users.filter((user)=>{return user.username===username && user.password===password})
if(validUser.length>0){
    return true
}
else{
    return false
}
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username=req.body.username;
  const password=req.body.password;
  if (!username || !password){
    return res.status(404).json({message: "User or password invalid or missing"})
  }
if (authenticatedUser(username,password)){
    let accessToken=jwt.sign({data: password},"access",{expiresIn: 60*60})
    req.session.authorization={accessToken, username}
    return res.status(200).json({message: "User successfully logged in."})
}
else{
    return res.status(208).json({message:"Error logging in. Check details and try again."})}
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn=req.params.isbn;
  const username=req.session.authorization.username;
  const reviewText=req.query.review;
  const reviewList=books[isbn].reviews;
  if (books[isbn]){
  if(reviewText && reviewText.length>0){
    if (reviewList[username]){
       
        reviewList[username]=reviewText;
            return res.send("Review successfully updated.")
        
    }
    else{
reviewList[username]=reviewText;        
return res.send("Review posted.")
    }
  }
    else{
        return res.send("Please enter a review text.")
    }}
    else{
        return  res.send("No book found for ISBN.")
    }

});

regd_users.delete("/auth/review/:isbn",((req,res)=>{
    const isbn=req.params.isbn;
  const username=req.session.authorization.username;
  
    if(books[isbn]){
        const reviewList=books[isbn].reviews;
        if(reviewList[username]){
            delete reviewList[username];
            return res.send("Review deleted.")
        }
        else{
            return res.send("No review found for this user.")
        }
    }
    else{
        return res.send("No book found for ISBN.")
    }
}))

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
