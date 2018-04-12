var express = require('express');
var router = express.Router();


var db = require('../queries.js');

router.get('/api/cryptocurrency', db.getAllCurrencies);
router.get('/api/cryptocurrency/:id', db.getSingleCurrency);
router.post('/api/cryptocurrency', db.createCurrency);
router.post('/api/cryptocurrency/:id', db.updateCurrency);
router.delete('/api/cryptocurrency/:id', db.removeCurrency);

//  GET home page. 
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});


module.exports = router;