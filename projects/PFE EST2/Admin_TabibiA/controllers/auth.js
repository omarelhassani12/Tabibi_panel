const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../db');


exports.register = (req, res) => {
  console.log(req.body); // Logging the request body to the console

  // Extracting values from the request body using object destructuring
  const { role, username, email, password } = req.body;

  db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
    if (error) {
      console.log(error);
      return res.render('sign-up', {
        message: "An error occurred"
      });
    }

    if (results && results.length > 0) {
      return res.render('sign-up', {
        message: "That email address is already registered"
      });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 8);
      console.log(hashedPassword);

      // Insert the user data into the database
      db.query(
        'INSERT INTO users (role, username, email, password) VALUES (?, ?, ?, ?)',
        [role, username, email, hashedPassword],
        (error, results) => {
          if (error) {
            console.log(error);
            return res.render('sign-up', {
              message: "An error occurred"
            });
          }

          // Update isActive column to 1 for the newly registered user
          const userId = results.insertId;
          db.query(
            'UPDATE users SET isActive = 1 WHERE id = ?',
            [userId],
            (error) => {
              if (error) {
                console.log(error);
                return res.render('sign-up', {
                  message: "An error occurred"
                });
              }

              console.log(results);
              res.redirect('/sign-in');
            }
          );
        }
      );
    } catch (error) {
      console.log(error);
      res.render('sign-up', {
        message: "An error occurred"
      });
    }
  });
};


exports.login = (req, res) => {
  console.log(req.body); // Logging the request body to the console

  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
    if (error) {
      console.log(error);
      return res.render('sign-in', {
        message: "An error occurred"
      });
    }

    if (results.length === 0) {
      return res.render('sign-in', {
        message: "Invalid email or password"
      });
    }

    try {
      const isPasswordMatch = await bcrypt.compare(password, results[0].password);

      if (!isPasswordMatch) {
        return res.render('sign-in', {
          message: "Invalid email or password"
        });
      }

      if (results[0].isActive !== 1) {
        return res.render('sign-in', {
          message: "Your account is not active"
        });
      }

      // Create a JWT token
      const token = jwt.sign({ id: results[0].id, username: results[0].username, email: results[0].email }, 'your_secret_key');

      // Set the token as a cookie
      res.cookie('token', token, { httpOnly: true });

      // Store the username in the session
      req.session.username = results[0].username;

      // Set session flag to indicate authentication
      req.session.isAuthenticated = true;

      // Sign-in successful
      res.redirect('/');
    } catch (error) {
      console.log(error);
      return res.render('sign-in', {
        message: "An error occurred"
      });
    }
  });
};



exports.logout = (req, res) => {
  // Perform any necessary logout actions, such as clearing session data

  // Destroy the session
  req.session.destroy((error) => {
    if (error) {
      console.log(error);
    }
    // Clear the token cookie
    try {
      res.clearCookie('token');
    } catch (error) {
      console.log(error);
    }

    // Redirect the user to the sign-in page or any other desired page
    res.redirect('/sign-in');
  });
};
