var jwt = require('jsonwebtoken');
var fs = require('fs');
var path = require('path');

module.exports = function(router, optionsSchema, option, bodyParser, user) {
	
	/**
     * @api {get} /api/v1/fields get list of fields in the schema
     * @apiName Get fields
     * @apiGroup Fields
     *
     *
     * @apiSuccess {boolean} state State of the request
     * @apiSuccess {json} users List of Users
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "state": true
     *       "fields": json
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

	router.get('/api/v1/fields', function(req, res) {
		var fields = [];
		for(var prop in optionsSchema.paths) {
			fields.push(prop);
		}
		if(fields.length != 0) {
			res.json({
				'state': true,
				'fields': fields
			});			
		} else {
			res.json({
				'state': false
			});
		}
	})

	/**
     * @api {post} /api/v1/fields add fields for a user
     * @apiName Add fields
     * @apiGroup Fields
     *
     * @apiParam {json} data  each field data in json format
     *
     * @apiSuccess {boolean} state State of the request
     * @apiSuccess {json} user details
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

	.post('/api/v1/fields', bodyParser.json(), function(req, res) {
		var newFields = req.body;
          var newFieldsObj = {};
//          newFieldsObj['userId'] = req.body._id;
//          newFieldsObj['type'] = req.body.type;
          if(req.body.type === 'template') {
               newFieldsObj[req.body.field] = {
                    value: req.body.value,
                    type: req.body.type,
                    selected: 0
               };               
          } else {
               newFieldsObj[req.body.field] = {
                    value: req.body.value,
                    type: req.body.type
               };
          }


          console.log(newFieldsObj);

          option.update({userId : req.body._id}, newFieldsObj, {upsert: true, setDefaultsOnInsert: true}, function(err, docs) {
               if(err) {
                    res.status(400).json({
                         'state': false
                    });
               } else if(docs) {
                    console.log(docs);
                    res.status(200).json({
                         'state': true
                    });
               }
          });
	})

     .post('/api/v1/settings/field', bodyParser.json(), function(req, res) {
          var username = jwt.verify(req.headers['auth-token'], 'supersecret').username;

          var newFields = req.body;
          var newFieldsObj = {};

          if(req.body.type === 'template') {
               newFieldsObj[req.body.field] = {
                    value: req.body.value,
                    type: req.body.type,
                    common: true,
                    selected: 0
               };               
          } else {
               newFieldsObj[req.body.field] = {
                    value: req.body.value,
                    type: req.body.type,
                    common: true
               };
          }

          console.log('.........');

          console.log(newFieldsObj);

          user.update({}, newFieldsObj, {upsert: true, setDefaultsOnInsert: true, multi: true}, function(err, docs) {
               if(err) {
                    res.status(400).json({
                         'state': false
                    });
               } else if(docs) {
                    console.log(docs);
                    res.status(200).json({
                         'state': true
                    });
               }
          });
     })


     .get('/api/v1/mailstatus', function(req, res) {
          var mailFile = JSON.parse(fs.readFileSync(path.join(__dirname + '/mailStatus.json')));
          res.status(200).json({
               'state': true,
               'mail': mailFile.status
          });
     })

     .post('/api/v1/settings/mail', bodyParser.json(),function(req, res) {
          var mailFile = JSON.parse(fs.readFileSync(path.join(__dirname + '/mailStatus.json')));
          mailFile.status  = req.body.mailStatus;
          fs.writeFileSync(path.join(__dirname + '/mailStatus.json'), JSON.stringify(mailFile,null, 2));
          res.status(200).json({
               'state': true
          });
     });
};