//Account ROUTE HANDLING
var express = require('express');
var router = express.Router();
const crypto = require('crypto');
var scrypt = require("scrypt");
var scryptParameters = scrypt.paramsSync(0.1);

import Session from '../models/session';

const stripe = require('stripe')('sk_test_BGgMWa7hrM5O3rlQT0iqr4FZ');

router.post('/', (req, res) => {

    return stripe.charges
        .create({
            amount: req.body.amount, // Unit: cents
            currency: req.body.currency,
            source: req.body.source,
            description: req.body.description,
        })
        .then(result => {
            
            console.log(res)
            res.status("200").json(result)
            
        })
        .catch(error => {
            console.log("ERROR:")
            console.log(error.statusCode)
            console.log(error);
            res.status(error.statusCode).json(error)
            
        });
});
module.exports = router