const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  //Write your code here

  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Please provide both username and password" });
  }

  //check if the user is already registered
  const user = users.some(user => user.username === username)
  if (user) {
    return res.status(400).json({ message: "Username already taken" });
  }

  // Add the new user to the users array
  users.push({ username, password });

  // Return success response
  return res.status(201).json({ message: "User registered successfully" });


  return res.status(300).json({ message: "Yet to be implemented" });
});


// Get the book list available in the shop
const getBooksAsync = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books);
    }, 1000)
  })
}

public_users.get('/', async (req, res) => {
  //Write your code here

  try {
    const books = await getBooksAsync();

    //The JSON.stringify(books, null, 2) method is used to format the books object into a readable JSON string with indentation (2 spaces).
    return res.status(200).json({ books: JSON.stringify(books, null, 2) });
  } catch (error) {

    return res.status(500).json({ message: "Error fetching books" });
  }

  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get book details based on ISBN

const getBooksByIsbn = async (isbn) => {
  return new Promise((resolve, reject) => {

    setTimeout(() => {
      if (books[isbn]) {
        resolve(books[isbn]);
      }
      else {
        reject(new Error(`Book ${isbn} not found`))
      }
    }, 1000)
  })
}

public_users.get('/isbn/:isbn', async (req, res) => {
  //Write your code here

  const isbn = req.params.isbn;
  try {
    const book = await getBooksByIsbn(isbn);
    return res.status(200).json({ book: JSON.stringify(book, null, 2) });

  } catch (error) {
    return res.status(500).json({ message: "Book ISBN not found" });
  }
});

// Get book details based on author

const getBooksByAuthor = async (author) => {

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const matchingBooks = [];
      for (const isbn in books) {
        if (books[isbn].author === author) {

          matchingBooks.push(books[isbn])

        }
      }
      if (matchingBooks.length > 0) {
        resolve(matchingBooks)
      }
      else {
        reject(new Error(`No books found by ${author}`))
      }
    }, 1000)
  })
}

public_users.get('/author/:author', async (req, res) => {
  //Write your code here
  const author = req.params.author;
  try {
    const matchingBooks = await getBooksByAuthor(author)
    return res.status(200).json({ books: matchingBooks })
  } catch (error) {

    return res.status(404).json({ message: `No book found by this author: ${author}` })

  }
});

// Get all books based on title

const getBooksByTitle = async (title) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const matchingBooks = []

      for (const isbn in books) {
        if (books[isbn].title === title) {
          matchingBooks.push(books[isbn])
        }
      }
      if (matchingBooks.length > 0) {
        resolve(matchingBooks)
      }
      else {
        reject(new Error(`Couldn't find book by this title ${title}`));
      }
    })

  }, 1000)
}

public_users.get('/title/:title', async (req, res) => {
  //Write your code here
  const title = req.params.title;
  try {
    const matchingTitle = await getBooksByTitle(title);
    return res.status(200).json({ books: matchingTitle })
  } catch (error) {
    return res.status(404).json({ message: `No book found by this title: ${title}` });
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  // Check if the book with the given ISBN exists
  if (books[isbn] && books[isbn].reviews) {

    return res.status(200).json({ reviews: books[isbn].reviews });

  }
  else {

    return res.status(404).json({ message: " no reviews available" });
  }

  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.general = public_users;
