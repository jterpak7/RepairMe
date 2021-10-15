//Reporter ROUTE HANDLING

var express = require('express');
var router = express.Router();
import Reporter from '../models/reporter';
import Session from '../models/session';

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
        Reporter.find(function(err, reporters) {
            if(err) {
                response.status(500).send({err: err});
                return;
            }
            
            response.status(200).send({reporters: reporters});
        })
    })
    .post(function(request, response) {
    
    });

router.route('/:reporterid')
    .put(function(request, response) {
        Reporter.findOne({_id: request.params.reporterid}, function(err, reporter) {
            if(err) {
                response.status(500).send({err: err});
                return;
            }
            
            reporter.isBM = request.body.isBM;
            reporter.isTenant = request.body.isTenant;
            reporter.save(function(err) {
                if(err) {
                    response.status(500).send({err: err});
                    return;
                }
                
                response.status(200).send({success: true, message: 'content successfully updated'});
            });
        });
    })
    .delete(function(request, response) {
        Reporter.findOne({_id: request.params.reporterid}, function(err, deleted) {
            if(err) {
                response.status(500).send({err: err});
                return;
            }
            
            response.send({deleted: deleted});
        })
    })

module.exports = router;