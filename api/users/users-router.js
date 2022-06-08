const express = require('express');

const { logger, 
        validateUserId,
        validateUser,
        validatePost } = require('../middleware/middleware')
const Posts = require('../posts/posts-model');
const Users = require('../users/users-model');

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

// router.get('/', logger);
router.get('/', (req, res) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  Users.get()
    .then(arrayOfUsers => {
      res.status(200).json(arrayOfUsers)
    })
});

router.get('/:id', validateUserId, (req, res) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  res.json(req.existingUser)
});

router.post('/', validateUser, (req, res) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  Users.insert(req.user)
    .then(user => {
      res.status(201).json(user)
    })
    .catch(error =>{
      res.status(400).json({ message: 'missing required name field' })
    })
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  Users.update(req.params.id, req.body)
    .then(user => {
      res.status(201).json(user)
    })
    .catch(error => {
      res.status(400).json({ message: 'missing required name field' })
    })
});

router.delete('/:id', validateUserId, (req, res) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  Users.remove(req.existingUser.id)
    .then(() => {
      res.status(200).json(req.existingUser);
    })
    .catch(error => {
      res.status(400).json({ message: '' })
    })

});

router.get('/:id/posts', validateUserId, (req, res) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  Users.getUserPosts(req.params.id)
    .then(arrayOfPosts => {
      res.status(200).json(arrayOfPosts)
    })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  Posts.insert( { user_id: req.params.id, text: req.body.text } )
    .then(updatedPosts => {
      // console.log(req.post)
      res.status(200).json(updatedPosts)
    })
});

// do not forget to export the router
module.exports = router