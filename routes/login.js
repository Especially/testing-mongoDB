const express = require('express');
const Router = express.Router();

// Routes
Router.post('/', (req, res) => {
    // const data = req.body.
    // const data = req.body.
    // const data = req.body.
    // const data = req.body.

    res.status(201).json({
        success: true,
    })
    res.status(404).json({
        success: false,
    })
})

module.exports = Router;