// app.js
const express = require('express');
const session = require('express-session');
const path = require('path');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const routes = require('./routes/route');
const connection = require('./config/database');
const net = require('net');
const app = express();
const port = 3000;

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(flash());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(methodOverride('_method'));
app.use('/', routes);

// Function to find an available port starting from a given number
function findAvailablePort(port, callback) {
  const server = net.createServer();

  server.once('error', () => {
    // Port is in use, try next one
    findAvailablePort(port + 1, callback);
  });

  server.once('listening', () => {
    server.close(() => callback(port));
  });

  server.listen(port);
}

findAvailablePort(port, (freePort) => {
    app.listen(freePort, () => {
        console.log(`Server running on http://localhost:${freePort}`);
    });
});