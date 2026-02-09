const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//check is the username is valid
let userToCheck=users.filter((user)=>{return user.username===username})
if(userToCheck.length>0){
    return true
}
else {return false}
}

const authenticatedUser = (username,password)=>{ //returns boolean
//check if username and password match the one we have in records.
let validUser=users.filter((user)=>user.username===username&&user.password===password)
if (validUser>0){
    return true
}
else{return false}
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
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
