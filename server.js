const express = require('express');

const userDb = require('./users/userDb')
const userRouter = require('./users/userRouter')
const postDb = require('./posts/postDb')
const postRouter = require('./posts/postRouter')

const server = express();

server.use(express.json())

server.use('/api/posts', postRouter)
server.use('/api/users', userRouter)

server.use(logger)

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  const timestamp = new Date()
  console.log(`request method: ${req.method}, request url: ${req.url} timestamp: ${timestamp}`)
  next()
}

module.exports = server;
