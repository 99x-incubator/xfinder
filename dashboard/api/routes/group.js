module.exports = function(router, user) {
	router.get('/api/v1/users', function getUser(req, res) {
		user.find(function(err, users) {
		  res.json({
		  	'users': users
		  });
		});
	});
};