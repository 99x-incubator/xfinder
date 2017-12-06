var mongoose = require('mongoose');

var config = {
  mongo: mongoose.connect('mongodb://localhost:27017/adfinder')
};

module.exports = config;
