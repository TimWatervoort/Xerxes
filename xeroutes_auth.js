const express = require('express');
const router = express.Router();
const knex = require('../knex');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mw = require('./middlewares');
require('dotenv').config();

const tokenCheck = async (res, token) => {
  const decoded_jwt = await jwt.verify(token, process.env.SECRET_KEY, (err, result) => {
    if (err) {
      mw.errorCreator(res, err.message);
      return;
    } else {
      return result;
    }
  });
  return decoded_jwt.user_id;
}

/*
GET ALL POSTS
*/

const xelist_auth = async (req, res, next) => {
  if (!req.header('Authorization')) { //check if token is provided
    mw.errorCreator(res, 'No token provided.');
    return;
  }
  const valid = await tokenCheck(res, req.header('Authorization'));
  if (!valid) { // check if token is correct
    mw.errorCreator(res, 'Authorization failed.');
    return;
  }
  const tableName = `${req.tableName}` //declare table name
  knex(tableName) // get from knex
  .then(result => {
    res.send(result)
  })
  .catch(err => {
    mw.errorCreator(res, err)
  })
}

/*
GET ONE POST
*/

const xeget_auth = async (req, res, next) => {

  if (!req.header('Authorization')) { //check if token is provided
    mw.errorCreator(res, 'No token provided.');
    return;
  }
  const valid = await tokenCheck(res, req.header('Authorization'));
  if (!valid) { // check if token is correct
    mw.errorCreator(res, 'Authorization failed.');
    return;
  }

  const tableName = `${req.tableName}` // declare table name
  console.log(tableName, req.params.id);
  const idTrue = await mw.checkId(tableName, req.params.id) //check if id exists
  if (!idTrue) {
    mw.errorCreator(res, 'Selected item does not exist!') //send error if id does not exist
  } else {

    knex(tableName) //knex request for one post
    .where('id', req.params.id)
    .then(result => {
      res.send(result)
    })
    .catch(err => {
      mw.errorCreator(res, err)
    })
  }
}

/*
ADD ONE POST
*/

const xepost_auth = async (req, res, next) => {

  if (!req.header('Authorization')) { //check if token is provided
    mw.errorCreator(res, 'No token provided.');
    return;
  }
  const valid = await tokenCheck(res, req.header('Authorization'));
  if (!valid) { // check if token is correct
    mw.errorCreator(res, 'Authorization failed.');
    return;
  }

  const tableName = `${req.tableName}`; // declare table name
  const nameExists = await mw.checkIfExists(tableName, req.body.name); // check if the name exists

  if (nameExists) {
    mw.errorCreator('This item already exists!') //send error if name exists
  } else {
    knex('cookies') //make knex request and insert body
    .insert(req.body)
    .returning('*')
    .then(result => {
      res.send(result)
    })
    .catch(err => {
      mw.errorCreator(res, err)
    })
  }
}

/*
PATCH ONE POST
*/

const xepatch_auth = async (req, res, next) => {

  if (!req.header('Authorization')) { //check if token is provided
    mw.errorCreator(res, 'No token provided.');
    return;
  }
  const valid = await tokenCheck(res, req.header('Authorization'));
  if (!valid) { // check if token is correct
    mw.errorCreator(res, 'Authorization failed.');
    return;
  }

  const tableName = `${req.tableName}` // declare table name
  const idTrue = await mw.checkId(tableName, req.params.id) //check if id exists
  if (!idTrue) {
    mw.errorCreator(res, 'Selected item does not exist!') //send error if id does not exist
  } else {
    const orig = await knex(tableName).where('id', req.params.id);
    const updated = {};
    Object.keys(orig[0]).forEach(x => {
      req.body[x] ? updated[x] = req.body[x] : updated[x] = orig[x]
    });
    knex(tableName)
    .where('id', req.params.id)
    .returning('*')
    .update(updated)
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      mw.errorCreator(res, err)
    })
  }
}

/*
PUT ONE POST
*/

const xeput_auth = async (req, res, next) => {

  if (!req.header('Authorization')) { //check if token is provided
    mw.errorCreator(res, 'No token provided.');
    return;
  }
  const valid = await tokenCheck(res, req.header('Authorization'));
  if (!valid) { // check if token is correct
    mw.errorCreator(res, 'Authorization failed.');
    return;
  }

  const tableName = `${req.tableName}` // declare table name
  const idTrue = await mw.checkId(tableName, req.params.id) //check if id exists
  if (!idTrue) {
    mw.errorCreator(res, 'Selected item does not exist!') //send error if id does not exist
  } else {
    const orig = await knex(tableName).where('id', req.params.id);
    if (Object.keys(req.body).length !== Object.keys(orig[0]).length -1) {
      mw.errorCreator(res, 'Not all fields were provided!')
    } else {
      knex(tableName)
      .where('id', req.params.id)
      .returning('*')
      .update(req.body)
      .then(result => {
        res.send(result);
      })
      .catch(err => {
        mw.errorCreator(res, err)
      })
    }
  }
}

/*
DELETE ONE POST
*/

const xelete_auth = async (req, res, next) => {

  if (!req.header('Authorization')) { //check if token is provided
    mw.errorCreator(res, 'No token provided.');
    return;
  }
  const valid = await tokenCheck(res, req.header('Authorization'));
  if (!valid) { // check if token is correct
    mw.errorCreator(res, 'Authorization failed.');
    return;
  }

  const tableName = `${req.tableName}` // declare table name
  const idTrue = await mw.checkId(tableName, req.params.id) //check if id exists
  if (!idTrue) {
    mw.errorCreator(res, 'Selected item does not exist!') //send error if id does not exist
  } else {
    knex(tableName)
    .where('id', req.params.id)
    .del()
    .then(() => {
      knex(tableName)
      .then(result => {
        res.send(result)
      })
      .catch(err => {
        mw.errorCreator(res, err)
      })
    })
    .catch(err => {
      mw.errorCreator(res, err)
    })
  }
}

module.exports = {
  xelist_auth,
  xeget_auth,
  xepost_auth,
  xepatch_auth,
  xeput_auth,
  xelete_auth
}
