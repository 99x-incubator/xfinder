var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport('smtps://finder99x@gmail.com:intel@123@smtp.gmail.com');

module.exports = function(from, to, text, html) {
	var mailOptions = {
	    from: from, // sender address 
	    to: to, // list of receivers 
	    subject: 'Finder record change ✔', // Subject line 
	    text: text, // plaintext body 
	    html: html // html body 
	};

	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        return console.log(error);
	    }
	    console.log('Message sent: ' + info.response);
	});
};