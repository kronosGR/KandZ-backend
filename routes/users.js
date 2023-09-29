var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

const db = require('../models');
const UserService = require('../services/UserService');

const userService = new UserService(db);

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', async (req, res, next) => {
  const { name, email, password } = req.body;
  console.log(name, email, password);
  if (name == null || email == null || password == null)
    res.status(400).json({ status: 400, message: 'All fields are required' });

  const user = await userService.create(name, email, password);
  if (user.error == 'duplicate')
    return res.status(409).json({ status: 409, message: 'User already exists' });

  let token;
  try {
    token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, roleId: user.RoleId },
      process.env.TOKEN_SECRET,
      { expiresIn: '1h' }
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 500, message: 'Something went wrong.' });
  }
  return res.status(201).json({
    success: true,
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      roleId: user.RoleId,
      token: token,
    },
  });
});

module.exports = router;
