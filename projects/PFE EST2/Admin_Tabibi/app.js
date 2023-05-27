require('dotenv').config();
const express = require('express');
const route = require('./routes/web');
const routerAuth = require('./routes/authRoute');
const session = require('express-session');
const routerUser = require('./controllers/users');
const cookieParser = require('cookie-parser');
const db = require('./db');
const app = express();
// for image uploads
const cloudinary = require('cloudinary').v2;
const upload = require('./multer');




cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})
///////////////


//upload urgance
app.post('/upload-urgance', upload.single('image'), (req, res) => {
  const imageFile = req.file;
  const { originalname, mimetype, buffer } = imageFile;

  cloudinary.uploader.upload_stream((error, result) => {
    if (error) {
      throw error;
    }

    const { public_id, secure_url } = result;

    const data = {
      name: req.body['urgance-name'],
      image: secure_url
    };

    const sql = "INSERT INTO urgance SET ?";

    db.query(sql, data, (err, result) => {
      if (err) {
        throw err;
      }

      // Redirect to the urgency index page with a success parameter
      res.redirect('/urgances?success=true');
    });
  }).end(buffer);
});
//get urgance
app.get('/urgances', (req, res) => {
  const sql = 'SELECT * FROM urgance';
  db.query(sql, (err, results) => {
    if (err) {
      throw err;
    }

    const urgances = results; // Assuming the retrieved data is an array of objects
    console.log(urgances);
    res.render('urgances/index', { urgances, activePage: 'urgances' }); // Set activePage to 'urgances'

  });
});
//deleete urgance
app.get('/delete-urgance/:id', (req, res) => {
  const urganceId = req.params.id;

  const sql = 'DELETE FROM urgance WHERE id = ?';

  db.query(sql, [urganceId], (err, result) => {
    if (err) {
      throw err;
    }

    // Redirect to the urgency index page with a success parameter
    res.redirect('/urgances?success=true');
  });
});
//get id name of urgance for add sub urgance
app.get('/addSubUrgance', (req, res) => {
  const sql = 'SELECT id, name FROM urgance';
  db.query(sql, (err, results) => {
    if (err) {
      throw err;
    }

    const urgances = results; // Assuming the retrieved data is an array of objects
    console.log(urgances);
    res.render('sub-urgances/addSubUrgance', { urgances: urgances, title: 'Add Sub Urgance', activePage: 'sub-urgances' });
  });
});
//get the update urgances
app.get('/update-urgance/:id', (req, res) => {
  const urganceId = req.params.id;
  const sql = 'SELECT * FROM urgance WHERE id = ?';

  db.query(sql, [urganceId], (err, results) => {
    if (err) {
      throw err;
    }

    if (results.length === 0) {
      // Handle case when urgance is not found
      return res.status(404).send('Urgance not found');
    }

    const urganceID = results[0];
    console.log(urganceID);
    res.render('urgances/update-urgance', { title: 'Update Urgance', activePage: 'urgances', urganceID });
  });
});
//update the urgance with the id above
app.post('/updateUrgance/:id', upload.single('image'), (req, res) => {
  const imageFile = req.file;
  const { originalname, mimetype, buffer } = imageFile;
  const urganceId = req.params.id;
  const urganceName = req.body['urgance-name'];

  cloudinary.uploader.upload_stream((error, result) => {
    if (error) {
      throw error;
    }

    const { secure_url } = result;

    const data = {
      name: urganceName,
      image: secure_url
    };

    const sql = "UPDATE urgance SET ? WHERE id = ?";

    db.query(sql, [data, urganceId], (err, result) => {
      if (err) {
        throw err;
      }

      // Redirect to the urgency index page with a success parameter
      res.redirect('/urgances?success=true');
    });
  }).end(buffer);
});
//get the update sub urgances
app.get('/update-sub-urgance/:id', (req, res) => {
  const urganceId = req.params.id;
  const sql = 'SELECT * FROM suburgance WHERE id = ?';

  db.query(sql, [urganceId], (err, results) => {
    if (err) {
      throw err;
    }

    if (results.length === 0) {
      // Handle case when urgance is not found
      return res.status(404).send('Urgance not found');
    }

    const urganceID = results[0];
    console.log(urganceID);
    res.render('sub-urgances/update-sub-urgance', { title: 'Update Sub Urgance', activePage: 'sub urgances', urganceID });
  });
});
//update the sub-urgance with the id above
app.post('/updateSubUrgance/:id', upload.single('image'), (req, res) => {
  const imageFile = req.file;
  const { originalname, mimetype, buffer } = imageFile;
  const urganceId = req.params.id;
  const urganceName = req.body['sub-urgance-name'];

  cloudinary.uploader.upload_stream({ resource_type: "auto" }, (error, result) => {
    if (error) {
      throw error;
    }

    const { secure_url } = result;

    const data = {
      name: urganceName,
      image: secure_url
    };

    const sql = "UPDATE suburgance SET ? WHERE id = ?";

    db.query(sql, [data, urganceId], (err, result) => {
      if (err) {
        throw err;
      }

      // Redirect to the urgency index page with a success parameter
      res.redirect('/sub-urgances?success=true');
    });
  }).end(buffer);
});
//get id name of urgance for add sub urgance
app.get('/addResponse', (req, res) => {
  const sql = 'SELECT id, name FROM suburgance';
  db.query(sql, (err, results) => {
    if (err) {
      throw err;
    }

    const sub_urgances = results; // Assuming the retrieved data is an array of objects
    console.log(sub_urgances);
    res.render('response-sub-urgance/addResponse', { sub_urgances: sub_urgances, title: 'Add Rresponse Sub Urgance', activePage: 'response-sub-urgances' });
  });
});
//upload sub-urgance
app.post('/upload-sub-urgance', upload.single('image'), (req, res) => {
  const imageFile = req.file;
  const { originalname, mimetype, buffer } = imageFile;

  cloudinary.uploader.upload_stream((error, result) => {
    if (error) {
      throw error;
    }

    const { public_id, secure_url } = result;

    const data = {
      name: req.body['sub-urgance-name'],
      image: secure_url,
      urgance_id: req.body.category,
      created_at: new Date()
    };

    const sql = "INSERT INTO suburgance (name, image, urgance_id, created_at) VALUES (?, ?, ?, ?)";
    const values = [data.name, data.image, data.urgance_id, data.created_at];

    db.query(sql, values, (err, result) => {
      if (err) {
        throw err;
      }

      // Redirect to the sub-urgance index page with a success parameter
      res.redirect('/sub-urgances?success=true');
    });
  }).end(buffer);
});
//get sub-urgance
app.get('/sub-urgances', (req, res) => {
  const sql = 'SELECT su.*, u.name AS urgency_name FROM suburgance su JOIN urgance u ON su.urgance_id = u.id';
  db.query(sql, (err, results) => {
    if (err) {
      throw err;
    }

    const subUrgances = results;
    console.log(subUrgances);
    res.render('sub-urgances/index', { subUrgances, title: 'Sub Urgance', activePage: 'sub-urgances' });
  });
});
//delete sub-urgances
app.get('/delete-suburgance/:id', (req, res) => {
  const suburganceId = req.params.id;

  const sql = 'DELETE FROM suburgance WHERE id = ?';

  db.query(sql, [suburganceId], (err, result) => {
    if (err) {
      throw err;
    }

    // Redirect to the sub-urgance index page with a success parameter
    res.redirect('/sub-urgances?success=true');
  });
});
//upload response
// app.post('/response-upload', upload.fields([{ name: 'images' }, { name: 'image_title' }]), (req, res) => {
//   const imageFiles = req.files['images'];
//   const imageTitleFiles = req.files['image_title'];
//   const responseData = {
//     title: req.body['response-title'],
//     description: req.body['description'],
//     sub_urgance_id: req.body['category'] // Assuming the select element has name="category"
//   };

