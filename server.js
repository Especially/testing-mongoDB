// My Playground
// Note: This application is simply me playing around with mongodb, so if someone is reading this... don't judge me too hard pls
// Imports
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// MW
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}))

// Routes
const register = require('./routes/register');
const login = require('./routes/login');

app.use('/api/register', register);
app.use('/api/login', login);

app.listen(8080, () => {
    console.log('Server has started on port 8080.')
})