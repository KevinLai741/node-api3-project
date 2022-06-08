const Posts = require('../posts/posts-model');
const Users = require('../users/users-model');

function logger(req, res, next) {
  // DO YOUR MAGIC
  req.timestamp = new Date()
  res.status(200).json(`${req.timestamp}, ${req.method}, ${req.url}`)
  next();
}

function validateUserId(req, res, next) {
  // DO YOUR MAGIC
  Users.getById(req.params.id)
    .then(user => {
      if(user)  {
        req.existingUser = user;
        next();
      } else {
        res.status(404).json({ message: 'user not found' })
      }
    })
}

function validateUser(req, res, next) {
  // DO YOUR MAGIC
  if (typeof req.body.name != 'string' || req.body.name.trim() == '') {
    res.status(400).json({ message: 'missing required name field'})
    return;
  }
  req.user = { name: req.body.name.trim() };
  next();
}

function validatePost(req, res, next) {
  // DO YOUR MAGIC
  if(typeof req.body.text != 'string' || req.body.text.trim() == '') {
    res.status(400).json({ message: 'missing required text field' })
    return;
  }
  // req.post = { text: req.body.text.trim() };
  next()
}

// do not forget to expose these functions to other modules
module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost
};