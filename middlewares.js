const express = require('express');
const router = express.Router();
const knex = require('../knex');

const checkId = async (tableName, id) => {
  const response = await knex(tableName).where('id', id);
  return response.length > 0;
}

const checkIfExists = async (tableName, name) => {
  const response = await knex(tableName).where('name', name);
  return response.length !== 0;
}

const errorCreator = (res, errMess) => {
  res.send({
    error: {
      message: errMess
    }
  })
}

module.exports = {
  checkId,
  checkIfExists,
  errorCreator
}
