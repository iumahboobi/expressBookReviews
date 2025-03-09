const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
  return username && username.trim().length > 0 && !username.includes('  ');

}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.

  // Find the user in the users array

  const user = users.find(user => user.username === username && user.password === password);

  return !!user; // Return true if the user exists, otherwise false.

}


//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here

  const { username, password } = req.body;

  //check if username and password are provided

  if (!username || !password) {

    return res.status(400).json({ message: "Username and password are required" })

  }

  // Check if the username is valid

  if (!isValid(username)) {
    return res.status(400).json({ message: "Invalid username" });
  }

  // Check if the username and password match the records
  if (!authenticatedUser(username, password)) {

    return res.status(401).json({ message: "Invalid username or password" });

  }

  // Generate a JWT token for the user
  const accessToken = jwt.sign({ username: username }, 'your_secret_key', { expiresIn: '1h' })

  // Save the JWT in the session

  req.session.accessToken = accessToken;

  // Return the JWT to the client

  return res.status(200).json({ message: "Login Successful", accessToken: accessToken });



  return res.status(300).json({ message: "Yet to be implemented" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here

  const isbn = req.params.isbn;
  const { review } = req.body;

  const username = req.user.username;
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Initialize the reviews object if it doesn't exist
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  // Add or update the review for the book
  books[isbn].reviews[username] = review;
  return res.status(200).json({ message: "Book updated successfully" })

  return res.status(300).json({ message: "Yet to be implemented" });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {

  const isbn = req.params.isbn;
  const username = req.user.username;

  // Check if the book exist
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book does not exist for deleting" })
  }

  // check if the user has a review fir the book

  if (!books[isbn].reviews || !books[isbn].reviews[username]) {
    return res.status(403).json({ message: "You do not have permission to delete this review" })
  }


  // Delete the review associated with the logedd. in user
  delete books[isbn].reviews[username];
  return res.status(200).json({ message: `Review deleted by ${username} Successfully!!` })

})




module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
