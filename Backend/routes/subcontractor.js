//Subcontractor ROUTE HANDLING

var express = require('express');
var router = express.Router();
import Subcontractor from '../models/subcontractor';
import OpenTicket from '../models/openTicket';
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
        Subcontractor.find(function(err, subcontractors) {
            if(err) {
                response.status(500).send({err: err});
                return;
            }
            
            response.status(200).send({subcontractors: subcontractors});
        })
    })
    .post(function(request, response) {
    
    });
router.route('/startTicket/:ticketID')

    
    .get(function(request, response){
        var now = Date.now()
        OpenTicket.findOneAndUpdate({_id: request.params.ticketID}, {"$set": {timeStarted: now, ticketState: "In Progress"}}, {new: true, projection: '-image'}, (error, ticket) =>{
            if(error){
                response.status(500).send({error: error});
                return;
            }
            response.status(200).send({ticket: ticket});
        })
    })
    
    .put(function(request, response){
        var now = Date.now()
        OpenTicket.findOneAndUpdate({_id: request.params.ticketID}, {"$set": {timeEnded: now, ticketState: "Under Review", labour:request.body.hours}}, {new: true, projection: '-image'}, (error, ticket) =>{
            if(error){
                response.status(500).send({error: error});
                return;
            }//
            response.status(200).send({ticket: ticket});
        })
    });
router.route('/:subcontractorid')
        
        .put(function(request, response) {
            Subcontractor.find({_id: request.params.subcontractorid}, function(err, subcontractor) {
            if(err) {
                response.status(500).send({err: err});
                return;
            }
            subcontractor.phoneNumber = request.body.phoneNumber;
            subcontractor.email = request.body.email;
            subcontractor.firstName = request.body.firstName;
            subcontractor.lastName = request.body.lastName;
            subcontractor.save(function(err) {
                if(err) {
                    response.status(500).send({err: err});
                    return;
                }
                
                response.send({success: true, subcontractor: subcontractor});
            });
        });
    })
    .delete(function(request, response) {
        Subcontractor.findOneAndDelete({_id: request.params.subcontractorid}, function(err, deleted) {
            if(err) {
                response.status(500).send({err: err});
                return;
            }
            
            response.status(200).send({deleted: deleted});
        });
    });

module.exports = router;