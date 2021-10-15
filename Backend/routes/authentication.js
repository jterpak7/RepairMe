//Authentication ROUTE HANDLING

var express = require('express');
var router = express.Router();
import Session from '../models/session';
import Account from '../models/account';
var jwt = require('jsonwebtoken');
var scrypt = require("scrypt");

//ABOVE THIS IS UNAUTHENTICATED METHODS

// router.use(function(request, response, next){
//     var jwtToken = request.get('authorization');
//     console.log(jwtToken);
//     Session.findOne({token: jwtToken}, function(err, session) {
//         if(err) {
//             response.status(500).send({err: err});
//             return;
//         }
        
//         if(!session) {
//             response.status(401).send({success: false, message: 'unauthorized access'});
//             return;
//         }
        
//         next();
//     })
// });

//BELOW THIS IS AUTHENTICATED METHODS

router.route('/')

    .get(function (request, response){
        console.log(request.body);
        Account.find({}, function(err, users){
            if(err){
                console.log(err);
            }
            
            response.send(users);
        })
    })
    .post(function(request, response) {

    });

router.route('/login')
    .get(function(request, response) {
        Session.find(function(err, sessions) {
            if(err) {
                response.status(500).send({err: err});
                return;
            }
            
            response.status(200).send({sessions: sessions});
        });
    })
    
    .post(function(request, response){
        
        Account.findOne({username: request.body.username}, function(err, account) {
            if(err) {
                response.status(500).send({error: err});
                return;
            }
            
            if(!account) {
                //need to pick a better status code to send back
                response.status(400).send({error: 'username not found'});
                return;
            }
            
            //format the supplied password with the stored salt and retrive the stored hash
            var saltedPass = request.body.password + account.salt;
            var passwordBuffer = new Buffer(account.hashedPassword, "base64");
            var saltedPassBuffer = new Buffer(saltedPass);
            var answer = scrypt.verifyKdfSync(passwordBuffer, saltedPassBuffer);
            if(answer) {
                Session.findOne({userID: account._id}, function(err, session) {
                    if(err) {
                        response.status(500).send({error: err});
                        return;
                    }
                    
                    if(session) {
                        //session already exists, return them the session token
                        response.status(201).send({success: true, 
                                                  userID: account._id,
                                                  assetID: account.assetID,
                                                  isBM: account.isBM,
                                                  isTenant: account.isTenant,
                                                  isSubcontractor: account.isSubcontractor,
                                                  token: session.token});
                        return;
                    }
                    
                    //user does not have an open session, create a new one and assign them a jwt
                    const payload = {user: account.username};
                    var token = jwt.sign(payload, 'repairme');
                    var newSession = new Session();
                    newSession.userID = account._id;
                    newSession.token = token;
                    if(account.isSubcontractor) {
                        newSession.type = "Sub";
                    }
                    else if(account.isBM) {
                        newSession.type = "BM";
                    }
                    else {
                        newSession.type = "Tenant";
                    }
                    newSession.save(function(err) {
                        if(err) {
                            response.status(500).send({error: err});
                            return;
                        }
                        
                        response.status(201).send({success: true, 
                                              userID: account._id,
                                              assetID: account.assetID,
                                              isBM: account.isBM,
                                              isTenant: account.isTenant,
                                              token: token});
                                               
                        return;
                    });
                });
            }
            else {
                //need to have better status
                response.status(400).send({error: 'incorrect password'});
                return;
            }
        });
    });
    

router.route('/login/:session_id')
    .delete(function(request, response) {
        if(!request.params.session_id) {
            response.status(200).send({success: true});
            return;
        }
        Session.findOneAndDelete({token: request.params.session_id}, function(err, deleted) {
            if(err) {
                response.status(500).send({error: err});
                return;
            }
            
            response.status(200).send({deleted: deleted});
        });
    });

router.route('/sessions')
    .get(function(request, response) {
        Session.find(function(err, sessions) {
            if(err)  {
                response.send(err);
                return;
            }
            
            response.status(200).send({sessions: sessions});
        })
    })
    .delete(function(request, response) {
        Session.deleteMany(function(err, deleted) {
            if(err) {
                response.status(500).send({err: err});
                return;
            }
            
            response.send({deleted: deleted});
        })
    })
module.exports = router;