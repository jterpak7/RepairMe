//Ticket ROUTE HANDLING

var express = require('express');
var router = express.Router();
import OpenTicket from '../models/openTicket';
import Assets from '../models/asset';
import CompletedTicket from '../models/completedTicket';
import Category from '../models/category';
import indico from 'indico.io';
const vision = require('@google-cloud/vision');
import Asset from '../models/asset';
import fetch from 'node-fetch';
import Session from '../models/session'
var apiKey = "f39dbc6a87cd7aa2498f03efd91f40b0";
indico.apiKey = apiKey;

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
//         request.headers['userRole'] = session.type;
//         next();
//     })
// });

//BELOW THIS IS AUTHENTICATED METHODS

router.route('/')

    .get(function (request, response){
        OpenTicket.find({}, "-image",function(err, tickets) {
            if(err) {
                response.status(500).send({err: err});
                return;
            }
            response.status(200).send({tickets: tickets});
        });
    })
    
    // .delete(function(request, response){
    //     OpenTicket.deleteMany({}, function(err){
    //         if(err){
    //             console.log(err);
    //             return;
    //         }
            
    //         response.send("Success");
    //     })
    // })

    .post(function(request, response) {
        OpenTicket.findOne({_id: request.body.ticketID}, "-image", function(error, ticket){
            if(error){
                response.status(500).send({error: error});
                return;
            }
            
            response.status(200).send({ticket: ticket})
        })
    });
    
router.route('/TenantHomeList/:account_id')

    .get(function (request, response){
        OpenTicket.find({UserID: request.params.account_id}, function(err, tickets) {
            if(err) {
                response.status(500).send({err: err});
                return;
            }
            response.status(200).send({tickets: tickets});
        });
    })
    
    .post(function(request, response) {

        OpenTicket.find({}).populate("contractorID").exec(function(error, tickets){
            if(error){
                response.status(500).send({error, tickets});
            }
            
            response.status(200).send({tickets: tickets});
        })
    })
    
router.route('/saveticket')

    .post(function(request, response){
        var ticket = new OpenTicket();
        ticket.AssetID = request.body.asset;
        ticket.UserID = request.body.user;
        ticket.image = request.body.image;
        ticket.title = request.body.title;
        ticket.description = request.body.description;
        ticket.ticketState = "New";
        if(request.body.acceptorID !== null){
            ticket.acceptorID = request.body.acceptorID;
        }
        ticket.timeOpened = new Date();
        var assetID = ticket.AssetID
        var ticketID = ticket._id;
        
        ticket.save(function(err) {
            if(err) {
                response.status(400).send({error: err});
                return;
            }
            
            Asset.findOneAndUpdate({_id: assetID}, {$push: {tickets: ticketID}}, function(error){
                if(error){
                    response.status(400).send({error: error});
                    return;
                }
                response.send({success: true, message: "Ticket Created"});
                
                analysis(ticket);
            })
        })
    })
    
router.route('/saveticketBM')
    
    .post(function(request, response){
        
        var ticket = new OpenTicket();
        ticket.AssetID = request.body.asset;
        ticket.UserID = request.body.user;
        ticket.image = request.body.image;
        ticket.title = request.body.title;
        ticket.description = request.body.description;
        ticket.ticketState = "Awaiting Bids";
        ticket.timeOpened = new Date();
        ticket.timeAccepted = ticket.timeOpened;
        ticket.category = request.body.category;
        ticket.acceptorID = ticket.UserID;
        var assetID = ticket.AssetID;
        var ticketID = ticket._id;
        
        ticket.save(function(err) {
            if(err) {
                response.status(400).send({error: err});
                return;
            }
            
            Asset.findOneAndUpdate({_id: assetID}, {$push: {tickets: ticketID}}, function(error){
                if(error){
                    response.status(400).send({error: error});
                    return;
                }
                
                response.send({success: true, message: "Ticket Created"});
                
                analysis(ticket);
            })
        })
    })
 router.route("/acceptedTickets")

    .get(function(request,response){
       // console.log("butthole")
        var page = parseInt(request.query.pageNumb);
        var limit = parseInt(request.query.limit);
        const options = {
            page: page,
            limit: limit,
            //select: '-image',
            sort: { timeOpened: -1 }
        };
         OpenTicket.paginate({ticketState: 'Awaiting Bids'}, options, (error, tickets) => {
            if(error){
                response.status(500).send({error: error});
                return;
            }
            
            response.status(200).send({tickets: tickets});
        })
        
    })
    
