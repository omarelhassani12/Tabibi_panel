// const http = require('http');
// const fs = require('fs');
// const _ = require('lodash');

// // Create an HTTP server
// const server = http.createServer((req, res) => {
//     // Log the URL and request method
//     console.log('URL:', req.url);
//     console.log('Method:', req.method);

//     // Set the header content type
//     res.setHeader('Content-Type', 'text/html');

//     // Define the file path based on the requested URL
//     let path = './views/';
//     // switch (req.url) {
//     //     case '/':
//     //         path += 'index.html';
//     //         res.statusCode = 200;
//     //         break;
//     //     case '/about':
//     //         path += 'about.html';
//     //         res.statusCode = 200;
//     //         break;
//     //     case '/about-me':
//     //         // Redirect to /about
//     //         res.statusCode = 301;
//     //         res.setHeader('Location', '/about');
//     //         res.end();
//     //         break;
//     //     default:
//     //         // Handle 404 Not Found
//     //         path += '404.html';
//     //         res.statusCode = 404;
//     //         break;
//     // }
// });

