var creds = require('../config/adcreds');
var jwt = require('jsonwebtoken');

module.exports = function(router, ad, bodyParser) {
	router.post('/api/v1/authenticate',bodyParser.json() ,function getUser(req, res) {
		console.log('got it');
		console.log(req.body);
		ad.authenticate(req.body.username, req.body.password, function(err, auth) {
		  if (err) {
		    res.status(200).json({
		    	'state': false
		    });
		  }
		  else if (auth) {
		  	var token = jwt.sign({ username: req.body.username }, 'supersecret');
		    res.status(200).json({
		    	'state': true,
		    	'access_token': token
		    })
		  }
		});
	});
};