// router.route("/:ticketID")
    
//     .get(function(request, response){
//         OpenTicket.findOne({_id: request.params.ticketID}, "image", function(error, ticket){
//             if(error){
//                 response.status(500).send({error: error});
//                 return;
//             }
            
//             response.status(200).send({ticket: ticket.image})
//         })
//     })
    
router.route('/accept/:ticketID')

    .post(function(request, response){
        OpenTicket.findOneAndUpdate({_id: request.params.ticketID}, {$set: {acceptorID: request.body.acceptorID, ticketState: 'Awaiting Bids', timeAccepted: new Date()}}, {new: true, useFindAndModify: false, projection: '-image'}, (error, ticket) =>{
            if(error){
                response.status(500).send({error: error});
                return;
            }
            
            response.status(200).send({ticket: ticket});
        })
    })
    

    
router.route("/bidOnticket/:ticket_id")

    .post(function(request, response){
        OpenTicket.findOne({_id: request.params.ticket_id},function(error,ticket){
            if(error){
                response.status(500).send({error: error});
                return;
            }
            var index =-1;
            for (var i =0; i<ticket.Bids.length; i++){
                if (ticket.Bids[i].SubId == request.body.userID){
                    index = i;
                    break;
                }
            }
            if (request.body.materialsIncl == 1){
                
                if (index == -1){
                    ticket.Bids.push({SubId: request.body.userID, Price: request.body.bidPrice, Fixed: request.body.fixedPrice, Hourly: request.body.hourlyPrice, ExpectedHours: request.body.ExpectedHours,
                        MaterialsIncludedInPrice: false, FirstHour: request.body.firstHourPrice, SubsequentHours: request.body.subsequentHours
                    });
                }
                else{
                    ticket.Bids[index] =({SubId: request.body.userID, Price: request.body.bidPrice, Fixed: request.body.fixedPrice, Hourly: request.body.hourlyPrice, ExpectedHours: request.body.ExpectedHours,
                        MaterialsIncludedInPrice: false, FirstHour: request.body.firstHourPrice, SubsequentHours: request.body.subsequentHours
                    });
                }
                //ticket.Bids =[];
                
            }
            else{
               // ticket.Bids = [];
               if (index == -1){
                    ticket.Bids.push({SubId: request.body.userID, Price: request.body.bidPrice, Fixed: request.body.fixedPrice, Hourly: request.body.hourlyPrice, ExpectedHours: request.body.ExpectedHours,
                        MaterialsIncludedInPrice: true, FirstHour: request.body.firstHourPrice, SubsequentHours: request.body.subsequentHours
                    });
               }
               else{
                   ticket.Bids[index] = ({SubId: request.body.userID, Price: request.body.bidPrice, Fixed: request.body.fixedPrice, Hourly: request.body.hourlyPrice, ExpectedHours: request.body.ExpectedHours,
                        MaterialsIncludedInPrice: true, FirstHour: request.body.firstHourPrice, SubsequentHours: request.body.subsequentHours
                    });
                   
               }
                //ticket.Bids =[];
            }
            ticket.save(function(err){
               if (err){
                    response.status(400).send({error: err});
                    return;
               } 
            });
            response.status(200).send({ticket: ticket})
        })
    })
    
router.route('/accept/:ticketID')

    .post(function(request, response){
      //  console.log("here in accept");
        OpenTicket.findOneAndUpdate({_id: request.params.ticketID}, {$set: {acceptorID: request.body.acceptorID, timeAccepted: new Date()}}, {new: true, useFindAndModify: false, projection: '-image'}, (error, ticket) =>{
            if(error){
                response.status(500).send({error: error});
                return;
            }
            
            response.status(200).send({ticket: ticket});
        })
    })
    
