const express = require('express');
const Router = express.Router();
const { database } = require('../lib/utils');

// Routes
Router.post('/', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (email && password) { // Do thorough check of vars in our function
        new database().logIn({email, password})
        .then(result => {
            res.status(201).json(result)
        })
        .catch(err => {
            res.status(401).json(err)
        })
    } else {
        res.status(404).json({
            success: false,
            msg: "Missing params."
        })
    }

})

module.exports = Router;