//   // Insert response data into the 'response' table
//   const sql = "INSERT INTO response (title, description, image_title, desc_image, suburganceid, created_at) VALUES (?, ?, ?, ?, ?, NOW())";
//   db.query(sql, [responseData.title, responseData.description, null, '', responseData.sub_urgance_id], (err, result) => {
//     if (err) {
//       throw err;
//     }

//     const responseId = result.insertId;
//     let processedImages = 0;

//     // Iterate over each uploaded image
//     for (let i = 0; i < imageFiles.length; i++) {
//       const imageFile = imageFiles[i];
//       const imageTitleFile = imageTitleFiles[i];
//       const { originalname, mimetype, buffer } = imageFile;
//       const imageTitle = imageTitleFile ? imageTitleFile.filename : null;

//       // Upload image to Cloudinary
//       cloudinary.uploader.upload_stream((error, result) => {
//         if (error) {
//           throw error;
//         }

//         const { public_id, secure_url } = result;

//         // Update the 'response' table with the image URL and image title
//         const updateSql = "UPDATE response SET desc_image = ?, image_title = ? WHERE id = ?";
//         db.query(updateSql, [secure_url, imageTitle || secure_url, responseId], (err, result) => {
//           if (err) {
//             throw err;
//           }

//           processedImages++;