router.route('/decline/:ticketID')

    .post((request, response) => {
        //, {new: true, projection: '-image'}
        OpenTicket.findOneAndUpdate({_id: request.params.ticketID}, {$set: {ticketState: "Declined"}}, {useFindAndModify: false}, (error, ticket) =>{
            if(error){
                response.status(500).send({error: error});
                return;
            }
            
            response.status(200).send({ticket: ticket});
        })
    })
    
router.route("/BMOpenTicket/:assetID")

    .get(function(request, response){
        var page = parseInt(request.query.pageNumb);
        var limit = parseInt(request.query.limit);
        const options = {
            page: page,
            limit: limit,
            sort: { timeOpened: -1 }
        };
        
        OpenTicket.paginate({AssetID: request.params.assetID, ticketState: {$in: ['New', 'Awaiting Bids', 'Accepted Bid', 'Awaiting Scheduling', 'In Progress', 'Awaiting Payment', 'Under Review']}}, options, (error, tickets) => {
            if(error){
                response.status(500).send({error: error});
                return;
            }
            
            response.status(200).send({tickets: tickets});
        })
    })
    
router.route("/BMOpenTicket/search/:assetID")

    .get((request, response) =>{
        var page = parseInt(request.query.pageNumb);
        var limit = parseInt(request.query.limit);
        const options = {
            page: page,
            limit: limit,
            sort: { timeOpened: -1 }
        };

        OpenTicket.paginate({$text: { $search: request.query.query }, AssetID: request.params.assetID, ticketState: {$in: ['New', 'Awaiting Bids', 'Accepted Bid', 'Awaiting Scheduling', 'In Progress', 'Awaiting Payment', 'Under Review']}}, options, (error, tickets) => {
            if(error){
                response.status(500).send({error: error});
                return;
            }
                
            response.status(200).send({tickets: tickets});
        })   
    })
    
router.route("/BMClosedTicket/:assetID")

    .get(function(request, response){
        var page = parseInt(request.query.pageNumb);
        var limit = parseInt(request.query.limit);
        const options = {
            page: page,
            limit: limit,
            sort: { timeOpened: -1 }
        };
        
        OpenTicket.paginate({AssetID: request.params.assetID, ticketState: {$in: ["Canceled", "Declined", "Completed"]}}, options, (error, tickets) => {
            if(error){
                response.status(500).send({error: error});
                return;
            }
            
            response.status(200).send({tickets: tickets});
        })
    })
    
router.route("/BMClosedTicket/search/:assetID")

    .get((request, response) =>{
        var page = parseInt(request.query.pageNumb);
        var limit = parseInt(request.query.limit);
        const options = {
            page: page,
            limit: limit,
            sort: { timeOpened: -1 }
        };
        
        OpenTicket.paginate({$text: { $search: request.query.query }, AssetID: request.params.assetID, ticketState: {$in: ["Canceled", "Declined", "Completed"]}}, options, (error, tickets) => {
            if(error){
                response.status(500).send({error: error});
                return;
            }
                
            response.status(200).send({tickets: tickets});
        })   
    })

router.route("/TenantOpenTicket/:userID")

    .get(function(request, response){
        var page = parseInt(request.query.pageNumb);
        var limit = parseInt(request.query.limit);
        const options = {
            page: page,
            limit: limit,
            sort: { timeOpened: -1 }
        };
        
        OpenTicket.paginate({UserID: request.params.userID, ticketState: {$in: ['New', 'Awaiting Bids', 'Accepted Bid', 'Awaiting Scheduling', 'In Progress', 'Awaiting Payment', 'Under Review']}}, options, (error, tickets) => {
            if(error){
                response.status(500).send({error: error});
                return;
            }
                
            response.status(200).send({tickets: tickets});
        })   
    })
    
router.route("/TenantOpenTicket/search/:userID")

    .get((request, response) =>{
        var page = parseInt(request.query.pageNumb);
        var limit = parseInt(request.query.limit);
        const options = {
            page: page,
            limit: limit,
            sort: { timeOpened: -1 }
        };
        
        OpenTicket.paginate({$text: { $search: request.query.query }, UserID: request.params.userID, ticketState: {$in: ['New', 'Awaiting Bids', 'Accepted Bid', 'Awaiting Scheduling', 'In Progress', 'Awaiting Payment', 'Under Review']}}, options, (error, tickets) => {
            if(error){
                response.status(500).send({error: error});
                return;
            }
                
            response.status(200).send({tickets: tickets});
        })   
    })

