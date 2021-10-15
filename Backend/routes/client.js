//Client ROUTE HANDLING

var express = require('express');
var router = express.Router();
import Client from '../models/client';
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
        
    })
    .post(function(request, response) {
    
    });


module.exports = router;