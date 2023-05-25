// const express = require('express');
// const routerapi = express.Router();
// const db = require('../db');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');

// routerapi.post('/register', async (req, res) => {
//   try {
//     // Extract data from the request body
//     const { type, nomPrenom, email, cni, password, telephone, age, urgence, sexe } = req.body;

//     // Check if the username field is not empty
//     if (!nomPrenom) {
//       return res.status(400).json({ success: false, message: 'Username field cannot be empty' });
//     }

//     // Hash the password before storing it in the database
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create a SQL query to insert a new user into the database
//     const sqlQuery = "INSERT INTO users (role, username, email, cni, password, phone, age, urgence, sexe) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

//     // Call the database to execute the query
//     await db.query(sqlQuery, ['Patient', nomPrenom, email, cni, hashedPassword, telephone, age, urgence, sexe]);
//     res.json({ success: true, message: 'User registered successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// });

// routerapi.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Query the database for the user with the given email
//     const sqlQuery = "SELECT * FROM users WHERE email=?";
//     const data = await db.query(sqlQuery, [email]);

//     if (data.length > 0) {
//       // Compare the password with the input password
//       const isPasswordValid = await bcrypt.compare(password, data[0].password);

//       if (isPasswordValid) {
//         // User authenticated, generate JWT token and send back to client
//         const token = jwt.sign({ email }, 'my-secret-key');
//         res.json({ success: true, data, token });
//       } else {
//         res.json({ success: false, message: 'Invalid email or password' });
//       }
//     } else {
//       res.json({ success: false, message: 'Invalid email or password' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// });

// module.exports = routerapi;
