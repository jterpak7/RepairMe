//Account ROUTE HANDLING

var express = require('express');
var router = express.Router();
var stripekey = require('../constants/stripekey.json');
var stripe = require('stripe')(stripekey.sk_test);
const crypto = require('crypto');
var jwt = require('jsonwebtoken');
var scrypt = require("scrypt");
var scryptParameters = scrypt.paramsSync(0.1);
import Session from '../models/session';
import Account from '../models/account';
import Subcontractor from '../models/subcontractor';
import Reporter from '../models/reporter';

router.route('/')

    .get(function (request, response){
        Account.find(function(err, accounts) {
            if(err) {
                console.log(err);
                response.status(500).send({err: err});
                return;
            }
            
            response.status(200).send({accounts: accounts});
        });
            /*Account.deleteMany({}, function(err, accs){
                if(err){
                    console.log(err);
                    response.send(err);
                    return;
                    
                }
                response.send({accounts: accs});
            })*/
        
    })
    
    
    .post(function(request, response) {
        Account.findOne({username: request.body.username}, function(err, user) {
            if(err) {
                response.status(500).send({error: err});
                return;
            }
            if(user) {
                response.status(400).send({success: false, reason: "The requested username is already in use"});
                return;
            }
             //put the entire create within the async call so that stripeId could return synchronously
            var account = new Account();
            stripe.accounts.create({
                type: 'custom',
                country: 'CA',
                email: request.body.email
            }, function(err, acc) {
                account.stripeID=acc.id
                if(err){
                    console.log(err)
                }

            
            account.username = request.body.username;
            account.firstName = request.body.firstName;
            account.lastName = request.body.lastName;
            account.email = request.body.email;
            account.phoneNumber = request.body.phoneNumber;
            account.assetID = request.body.assetID;
            if(request.body.isTenant) {
                console.log(request.body.isTenant);
                account.isTenant = true;
                account.isBM = false;
                account.isSubcontractor = false;
                account.isContractor = false;
                var reporter = new Reporter();
                reporter.accountID = account._id;
                reporter.assetID = request.body.assetID;
                reporter.isTenant = true;
                reporter.save(function(err) {
                    if(err) {
                        response.status(500).send({err: err});
                        return;
                    }
                });
            }
            else if(request.body.isBM){
                
                account.isTenant = false;
                account.isBM = true;
                account.isSubcontractor = false;
                account.isContractor = false;
                var BMreporter = new Reporter();
                BMreporter.accountID = account._id;
                BMreporter.assetID = request.body.assetID;
                BMreporter.isTenant = true;
                BMreporter.save(function(err) {
                    if(err) {
                        response.status(500).send({err: err});
                        return;
                    }
                });
            }
            else if(request.body.isSubcontractor) {
                //Account created is a subcontractor
                account.isSubcontractor = true;
                account.isTenant = false;
                account.isTenant= false;
                account.isContractor = false;
                var subcontractor = new Subcontractor();
                subcontractor.accountID = account._id
                subcontractor.phoneNumber = request.body.phoneNumber;
                subcontractor.email = request.body.email;
                subcontractor.firstName = request.body.firstName;
                subcontractor.lastName = request.body.lastName;
               // subcontractor.contractorBelongingTo = request.body.contractorId;
                subcontractor.save(function(err) {
                    if(err) {
                        response.status(500).send({err: err});
                        return;
                    }
                });
            }
            else if(request.body.isContractor) {
              
                //Account is a Contractor
                // account.isSubcontractor = false;
                // account.isTenant = false;
                // account.isBM = false;
                // account.isContractor = true;
                // var contractor = new Subcontractor();

                // contractor.accountID = account._id;

                // contractor.phoneNumber = request.body.phoneNumber;
                // contractor.assetID = request.body.assetID;
                // contractor.email = request.body.email;
                // contractor.firstName = request.body.firstName;
                // contractor.lastName = request.body.lastName;
                // contractor.listOfSubs =[];
                // contractor.save(function(err) {
                //     if(err) {
                //         request.status(500).send({err: err});
                //         return;
                //     }
                // })
            }
            else {
                //Account has fallen through to this point, the request was not in a good format so send back error.
                response.status(400).send({success: false, message: "Account type not specified. Account could not be created"});
                return;
            }
            if(!request.body.password) {
                //Password not provided return error
                response.status(400).send({success: false, message: 'Password not supplied, request failed.'});
            }
            try {
                var salt = crypto.randomBytes(128).toString('base64');
                var passAndSalt = request.body.password.toString('base64') + salt;
                var encryptedPassword = scrypt.kdfSync(passAndSalt, scryptParameters);
                account.hashedPassword = encryptedPassword.toString('base64');
            }
            catch(err) {
                console.log(err);
                response.status(500).send({err: err, success: false, message: "Internal Error"});
                return;
            }
            
            account.salt = salt;
            account.save(function(err) {
                if(err) {
                    response.status(400).send({error: err});
                    return;
                }

                response.send({success: true, message: "Account has been successfully created", accountID: account._id, assetID: account.assetID});
            });
        });
    });

router.route('/payTest').get((req,res)=>{
            console.log(req.body)

    Account.findOne({_id:req.body.id},(err,account)=>{
        if(err){
            res.status(500).send({err:err});
            return;
        }else if(!account){
            res.status(400).send({ message: "Cannot find Account" });
            return;
        }
        
        stripe.charges.create({
            amount: req.body.amount,
            currency: req.body.currency,
            source: req.body.source,
            transfer_data: {
                destination: account.stripeID,
            },
        }).then((charge)=>{
            res.status(200).send({ammount:charge.amount, currency:charge.currency})

            console.log(charge)
            
        }).catch(error=>{
            res.status(500).send({error: err});

        });
    })
})

//Update Tenant
router.route("/updateTenant")
    .put(function (request, response) {
        console.log("Attempting to add Asset to Tenant")
        Account.findOneAndUpdate({ _id: request.body.id }, { $push: { assetID: request.body.assetSelected } }, { new: true }, (err, account) => {
            if (err) {
                response.status(500).send({ err: err });
                return;
            }

            response.status(200).send({ success: true, message: "Tenant Updated w Client" });
            return;

        });
    })

router.route('/changepassword')
    .put(function(request, response) {
        Account.findOne({_id: request.body.id}, function(err, account) {
            if(err) {
                response.send(err);
                return;
            }
            //format the supplied password with the stored salt and retrive the stored hash
            var saltedPass = request.body.password + account.salt;
            var passwordBuffer = new Buffer(account.hashedPassword, "base64");
            var saltedPassBuffer = new Buffer(saltedPass);
            var answer = scrypt.verifyKdfSync(passwordBuffer, saltedPassBuffer);
            if(answer) {
                try {
                    var passAndSalt = request.body.newPassword.toString('base64') + account.salt;
                    var encryptedPassword = scrypt.kdfSync(passAndSalt, scryptParameters);
                    account.hashedPassword = encryptedPassword.toString('base64');
                    account.save(function(err) {
                        if(err) {
                            response.send({err: err});
                            return;
                        }
                        
                        response.status(200).send({success: false, message: 'password successfully updated'});
                    })
                }
                catch(err) {
                    console.log(err);
                    response.status(500).send({err: err, success: false, message: "Internal Error"});
                    return;
                }
                
            }
            else {
                response.send({success: false, message: 'password incorrect'});
                return;
            }
        })
    })
});
router.route('/:account_id')
    .get(function(request, response) {
        Account.findOne({_id: request.params.account_id}, function(err, account) {
            if(err) {
                response.status(500).send({error: err});
                return;
            }
            response.status(200).send({account: account});
        });
    })
    //update
    .post(function(request,response){
      Account.findOne({_id: request.params.account_id}, function(err,account){
          if(err){
              response.status(500).send({error:err});
              return;
          }
          account.firstName = request.body.firstName;
          account.lastName = request.body.lastName;
          account.email = request.body.email;
          account.phoneNumber = request.body.phoneNumber;
          
          account.save(function(err) {
                if(err) {
                    response.status(400).send({error: err});
                    return;
                }
          });
          response.status(200).send({success: true, message: "Account has been updated successfully"});
      });
    
    })
    
    .delete(function(request, response) {
        Account.findOneAndDelete({_id: request.params.account_id}, function(err, deleted) {
            if(err) {
                response.status(500).send({error: err});
                return;
            }
            
            response.status(200).send({deleted: deleted});
        });
    });

router.route('/asset/connectToAsset')
    .put(function(request, response) {
         Account.findOne({_id: request.body.id}, function(err,account){
          if(err){
              response.status(500).send({error:err});
              return;
          }
          
          account.assetID = request.body.assetSelected;
          
          account.save(function(err) {
                if(err) {
                    response.status(400).send({error: err});
                    return;
                }
          });
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
                  response.send(err);
                  return;
              }
              
              response.status(200).send({success: true, message: "Account has been updated successfully", assetID: account.assetID, token: token});
          })
      });
    })
module.exports = router;