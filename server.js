// My Playground
// Imports
const express = require('express');
const { database } = require('./lib/utils');
const app = express();

// Routes
const register = require('./routes/register');

app.use('/api/register', register);
app.use('/api/login', register);
//Demo user id: '5ffe3659d8c1e740605b5c19', 
//Next, add user with schema, then this will be ran in our specified route
database.addUser({name: 'Barbara Streisand(sp?)',email:'12345@me.ca',password:'1234',ip:'99.237.255.254'});

app.listen(8080, () => {
    console.log('Server has started on port 8080.')
})