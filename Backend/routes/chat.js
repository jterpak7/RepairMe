//Reporter ROUTE HANDLING

var express = require('express');
var router = express.Router();
import Chat from '../models/chat';
import OpenTicket from '../models/openTicket';
import Account from '../models/account';
import Session from '../models/session';
var hash = require('object-hash');

function fixDuplicate(ticketID, asset, tenantID, subcontractorID){
    Chat.find({ticketID: ticketID, asset: asset, tenantID: tenantID, subcontractorID: subcontractorID}, "messages", function(error, chats){
        for (var i = 1; i<chats.length;i++){
            for (var j = 0; j<chats[i].messages.length;j++){
                chats[0].messages.push(chats[i].messages[j])
            }
            chats[i].delete(function (err) {
                console.log(err)
            })
        }
    });
}
function addMessages(chat, messages, response){
        for (var i = 0;i<messages.length;i++){
            chat.messages.unshift(messages[i])
        }
        chat.newForAsset=true
        chat.newForTenant=true
        chat.newForSubcontractor=true
        chat.messagesHash = hash(chat.messages)
        var swapped;
        do {
            swapped = false;
            for (var i=0; i < chat.messages.length-1; i++) {
                if (chat.messages[i].createAt > chat.messages[i+1].createAt) {
                    var temp = chat.messages[i].createAt;
                    chat.messages[i].createAt = chat.messages[i+1].createAt;
                    chat.messages[i+1].createAt = temp;
                    swapped = true;
                }
            }
        } while (swapped);
        chat.save(function(err) {
            if(err) {
                response.status(400).send({error: err});
                return;
            }
            response.send({chat:chat})
        })
        
        // console.log(chat)
}


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
        Chat.find({}, function(error, chats){
            if(error){
                response.status(400).send({error: error});
                return;
            }
            response.send({chats: chats});
        })
    })
    // .delete(function(request, response){
    //     Chat.deleteMany({}, function(err){
    //         if(err){
    //             console.log(err);
    //             return;
    //         }
            
    //         response.send("Success");
    //     })
    // })
    .post(function(request, response) {
        newConvoPost(request, response)
    });
    function newConvoPost(request, response){
        Chat.find({ticketID: request.body.ticketID, asset: request.body.asset, tenantID: request.body.tenantID, subcontractorID: request.body.subcontractorID}, "messages", function(error, chats){
            if(error){
                console.log(error)
                response.status(400).send({error: error});
                return;
            }  
            if (chats.length==1){
                addMessages(chats[0],request.body.messages, response)
            }else if (chats.length==0){
                var chat = new Chat();
                chat.ticketID = request.body.ticketID
                if (request.body.asset != ""){
                    chat.asset = request.body.asset
                }
                if (request.body.tenantID != ""){
                    chat.tenantID = request.body.tenantID
                }
                if (request.body.subcontractorID != ""){
                    chat.subcontractorID = request.body.subcontractorID
                }
                addMessages(chat,request.body.messages, response)
            }else {
                fixDuplicate(request.body.ticketID, request.body.asset, request.body.tenantID, request.body.subcontractorID)
                newConvoPost(request, response)
            }
        });
    }


router.route('/checkForExisting/:ticketID')
    .get(function(request, response) {
        Chat.find({ticketID: request.params.ticketID}, "-messages", function(error, chats){
            if(error){
                response.status(400).send({error: error});
                return;
            }
            response.send({chats: chats});
            
        })
    })
router.route('/navToChat')
    .post(function(request, response) {
        Chat.find({ticketID: request.body.ticketID, asset: request.body.asset, tenantID: request.body.tenantID, subcontractorID: request.body.subcontractorID}, "_id", function(error, chats){
            if(error){
                response.status(400).send({error: error});
                return;
            }
            response.send({chats: chats[0]});
        })
    })

router.route('/existing/:chatID')
    .get(function(request, response) {
        Chat.findOne({_id:request.params.chatID}, function(error, chat){
            if(error){
                response.status(400).send({error: error});
                return;
            }
            if (chat.subcontractorID==request.query.userID){
                chat.newForSubcontractor=false
            }else{
                if (chat.tenantID==request.query.userID){
                    chat.newForTenant = false
                }else{
                    chat.newForAsset = false
                }
            }
            chat.save(function(err) {
                if(err) {
                    response.status(400).send({error: err});
                    return;
                }
                response.send({chat:chat})
            })
        })
    })
    .put(function(request, response) {
        // console.log(request.body)
        Chat.findOne({_id:request.params.chatID}, function(error, chat){
            if(error){
                response.status(400).send({error: error});
                return;
            }        
            addMessages(chat,request.body, response)
        })
    })
    .delete(function(request, response) {
    });
router.route('/checkNewMessages/:chatID')
    .get(function(request, response) {
        Chat.findOne({_id:request.params.chatID}, function(error, chat){
            if(error){
                response.status(400).send({error: error});
                return;
            }
            if(chat.messagesHash!=request.query.hash){
                response.send({ isNew:true });
            }else{
                response.send({ isNew:false });
            }
        })
    })
router.route('/chatHome/:userID')
    .get(function(request, response) {
        Chat.find({ $or: [ { tenantID: request.params.userID }, { subcontractorID: request.params.userID }, { asset: request.params.userID } ] }, "-messages" , function(error, chats){
            if(error){
                response.status(400).send({error: error});
                return;
            }
            var ticketIDs = []
            for (var i = 0;i<chats.length;i++){
                if (ticketIDs.indexOf(chats[i].ticketID)==-1){
                    ticketIDs.push(chats[i].ticketID)
                }
            }
            OpenTicket.find({ _id: { $in: ticketIDs}}, function(error, tickets){
                if(error){
                    response.status(400).send({error: error});
                    return;
                }
                response.send({
                    chats:chats,
                    tickets:tickets
                })
            })
        })
    });
router.route('/chatHomePreview/:userID')
    .get(function(request, response) {
        var count = 0;
        Chat.find({ $or: [ { tenantID: request.params.userID }, { subcontractorID: request.params.userID }, { asset: request.params.userID } ] }, "-messages" , function(error, chats){
            // console.log(chats)
            if(error){
                response.status(400).send({error: error});
                return;
            }
            for (var i = 0; i<chats.length; i++) {
                if(chats[i].newForTenant && request.params.userID==chats[i].tenantID){
                    count++
                } else if (chats[i].newForSubcontractor && request.params.userID==chats[i].subcontractorID){
                    count++
                } else if (chats[i].newForAsset && request.params.userID==chats[i].asset){
                    count++
                }
            }
            response.send({newMessages:count})
        })
    });
module.exports = router;
