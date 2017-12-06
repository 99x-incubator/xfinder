//var _ = require('underscore');
var jwt = require('jsonwebtoken');
var mailer = require('../mailer/mail');
var mailContent = require('../mailer/content');
var fs = require('fs');
var path = require('path');
//var deepdiff = require('deep-diff');

module.exports = function(router, user, userHistory, field, bodyParser, template) {
	 
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

	router.get('/api/v1/users', function getUsers(req, res) {
		user.find(function(err, users) {
		  if(err) {
		  	res.status(400).json({
		  		'state': false
		  	});
		  } else {
               var usersStore = [];
               var userData = {};
               var templateCache = null;
               console.log('retruv ');
               template.find('options', function(err, templates) {
                    //console.log(template.toObject().options[k.selected]);
                    templateCache = templates;
               
                    for(var key in users) {
                         var userObj = users[key].toObject();
                         var firstName = null;
                         var lastName = null;
                         for(var keyVal in userObj) {
                              if(typeof userObj[keyVal] == 'object' && keyVal !== '_id') {
                                   if(userObj[keyVal] != null) {
                                        var k = userObj[keyVal];
                                        if(k.type === 'template') {
                                             for(var temp in templateCache) {
                                                  if(templateCache[temp]['_id'] == k.value) {
                                                       // console.log(templateCache[temp].toObject().options);
                                                      userObj[keyVal] = templateCache[temp].toObject().options[k.selected];
                                                  }
                                             }     
                                             //console.log(template.toObject().options[k.selected]);
                                             
                                        } else if(k.type === 'text') {
                                             userObj[keyVal] = k.value;
                                        } else {
                                             userObj[keyVal] = 1;
                                        }
                                   }
                              }
                              if(keyVal === 'FirstName') {
                                   firstName = userObj[keyVal];
                              }
                              if(keyVal === 'LastName') {
                                   lastName = userObj[keyVal];
                              }
                         }
                         userObj['Fullname'] = firstName + ' ' + lastName;
                         usersStore.push(userObj);
                    }
                    res.status(200).json({
                         'state': true,
                         'users': usersStore
                    });
               });

		  }
		});
	})

     .get('/api/v1/users/common', function getCommonFields(req, res) {
          user.find(function(err, users) {
            if(err) {
               res.status(400).json({
                    'state': false
               });
            } else {
                 var singleUser = users[0].toObject();
                 var userCommonFields = [];
                 userCommonFields.push({
                    "data": 'Fullname',
                    "title": 'Fullname',
                    "visible": true
                 });
                 for(var key in singleUser) {
                    //console.log(key);
                    if(key !== '_id') {
                         if(key === 'SAMAccountName' || key === 'LastLogon' || key === 'FirstName' || key === 'LastName' || key === 'Group') {
                              userCommonFields.push({
                                   "data": key,
                                   "title": key,
                                   "visible": false
                              });
                         } else {
                              userCommonFields.push({
                                   "data": key,
                                   "title": key
                              });
                         }
                    }
                 }
                 res.status(200).json(userCommonFields);
               }
          });
     })

	/**
     * @api {get} /api/v1/users get user
     * @apiName Get All users
     * @apiGroup User
     *
     * @apiParam {String} email  email of the querying user
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

	.get('/api/v1/user', bodyParser.json(), function(req, res) {
		var _id = req.query._id;
		user.find({ _id: _id }, { LastLogon: 0 } , function(err, user) {
			if(err) {
				res.status(400).json({
					'state': false
				});
			} else if(user){
                    field.find({ userId: _id }, { _id:0, userId: 0 }, function(err, fields) {
                         if(err) {
                              res.status(400).json({
                                   'state': false
                              });
                         } else if(fields) {
                              res.status(200).json({
                                   'state': true,
                                   'user': user,
                                   'fields': fields
                              });
                         }
                    });
                    // field.find({ userId: _id }, { _id: 0, userId: 0 } , function(err, fields) {
                    //      if(err) {
                    //           res.status(400).json({
                    //                'state': false
                    //           });
                    //      } else if(fields) {
                    //           console.log(fields);
                    //           res.status(200).json({
                    //                'state': true,
                    //                'user': user,
                    //                'fields': fields
                    //           });
                    //      }
                    // });
			}
		});
	})

	/**
     * @api {put} /api/v1/user update user fields
     * @apiName Update fields
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

	.put('/api/v1/user', bodyParser.json(), function(req, res) {
          var username = jwt.verify(req.headers['auth-token'], 'supersecret').username;
		var obj = req.body.userData;
          var specCommonObj = req.body.specCommonData;
          var specObj = req.body.specData;

		var mongoData = {};
          var specData = {};
          var specCommonData = {};
          var createdKey = null;
          var specStringData = {};

		Object.keys(obj).forEach(function(key) {
			mongoData[key] = obj[key];
		});

          Object.keys(specCommonObj).forEach(function(key) {
               if(typeof specCommonObj[key] == 'string') {
                    createdKey = key + '.value';
                    specCommonData[createdKey] = specCommonObj[key];
               } else {
                    createdKey = key + '.selected';
                    specCommonData[createdKey] = specCommonObj[key];                    
               }
          });


          Object.keys(specObj).forEach(function(key) {
               if(typeof specObj[key] == 'string') {
                    createdKey = key + '.value';
                    specData[createdKey] = specObj[key];
               } else {
                    createdKey = key + '.selected';
                    specData[createdKey] = specObj[key];                    
               }
          });


          // console.log('<><><>');
          // console.log('.....');
          // console.log(mongoData);
          // console.log('.....');
          // console.log(specCommonData);
          // console.log('.....');
          // console.log(specData);
          // console.log('.....');

          Object.assign(mongoData, specCommonData);

          user.findOne({_id: obj._id}, function(err, doc) {
               if(err) throw new Error('error');
               

               field.findOne({userId: obj._id}, function(err, customDoc) {
                    user.findOneAndUpdate({_id : obj._id}, mongoData, function(err, docs) {
                         if(err) {
                              res.status(400).json({
                                   'state': false
                              });
                         } else if(docs) {
                              field.update({userId : obj._id}, {$set: specData }, function(err, docs) {
                                   if(err) {
                                        res.status(400).json({
                                             'state': false
                                        });
                                   } else if(docs) {
                                        var historyRecord = new userHistory({
                                             userId: obj._id,
                                             fields: {
                                                  userData: mongoData,
                                                  specData: specData
                                             },
                                             loggedin: username,
                                             time: new Date()
                                        });

                                        historyRecord.save(function(err, docs) {
                                             var mailCon = mailContent(username, mongoData.Email);
                                             var mailFile = JSON.parse(fs.readFileSync(path.join(__dirname + '/mailStatus.json')));
                                             if(mailFile.status == true) {
                                                  mailer(mailCon.from, mailCon.to, mailCon.text, mailCon.html);                                                  
                                             }
                                             res.status(200).json({
                                                  'state': true
                                             });
                                        });
                                   }
                              });
                         }
                    });
               });
          });
	})

	/**
     * @api {delete} /api/v1/user remove a user
     * @apiName Remove user
     * @apiGroup User
     *
     * @apiParam {json} email  email of the user
     *
     * @apiSuccess {boolean} state State of the request
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

	.delete('/api/v1/user', bodyParser.json(), function(req, res) {
		var email = req.body.email;
		user.remove({Email: email}, function(err, result) {
			if(err) {
				//console.log('err', err);
				res.json({
					'state': false
				});
			}
			else {
				option.remove({Email: email}, function(err, result) {
					if(err) {
						res.json({
							'state': false
						});
					} else {
						res.json({
							'state': true
						});
					}
				});
			}
		});
	})

	/**
     * @api {delete} /api/v1/password update user password
     * @apiName Update password
     * @apiGroup User
     *
     * @apiParam {json} newpassword  new password
     * @apiParam {json} oldpassword  old password
     *
     * @apiSuccess {boolean} state State of the request
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
     * @apiError UnAuthorized state of the request
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 400 Bad Request
     *     {
     *       "state": true,
     *       "message": "old and new passwords are required"
     *     }
     */

	.put('/api/v1/user/password', bodyParser.json(), function(req, res) {
		var newPassword = req.body.newpassword;
		var oldPassword = req.body.oldpassword;

		if(newPassword != null || oldPassword != null) {
			user.findOneUpdate({password: oldPassword}, {password: newPassword}, function(err, docs) {
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
		} else {
			res.status(401).json({
				'state': true,
				'message': 'old and new passwords are required'
			});
		}
	})

     .get('/api/v1/user/history', function(req, res) {
          var username = jwt.verify(req.headers['auth-token'], 'supersecret').username;
          var _id = req.query._id;
          userHistory.find({ userId: _id }, function(err, docs) {
               if(err) res.json(err);
               res.json({
                    state: true,
                    history: docs
               });
          });
     })

     .get('/api/v1/history', function(req, res) {
          var username = jwt.verify(req.headers['auth-token'], 'supersecret').username;
          var _id = req.query._id;
          userHistory.find({}, function(err, docs) {
               if(err) res.json(err);
               res.json({
                    state: true,
                    history: docs
               });
          });
     })

     .get('/api/v1/user/spechistory', function(req, res) {
          var username = jwt.verify(req.headers['auth-token'], 'supersecret').username;
          var _id = req.query._id;
          //per record history
          userHistory.find({ _id: _id }, function(err, docs) {
               if(err) res.json(err);

               res.json({
                    state: true,
                    history: docs[0]
               });
          });
     });
};