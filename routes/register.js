const express = require('express');
const Router = express.Router();
const { userSchema } = require('../conf/schema/schema');
const { database } = require('../lib/utils');

// Routes
Router.post('/', (req, res) => {
    //Demo user id: '5ffe3659d8c1e740605b5c19', 
    //Next, add user with schema, then this will be ran in our specified route
    const { name, email, password, ip } = req.body;

    let newUser = new userSchema({ name, email, password, ip, timestamp: '' }).render();
    if (newUser.success) {
        database.addUser(newUser.payload)
            .then(result => {
                res.status(201).json(result)
            })
            .catch(err => {
                // Error while adding to database
                res.status(404).json(err)
            });
    } else {
        res.status(404).json(newUser)
    }
})

module.exports = Router;