router.route("/TenantClosedTicket/:userID")

    .get(function(request, response){
        var page = parseInt(request.query.pageNumb);
        var limit = parseInt(request.query.limit);
        const options = {
            page: page,
            limit: limit,
            sort: { timeOpened: -1 }
        };

        OpenTicket.paginate({UserID: request.params.userID, ticketState: {$in: ["Closed", "Declined", "Completed"]}}, options, (error, tickets) => {
            if(error){
                response.status(500).send({error: error});
                return;
            }
            
            response.status(200).send({tickets: tickets});
        })
    })
    
router.route("/TenantClosedTicket/search/:userID")

    .get((request, response) =>{
        var page = parseInt(request.query.pageNumb);
        var limit = parseInt(request.query.limit);
        const options = {
            page: page,
            limit: limit,
            sort: { timeOpened: -1 }
        };
        
        OpenTicket.paginate({$text: { $search: request.query.query }, UserID: request.params.userID, ticketState: {$in: ["Closed", "Declined", "Completed"]}}, options, (error, tickets) => {
            if(error){
                response.status(500).send({error: error});
                return;
            }
                
            response.status(200).send({tickets: tickets});
        })   
    })
    
router.route("/SubOpenTicket/:subID")

    .get(function(request, response){
        var page = parseInt(request.query.pageNumb);
        var limit = parseInt(request.query.limit);
        const options = {
            page: page,
            limit: limit,
            sort: { timeOpened: -1 }
        };
        
        OpenTicket.paginate({subcontractorID: request.params.subID, ticketState: { $in: ['Accepted Bid', 'Awaiting Scheduling', 'In Progress', 'Awaiting Payment', 'Under Review']}}, options, (error, tickets) => {
            if(error){
                response.status(500).send({error: error});
                return;
            }
            
            response.status(200).send({tickets: tickets});
        })
    })

router.route("/SubOpenTicket/materials/:ticketID")

    .post(function(request, response){
        var materials = request.body.materials
        OpenTicket.findOneAndUpdate({_id: request.params.ticketID}, {"$set": {"materials": materials}}, {new: true, projection: '-image'}).exec((error, ticket) =>{
            if(error){
                response.status(500).send({error: error});
                return;
            }
            response.status(200).send({ticket: ticket});
        })
    })
    
router.route("/SubOpenTicket/search/:subID")

    .get((request, response) =>{
        var page = parseInt(request.query.pageNumb);
        var limit = parseInt(request.query.limit);
        const options = {
            page: page,
            limit: limit,
            sort: { timeOpened: -1 }
        };
        
        OpenTicket.paginate({$text: { $search: request.query.query }, subcontractorID: request.params.subID, ticketState: {$in: ['New', 'Awaiting Bids', 'Accepted Bid', 'Awaiting Scheduling', 'In Progress', 'Awaiting Payment', 'Under Review']}}, options, (error, tickets) => {
            if(error){
                response.status(500).send({error: error});
                return;
            }
                
            response.status(200).send({tickets: tickets});
        })   
    })

router.route("/SubClosedTicket/:subID")//

    .get(function(request, response){
        var page = parseInt(request.query.pageNumb);
        var limit = parseInt(request.query.limit);
        const options = {
            page: page,
            limit: limit,
            sort: { timeOpened: -1 }
        };
        
        OpenTicket.paginate({subcontractorID: request.params.subID, ticketState: {$in: ["Completed", "Closed", "Declined"]}}, options, (error, tickets) => {
            if(error){
                response.status(500).send({error: error});
                return;
            }
            
            response.status(200).send({tickets: tickets});
        })
    })
    
router.route("/SubClosedTicket/search/:subID")

    .get((request, response) =>{
        var page = parseInt(request.query.pageNumb);
        var limit = parseInt(request.query.limit);
        const options = {
            page: page,
            limit: limit,
            sort: { timeOpened: -1 }
        };
        
        OpenTicket.paginate({$text: { $search: request.query.query }, subcontractorID: request.params.subID, ticketState: {$in: ["Closed", "Declined", "Completed"]}}, options, (error, tickets) => {
            if(error){
                response.status(500).send({error: error});
                return;
            }
                
            response.status(200).send({tickets: tickets});
        })   
    })
    
