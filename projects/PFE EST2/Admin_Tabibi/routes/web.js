const express = require('express');
const db = require('../db');
const route = express.Router();



// Sign-up page route
route.get('/sign-up', (req, res) => {
  res.render('sign-up', { title: 'Sign Up' });
});

// Sign-in page route
route.get('/sign-in', (req, res) => {
  res.render('sign-in', { title: 'Sign In' });
});

// forgot-password page route
route.get('/forgot-password', (req, res) => {
  res.render('forgot-password', { title: 'Forgot Password' });
});



// Middleware function to check if user is authenticated
const checkAuth = (req, res, next) => {
  if (req.session.isAuthenticated) {
    // User is authenticated, proceed to the next middleware or route handler
    next();
  } else {
    // User is not authenticated, redirect to sign-in page
    res.redirect('/sign-in');
  }
};





// Home page route
route.get('/', checkAuth, (req, res) => {
  const userCountSql = `
    SELECT 
      (SELECT COUNT(*) FROM users) AS userCount,
      (SELECT COUNT(*) FROM users WHERE role = 'Doctor') AS doctorCount,
      (SELECT COUNT(*) FROM users WHERE role = 'Patient') AS patientCount,
      (SELECT COUNT(*) FROM urgance) AS urganceCount
  `;

  db.query(userCountSql, (err, results) => {
    if (err) {
      throw err;
    }

    const userCount = results[0].userCount;
    const doctorCount = results[0].doctorCount;
    const patientCount = results[0].patientCount;
    const urganceCount = results[0].urganceCount;

    res.render('index', {
      title: 'Home',
      activePage: 'dashboard',
      userCount: userCount,
      doctorCount: doctorCount,
      patientCount: patientCount,
      urganceCount: urganceCount
    });
  });
});

// route.get('/', checkAuth, (req, res) => {
//   const userCountSql = `
//     SELECT 
//       (SELECT COUNT(*) FROM users) AS userCount,
//       (SELECT COUNT(*) FROM users WHERE role = 'Doctor') AS doctorCount,
//       (SELECT COUNT(*) FROM users WHERE role = 'Patient') AS patientCount,
//       (SELECT COUNT(*) FROM urgance) AS urganceCount
//   `;

//   const ageDistributionSql = `
//     SELECT age, COUNT(*) AS userCount FROM users GROUP BY age ORDER BY age
//   `;

//   db.query(userCountSql, (err, userCountResults) => {
//     if (err) {
//       throw err;
//     }

//     const userCount = userCountResults[0].userCount;
//     const doctorCount = userCountResults[0].doctorCount;
//     const patientCount = userCountResults[0].patientCount;
//     const urganceCount = userCountResults[0].urganceCount;

//     db.query(ageDistributionSql, (err, ageDistributionResults) => {
//       if (err) {
//         throw err;
//       }

//       const ageGroups = ageDistributionResults.map((row) => row.age);
//       const userCounts = ageDistributionResults.map((row) => row.userCount);

//       res.render('index', {
//         title: 'Home',
//         activePage: 'dashboard',
//         userCount: userCount,
//         doctorCount: doctorCount,
//         patientCount: patientCount,
//         urganceCount: urganceCount,
//         ageGroups: JSON.stringify(ageGroups),
//         userCounts: JSON.stringify(userCounts)
//       });
//     });
//   });
// });




// ///////////////////////////////USERS ROUTES //////////////////////////////

////users routes
route.get('/users', checkAuth,(req, res) => {

 res.render('users/index', { title: 'users' , activePage: 'users' });
});

////doctors routes
route.get('/doctors',checkAuth,(req, res) => {
  res.render('doctors/index', { title: 'doctors' , activePage: 'doctors' });
});
////patients routes
route.get('/patients',checkAuth,(req, res) => {
  res.render('patients/index', { title: 'patients' , activePage: 'patients' });
});
////assistant routes
route.get('/assistant',checkAuth,(req, res) => {
 res.render('assistant/index', { title: 'assistant' , activePage: 'assistant' });
});

// ///////////////////////////////URGENCY ROUTES //////////////////////////////

// urgances route
route.get('/urgances', checkAuth, (req, res) => {

  res.render('urgances/index', { title: 'Urgances', activePage: 'urgances' });
});

// sub-urgances route
route.get('/sub-urgances', checkAuth, (req, res) => {

  res.render('sub-urgances/index', { title: 'Sub-Urgances', activePage: 'sub-urgances' });
});


// response-sub-urgance route
route.get('/response-sub-urgance', checkAuth, (req, res) => {
  res.render('response-sub-urgance/index', { title: 'Response Sub-Urgance', activePage: 'response-sub-urgance' });
});

// ///////////////////////////////404 ROUTES //////////////////////////////



// // 404 page route (place it at the end of all other routes)
// route.use((req, res) => {
//   res.status(404).render('404', { title: 'Page Not Found' });
// });




// Route to render the addUrgance.ejs template
route.get('/addUrgance', (req, res) => {
  res.render('urgances/addUrgance',{ title: 'Add Urgance', activePage: 'urgances' }); 
});
route.get('/update-urgance', (req, res) => {
  res.render('urgances/update-urgance',{ title: 'Update Urgance', activePage: 'urgances' }); 
});
route.get('/addSubUrgance', (req, res) => {
  res.render('sub-urgances/addSubUrgance',{ title: 'add Sub Urgancee', activePage: 'sub-urgances' }); 
});
route.get('/update-sub-urgance', (req, res) => {
  res.render('sub-urgances/update-sub-urgance',{ title: 'Update Sub Urgancee', activePage: 'sub-urgances' }); 
});
route.get('/addResponse', (req, res) => {
  res.render('response-sub-urgance/addResponse',{ title: 'add Response', activePage: 'response-sub-urgance' }); 
});
route.get('/update-response', (req, res) => {
  res.render('response-sub-urgance/update-response',{ title: 'Update Response', activePage: 'response-sub-urgance' }); 
});
route.get('/details-response/:id', (req, res) => {
  res.render('response-sub-urgance/details-response',{ title: 'Details Response', activePage: 'response-sub-urgance' }); 
});



module.exports = route;