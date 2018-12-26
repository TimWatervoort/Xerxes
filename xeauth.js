const express = require('express');
const router = express.Router();
const knex = require('../knex');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mw = require('./middlewares');
require('dotenv').config();

/*
Log in
*/

const xelogin = async (req, res, next) => {
  let tableName, userIdent, userPass;
  req.tableName ? tableName = `${req.tableName}` : tableName = 'users'; //define variables for entities
  req.userIdent ? userIdent = `${req.userIdent}` : userIdent = 'username';
  req.userPass ? userPass = `${req.userPass}` : userPass = 'password';

  const response = await knex(tableName).where(userIdent, req.body[userIdent]); //get user
  const user = response[0]

  bcrypt.compare(req.body[userPass], user[userPass]).then(result => {
    if (result === true) {
      const token = jwt.sign({user_id: user.id}, process.env.SECRET_KEY)
      res.send(token)
    } else {
      mw.errorCreator(res, 'Bad credentials.')
    }
  })
}

const xesignup = async (req, res ,next) => {
  let tableName, userIdent, userPass;
  req.tableName ? tableName = `${req.tableName}` : tableName = 'users'; //define variables for entities
  req.userIdent ? userIdent = `${req.userIdent}` : userIdent = 'username';
  req.userPass ? userPass = `${req.userPass}` : userPass = 'password';
  const newUser = req.body

  bcrypt.hash(req.body[userPass], 10)
  .then(hash => {

    newUser[userPass] = hash;

    knex(tableName)
    .returning(userIdent)
    .insert(newUser)
    .then(result => {
      res.send(result)
    })
    .catch(err => {
      mw.errorCreator(res, err)
    });
  })
  .catch(err => {
    mw.errorCreator(res, err)
  })
}


module.exports = {
  xelogin,
  xesignup
}