//           // Check if all images have been processed
//           if (processedImages === imageFiles.length) {
//             // Redirect to the urgency index page with a success parameter
//             res.redirect('/response-sub-urgance?success=true');
//           }
//         });
//       }).end(buffer);
//     }
//   });
// });
app.post('/response-upload', upload.fields([{ name: 'images' }, { name: 'image_title' }]), (req, res) => {
  const imageFiles = req.files['images'];
  const imageTitleFiles = req.files['image_title'];
  const responseData = {
    title: req.body['response-title'],
    description: req.body['description'],
    sub_urgance_id: req.body['category'] // Assuming the select element has name="category"
  };

  // Insert response data into the 'response' table
  const sql = "INSERT INTO response (title, description, image_title, desc_image, suburganceid, created_at) VALUES (?, ?, ?, ?, ?, NOW())";
  db.query(sql, [responseData.title, responseData.description, null, '', responseData.sub_urgance_id], (err, result) => {
    if (err) {
      throw err;
    }

    const responseId = result.insertId;
    let processedImages = 0;

    // Iterate over each uploaded image if imageFiles is not null or undefined
    if (imageFiles && imageFiles.length) {
      // Iterate over each uploaded image
      for (let i = 0; i < imageFiles.length; i++) {
        const imageFile = imageFiles[i];
        const imageTitleFile = imageTitleFiles[i];
        const { originalname, mimetype, buffer } = imageFile;
        const imageTitle = imageTitleFile ? imageTitleFile.filename : null;

        // Upload image to Cloudinary
        cloudinary.uploader.upload_stream((error, result) => {
          if (error) {
            throw error;
          }

          const { public_id, secure_url } = result;

          // Update the 'response' table with the image URL and image title
          const updateSql = "UPDATE response SET desc_image = ?, image_title = ? WHERE id = ?";
          db.query(updateSql, [secure_url, imageTitle || secure_url, responseId], (err, result) => {
            if (err) {
              throw err;
            }

            processedImages++;

            // Check if all images have been processed
            if (processedImages === imageFiles.length) {
              // Redirect to the urgency index page with a success parameter
              res.redirect('/response-sub-urgance?success=true');
            }
          });
        }).end(buffer);
      }
    } else {
      // Handle the case when there are no uploaded images
      // You can choose to throw an error, show a message, or take any other necessary action
    }
  });
});

