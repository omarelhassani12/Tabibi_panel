const con = require('../db');
const express = require('express');
const routerUser = express.Router();


routerUser.get('/GetUsers', (req, res) => {
  con.query('SELECT * FROM users', (err, rows, fields) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error retrieving users');
    }
    res.send(rows);
  });
});

routerUser.get('/GetUserDetails', (req, res) => {
  const userId = req.query.id;
  con.query('SELECT * FROM users WHERE id = ?', [userId], (err, rows, fields) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error retrieving user details');
    }
    if (rows.length === 0) {
      return res.status(404).send('User not found');
    }
    res.send(rows[0]);
  });
});

routerUser.delete('/DeleteUser', (req, res) => {
  const userId = req.query.id;
  con.query('DELETE FROM users WHERE id = ?', [userId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error deleting user');
    }
    res.sendStatus(200);
  });
});

module.exports = routerUser;
