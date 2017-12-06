'use strict';

var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var mongoose = require('mongoose');
var mongooseHistory = require('mongoose-history');
var server = require('http').Server(app);
var bodyParser = require('body-parser');

var mongoConfig = require('./api/config/mongo').mongo;
var adCreds = require('./api/config/adcreds');

//require userSchema
var userSchema = require('./api/userSchema');
var userHistorySchema = require('./api/userHistory');
//require optionSchema
var optionSchema = require('./api/optionSchema');
var templateSchema = require('./api/templateSchema');


//add mongoose history plugin to save the history
//seperate collection will be created for the collection to save the history
var options = {customCollectionName: "User_history"}
userSchema.plugin(mongooseHistory, options);
optionSchema.plugin(mongooseHistory);

//create user model
var user = mongoose.model('User', userSchema);
var userHistory = mongoose.model('User_history', userHistorySchema);
var option = mongoose.model('Field', optionSchema);
var template = mongoose.model('Template', templateSchema);

var AD = require('activedirectory');
var config = require('./api/config/ad');

var ad = new AD(config);

var router = express.Router();

app.use(router);

var authRoutes = require('./api/routes/authenticate');
var userRoutes = require('./api/routes/user');
var optionRoutes = require('./api/routes/field');
var templateRoutes = require('./api/routes/template');
authRoutes(router, ad, bodyParser);
userRoutes(router, user, userHistory, option, bodyParser, template);
optionRoutes(router, optionSchema, option, bodyParser, user);
templateRoutes(router, template, bodyParser);

app.use(express.static(__dirname + '/client'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/fonts', express.static(__dirname + '/fonts'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

server.listen(port, function() {
  console.log('Server running on port %s', port);
});