//get sub urgances to add it to response
app.get('/response-sub-urgance', (req, res) => {
  const sql = 'SELECT * FROM response';
  db.query(sql, (err, results) => {
    if (err) {
      throw err;
    }

    const responseSubUrgance = results; // Assuming the retrieved data is an array of objects
    res.render('response-sub-urgance/index', { responseSubUrgance, activePage: 'response-sub-urgance' });
  });
});
//delete response
app.get('/response-delete/:id', (req, res) => {
  const responseId = req.params.id;

  // Delete the response from the response table
  const deleteResponseSql = 'DELETE FROM response WHERE id = ?';
  db.query(deleteResponseSql, [responseId], (err, result) => {
    if (err) {
      throw err;
    }

    // Redirect to the response index page with a success parameter
    res.redirect('/response-sub-urgance?success=true');
  });
});
//fetch the data of the response want to update it
app.get('/update-response/:id', (req, res) => {
  const responseId = req.params.id;
  const responseSql = 'SELECT * FROM response WHERE id = ?';

  db.query(responseSql, [responseId], (err, responseResults) => {
    if (err) {
      throw err;
    }

    if (responseResults.length === 0) {
      return res.status(404).send('Response not found');
    }

    const response = responseResults[0];
    console.log(response);
    res.render('response-sub-urgance/update-response', {
      title: 'Update Sub Urgance',
      activePage: 'sub urgances',
      response,
    });
  });
});
//update the response
app.post('/update-response-data/:id', upload.fields([{ name: 'images' }, { name: 'image_title' }]), (req, res) => {
  const responseId = req.params.id;
  const imageFiles = req.files['images'];
  const imageTitleFiles = req.files['image_title'];
  const responseData = {
    title: req.body['sub-urgance-name'],
    description: req.body['description'],
    sub_urgance_id: req.body['category'] // Assuming the select element has name="category"
  };

  // Update response data in the 'response' table
  const sql = "UPDATE response SET title = ?, description = ?, suburganceid = ? WHERE id = ?";
  db.query(sql, [responseData.title, responseData.description, responseData.sub_urgance_id, responseId], (err, result) => {
    if (err) {
      throw err;
    }

    let processedImages = 0;

    // Check if new title image is uploaded
    if (imageTitleFiles && imageTitleFiles.length > 0 && imageTitleFiles[0]) {
      const imageTitleFile = imageTitleFiles[0];
      const { originalname, mimetype, buffer } = imageTitleFile;

      // Upload new title image to Cloudinary
      cloudinary.uploader.upload_stream((error, result) => {
        if (error) {
          throw error;
        }

        const { secure_url } = result;

        // Update the 'response' table with the new title image URL
        const updateTitleSql = "UPDATE response SET image_title = ? WHERE id = ?";
        db.query(updateTitleSql, [secure_url, responseId], (err, result) => {
          if (err) {
            throw err;
          }

          processedImages++;

          // Check if all images have been processed
          if (processedImages === (imageFiles ? imageFiles.length : 0)) {
            // Redirect to the urgency index page with a success parameter
            res.redirect('/response-sub-urgance?success=true');
          }
        });
      }).end(buffer);
    }

    // Check if new response image is uploaded
    if (imageFiles && imageFiles.length > 0) {
      // Iterate over each uploaded image
      for (let i = 0; i < imageFiles.length; i++) {
        const imageFile = imageFiles[i];
        const { originalname, mimetype, buffer } = imageFile;

        // Upload image to Cloudinary
        cloudinary.uploader.upload_stream((error, result) => {
          if (error) {
            throw error;
          }

          const { public_id, secure_url } = result;

          // Update the 'response' table with the new response image URL
          const updateResponseSql = "UPDATE response SET desc_image = ? WHERE id = ?";
          db.query(updateResponseSql, [secure_url, responseId], (err, result) => {
            if (err) {
              throw err;
            }

            processedImages++;

            // Check if all images have been processed
            if (processedImages === imageFiles.length) {
              // Redirect to the urgency index page with a success parameter
              res.redirect('/response-sub-urgance?success=true');
            }
          });
        }).end(buffer);
      }
    } else {
      // Redirect to the urgency index page with a success parameter
      res.redirect('/response-sub-urgance?success=true');
    }
  });
});
// Get the details of the response
app.get('/details-response/:id', (req, res) => {
  const responseId = req.params.id;
  const sql = `
    SELECT r.*, su.*, u.name AS urgency_name
    FROM response r
    JOIN suburgance su ON r.suburganceid = su.id
    JOIN urgance u ON su.urgance_id = u.id
    WHERE r.id = ?
  `;
  db.query(sql, responseId, (err, results) => {
    if (err) {
      throw err;
    }

    const response = results[0];
    if (!response) {
      // Handle case when response is not found
      return res.status(404).send('Response not found');
    }

    console.log(response);
    res.render('response-sub-urgance/details-response', { response, title: 'Response Details', activePage: 'responses' });
  });
});
// Get users with Doctor role
app.get('/doctors', (req, res) => {
  const sql = 'SELECT * FROM users WHERE role = "Doctor"';
  db.query(sql, (err, results) => {
    if (err) {
      throw err;
    }

    const doctors = results; // Assuming the retrieved data is an array of objects
    // console.log(doctors);
    res.render('doctors/index', { doctors, activePage: 'doctors' }); // Set activePage to 'doctors'

  });
});
// Delete doctor by ID
app.get('/delete-doctor/:id', (req, res) => {
  const userId = req.params.id;
  const sql = 'DELETE FROM users WHERE id = ?';
  db.query(sql, userId, (err, result) => {
    if (err) {
      throw err;
    }

    res.redirect('/doctors'); // Redirect to the doctors page after successful deletion
  });
});
// Get the doctors users
// Get users with Doctor role
app.get('/patients', (req, res) => {
  const sql = 'SELECT * FROM users WHERE role = "Patient"';
  db.query(sql, (err, results) => {
    if (err) {
      throw err;
    }

    const patients = results; // Assuming the retrieved data is an array of objects
    console.log(patients);
    res.render('patients/index', { patients, activePage: 'patients' }); // Set activePage to 'doctors'

  });
});
// Delete doctor by ID
app.get('/delete-patient/:id', (req, res) => {
  const userId = req.params.id;
  const sql = 'DELETE FROM users WHERE id = ?';
  db.query(sql, userId, (err, result) => {
    if (err) {
      throw err;
    }

    res.redirect('/patients'); // Redirect to the patients page after successful deletion
  });
});
// Get the number of users
app.get('/api/age-distribution', (req, res) => {
  const ageDistributionSql = 'SELECT age, COUNT(*) AS userCount FROM users GROUP BY age ORDER BY age';
  db.query(ageDistributionSql, (err, results) => {
    if (err) {
      // Handle error
      console.error(err);
      res.status(500).json({ error: 'An error occurred' });
    } else {
      // Process the results and send the response
      const ageGroups = results.map((row) => row.age);
      const userCounts = results.map((row) => row.userCount);
      res.json({ ageGroups, userCounts });
    }
  });
});







////////

app.use(cookieParser());
app.use(session({
  secret: "Key that will sign cookies",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    secure: false, // Set to true if using HTTPS
    httpOnly: true
  }
}));


//parse url encoded bodies (as sent by html forms)
app.use(express.urlencoded({ extended:false}));
//parse json bodies (as sent by html forms)
app.use(express.json());


// Set the view engine to EJS
app.set('view engine', 'ejs');

// Start the server and listen on port 3000
// app.listen(3000, () => {
//   console.log('Server is listening on port 3000');
// });
app.listen(3000, '192.168.1.26', () => {
  console.log('Listening for requests on link http://192.168.1.26:3000');
});

//middleware & static files
app.use(express.static('public'));

//route
app.use(route);
app.use('/auth',routerAuth);

app.use(routerUser);

