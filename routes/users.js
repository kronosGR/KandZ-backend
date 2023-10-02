var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();
const crypto = require('crypto');

const db = require('../models');
const UserService = require('../services/UserService');

const userService = new UserService(db);

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/get', async function (req, res, next) {
  const { email } = req.body;
  if (email == null) {
    return res.status(400).json({ status: 400, message: 'All fields are required' });
  }
  const user = await userService.getByEmail(email);
  if (!user) return res.status(404).json({ status: 404, message: 'User not found' });
  console.log(user);
  res.status(200).json({
    success: true,
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      roleId: user.RoleId,
    },
  });
});

router.post('/signup', async (req, res, next) => {
  const { name, email, password } = req.body;
  if (name == null || email == null || password == null)
    res.status(400).json({ status: 400, message: 'All fields are required' });

  const salt = crypto.randomBytes(16);
  crypto.pbkdf2(
    password,
    salt,
    31000,
    32,
    'sha256',
    async function (err, hashedPassword) {
      console.log(hashedPassword);
      if (err) return next(err);
      const user = await userService.create(
        name,
        email,
        hashedPassword.toString('base64'),
        salt.toString('base64')
      );
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
    }
  );
});

module.exports = router;
