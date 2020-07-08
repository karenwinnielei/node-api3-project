const express = require('express');

const router = express.Router();

const Users = require('./userDb');
const Posts = require('../posts/postDb');

router.post('/', validateUser, (req, res) => {
  // do your magic!
  Users.insert(req.body)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      res.status(500).json({ error: 'unable to post user' });
    });
});

router.post(
  '/:id/posts',
  validateUserId,
  validatePost,
  (req, res) => {
    // do your magic!
    let newPost = req.body;
    newPost.user_id = req.user.id;

    Posts.insert(newPost)
      .then((post) => {
        res.status(200).json(post);
      })
      .catch((err) => {
        res.status(500).json({ error: 'unable to add new post' });
      });
  },
);

router.get('/', (req, res) => {
  // do your magic!
  Users.get()
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      res.status(500).json({ error: 'unable to get user' });
    });
});

router.get('/:id', validateUserId, (req, res) => {
  // do your magic!
  console.log(req.user);
  res.status(200).json(req.user);
});

router.get('/:id/posts', validateUserId, (req, res) => {
  // do your magic!
  Users.getUserPosts(req.user.id)
    .then((post) => {
      if (!post) {
        res.status(404).json({ error: 'posts by user not found' });
      } else {
        res.status(200).json(post);
      }
    })
    .catch((err) => {
      res.status(500).json({ error: 'unable to get posts' });
    });
});

router.delete('/:id', validateUserId, (req, res) => {
  // do your magic!
  Users.remove(req.user.id)
    .then((deleted) => {
      Users.get().then((user) => {
        res.status(200).json(user);
      });
    })
    .catch((err) => {
      res.status(500).json();
    });
});

router.put('/:id', validateUserId, (req, res) => {
  // do your magic!
  Users.update(req.user.id, req.body)
    .then((updated) => {
      Users.getById(req.user.id)
        .then((user) => {
          res.status(200).json(user);
        })
        .catch((err) => {
          res.status(500).json({ error: 'unable to get user' });
        });
    })
    .catch((err) => {
      res.status(500).json({ error: 'unable to update' });
    });
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  Users.getById(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(400).json({ message: 'invalid user id' });
      } else {
        req.user = user;
        next();
      }
    })
    .catch((err) => {
      res.status(500).json({ error: 'unable to get user id' });
    });
}

function validateUser(req, res, next) {
  // do your magic!
  let user = req.body;

  Users.get(req.body);
  if (user === null) {
    res.status(400).json({ message: 'missing user data' });
  } else if (
    user.name === undefined ||
    user.name === null ||
    user.name === ''
  ) {
    res.status(404).json({ message: 'missing required name field' });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  // do your magic!
  let post = req.body;
  Users.getUserPosts(req.body);
  if (post === null) {
    res.status(400).json({ message: 'missing post data' });
  } else if (
    post.body === undefined ||
    post.body === null ||
    post.body === ''
  ) {
    res.status(400).json({ message: 'missing required text field' });
  } else {
    next();
  }
}

module.exports = router;
