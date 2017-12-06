var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  SAMAccountName: String,
  FirstName: String,
  LastName: String,
  Email: String,
  LastLogon: Date,
  Group: String,
}, {
	strict: false
});

module.exports = userSchema;