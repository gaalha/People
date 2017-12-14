var express = require('express');
var router = express.Router();

//HOMEPAGE
router.get('/', function(req, res, next){
	res.render('index', {title: 'Express'});
});
//PERSON GRID
router.get('/people', function(req, res, next){
	res.render('personGrid');
});

module.exports = router;