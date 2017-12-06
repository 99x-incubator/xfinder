//var _ = require('underscore');
var jwt = require('jsonwebtoken');
var path = require('path');
//var deepdiff = require('deep-diff');

module.exports = function(router, template, bodyParser) { 
	/**
     * @api {get} /api/v1/users get users
     * @apiName Get All users
     * @apiGroup User
     *
     *
     * @apiSuccess {boolean} state State of the request
     * @apiSuccess {json} users List of Users
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "state": true
     *     }
     *
     * @apiError BadRequest State of the request
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 400 Bad Request
     *     {
     *       "state": false
     *     }
     */

	router.post('/api/v1/template', bodyParser.json(), function getUser(req, res) {
          var username = jwt.verify(req.headers['auth-token'], 'supersecret').username;
          var templateName = req.body.name;
          var options = req.body.options;
          var newTemplateElements = {
               name: templateName,
               options: options,
               username: username
          };

          var newTemplate = new template(newTemplateElements);

          newTemplate.save(function(err, docs) {
		  if(err) {
		  	res.status(400).json({
		  		'state': false
		  	});
		  } else {
               res.status(200).json({
               	'state': true
               });
		  }
		});
	})

     .get('/api/v1/template', bodyParser.json(), function getUser(req, res) {
          //var username = jwt.verify(req.headers['auth-token'], 'supersecret').username;

          template.find({}, 'name', 'options', function(err, docs) {
            var opt = JSON.parse(JSON.stringify(docs))
            
            if(err) {
               res.status(400).json({
                    'state': false
               });
            } else {
               res.status(200).json({
                    'state': true,
                    'names': opt
               });
            }
          });
     })

     .get('/api/v1/templates', bodyParser.json(), function getUser(req, res) {
          //var username = jwt.verify(req.headers['auth-token'], 'supersecret').username;

          template.find({}, 'options', function(err, templates) {
            console.log('viewing templates ...');
            //var opt = JSON.parse(JSON.stringify(docs))
            
            if(err) {
               res.status(400).json({
                    'state': false
               });
            } else {
               res.status(200).json({
                    'state': true,
                    'templates': templates
               });
            }
          });
     });
};