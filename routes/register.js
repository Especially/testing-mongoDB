const express = require('express');
const Router = express.Router();
const { userSchema } = require('../conf/schema/schema');
const { database } = require('../lib/utils');

// Routes
Router.post('/', (req, res) => {
    const { name, email, password, ip } = req.body;

    let newUser = new userSchema({ name, email, password, ip, timestamp: '' }).render();
    if (newUser.success) {
        new database().addUser(newUser.payload)
            .then(result => {
                res.status(201).json(result)
            })
            .catch(err => {
                // Error while adding to database
                res.status(406).json(err)
            });
    } else {
        res.status(404).json(newUser)
    }
})


Router.get('/delete', (req, res) => {
    new database().deleteAll();
});
module.exports = Router;