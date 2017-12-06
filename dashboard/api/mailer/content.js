module.exports = function(username, email) {
	return {
		to: 'vidurap@99x.lk',
		from: 'Xfinder99x@gmail.com',
		text: 'Finder record change ✔',
		html: '<b>Finder record of '+ email +' has been changed by '+ username +'</b>'
	};
}