var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();
const crypto = require('crypto');
const createHttpError = require('http-errors');

const db = require('../models');
const UserService = require('../services/UserService');
const { parseJWT } = require('../utils/utils');

const userService = new UserService(db);

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/get', async function (req, res, next) {
  const { email } = req.body;
  if (email == null) {
    return next(400, 'All fields are required');
  }

  const user = await userService.getByEmail(email);
  if (!user) return next(404, 'User not found');
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

router.get('/login', async function (req, res, next) {
  let { email, password } = req.body;
  if (email == null || password == null)
    return next(createHttpError(400, 'All fields are required'));

  let existingUser;

  try {
    existingUser = await userService.getByEmail(email);
    console.log(existingUser);
  } catch {
    return next(createHttpError(500, 'Something went wrong'));
  }

  const oldPassword = Uint8Array.from(atob(existingUser.password), (c) =>
    c.charCodeAt(0)
  );
  const saltBuffer = Uint8Array.from(atob(existingUser.passwordsalt), (c) =>
    c.charCodeAt(0)
  );

  crypto.pbkdf2(
    password,
    saltBuffer,
    31000,
    32,
    'sha256',
    function (err, hashedPassword) {
      const oldPassword = Uint8Array.from(atob(existingUser.password), (c) =>
        c.charCodeAt(0)
      );
      if (err) return next(500, 'Something went wrong');
      if (!existingUser || !crypto.timingSafeEqual(oldPassword, hashedPassword)) {
        return next(createHttpError(401, 'Incorrect username or password'));
      }

      let token;
      try {
        token = jwt.sign(
          {
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
            roleId: existingUser.RoleId,
          },
          process.env.TOKEN_SECRET,
          { expiresIn: '1h' }
        );
      } catch (err) {
        console.error(err);
        return next(createHttpError(500, 'Something went wrong'));
      }
      res.cookie('token', token, { maxAge: 3600 * 1000 });
      return res.status(201).json({
        success: true,
        data: {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
          roleId: existingUser.RoleId,
          token: token,
        },
      });
    }
  );
});

router.post('/signup', async (req, res, next) => {
  const { name, email, password } = req.body;
  if (name == null || email == null || password == null)
    return next(400, 'All fields are required');

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
        return next(createHttpError(409, 'User already exists'));

      let token;
      try {
        token = jwt.sign(
          { id: user.id, name: user.name, email: user.email, roleId: user.RoleId },
          process.env.TOKEN_SECRET,
          { expiresIn: '1h' }
        );
      } catch (err) {
        console.error(err);
        return next(createHttpError(500, 'Something went wrong'));
      }

      res.cookie('token', token, { maxAge: 3600 * 1000 });
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

router.delete('/:userId', async function (req, res, next) {
  console.log(parseJWT(req.cookies.token));
  return res.status(200).json({ message: 'User deleted' });
});

router.get('/logout', async function (req, res, next) {
  res.cookie('token', '', { maxAge: 0 });
  return res.status(200).json({ message: 'User logout' });
});

module.exports = router;