router.route('/info/:ticketID')

    .get(function(request, response){
        OpenTicket.findOne({_id: request.params.ticketID}, function(error, ticket){
            if(error){
                response.status(500).send({error: error});
                return;
            }
            
            response.status(200).send({ticket: ticket});
        })
    })
    
router.route('/assignCategory/:id')

    .post((request, response) => {
        OpenTicket.findOneAndUpdate({_id: request.params.id}, {$set:{'category': request.body.category}}, (error, ticket) => {
            if(error){
                response.status(500).send({error: error});
                return;
            }
            
            response.status(200).send({ticket: ticket});
        })  
    })
    
router.route('/acceptBid/:_id')

    .post((request, response) => {
        OpenTicket.findOneAndUpdate({_id: request.params._id}, {$set:{'subcontractorID': request.body.bid.SubId, 'Bids': request.body.bid, 'timeSubbed': new Date(), 'ticketState': 'Accepted Bid'}}, (error, ticket) =>{
            if(error){
                response.status(500).send({error: error});
                return;
            }
            
            response.status(200).send({ticket: ticket});
        })
    })
    
router.route('/completeTicket/:_id')

    .post((request, response) => {
        OpenTicket.findOneAndUpdate({_id: request.params._id}, {$set: {'ticketState': 'Completed'}}, (error, ticket) => {
            if(error){
                response.status(500).send({error: error});
                return;
            }
            
            response.status(200).send({ticket: ticket});
        })
    })
    
    //var tickets = [];
router.route('/getTickLocation/:city')

    .get(function(request, response){
        console.log("i am here");
       // var page = parseInt(request.query.pageNumb);
        //var limit = parseInt(request.query.limit);
       
       /* const options = {
            page: page,
            limit: limit,
            sort: { timeOpened: -1 }
        };*/
                
        Assets.find({city: request.params.city}, function(err,assets) {
            if(err){
                response.status(500).send({error:err});
                return;
            }
            var ids = [];
            for (var i = 0; i < assets.length; i++) {
                ids.push(assets[i]._id);
            }
            console.log(ids);
            OpenTicket.find({AssetID: {$in: ids}, ticketState: 'Awaiting Bids'}, function(err, tickets) {
                if(err){
                    console.log(err);
                    return;
                }
                response.status(200).send({tickets:tickets})
               // console.log(tickets);
            })
        })

    })

 module.exports = router;

const analysis = (ticket) => {
    indico.sentiment(ticket.description)
        .then((response) =>{
            OpenTicket.findOne({_id: ticket._id}, function(err, updateTic){
                if(err){
                    return({error: err})
                }
                updateTic.descSentiment = response;
                updateTic.save(function(err){
                    if(err){
                        console.log(err);
                        return;
                    }
                
                    return("Success");
                })
            })
        })
        .catch((err) =>{
            return(err);
        });
    
    const client = new vision.ImageAnnotatorClient({
        keyFilename: './constants/apikey.json',
        projectId: 'repairme'
    });
    var imgData = ticket.image;
    if(imgData === null){
        //console.log("No data");
        return;
    };
    
    const visionReq = {
         "requests":[
            {
              "image":{
                "content": `${imgData}`
              },
              "features": [
                {
                  "type":"LABEL_DETECTION",
                  "maxResults":3
                }
              ]
            }
          ]
    };
    
    client.annotateImage(visionReq.requests[0])
        .then((response) => {
            const labels = response[0].labelAnnotations;
            
            OpenTicket.findOne({_id: ticket._id}, function(err, updateTic){
                    if(err){
                        console.log({error: err})
                        return;
                    }
                    
                    labels.forEach(label => {
                        updateTic.buckets.push(label.description);
                    });
                    
                    updateTic.save(function(err, ticket){
                        if(err){
                            console.log({error: err});
                            return;
                        }
                        
                    })
                })
        })
        .catch((err) => {
            console.log("Error:", err);
            return;
        })
}