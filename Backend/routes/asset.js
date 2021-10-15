//Asset ROUTE HANDLING

var express = require('express');
var router = express.Router();
var nodemailer = require("nodemailer");
var QRCode = require('qrcode')
import Asset from '../models/asset';
import Session from '../models/session';

var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "loopsolutionsuwo@gmail.com",
        pass: "Selfstart"
    }
});


router.route('/')

    .get(function (request, response) {
       // console.log("jak")
        Asset.find(function (err, assets) {
            if (err) {
                console.log(err);
                response.status(500).send({ err: err });
                return;
            }
            //console.log(assets);
            response.status(200).send({ assets: assets })
        })
    })
    .post(function (request, response) {
        var asset = new Asset();
        asset.clientID = request.body.id;
        asset.address = request.body.address;
        asset.city = request.body.city;
        asset.postalCode = request.body.postalCode;
        asset.contractors = [];
        asset.tickets = [];

        asset.save(function (err) {
            if (err) {
                response.status(500).send({ err: err });
                return;
            }

            response.status(200).send({ message: "Asset successfully created", assetID: asset._id });
        })
    })

    ;


router.route('/email')
    .post(function (request, response) {
        Asset.findOne({ _id: request.body.id }, function (err, asset) {
            if (err) {
                response.status(500).send({ err: err });
                return;
            }

            if (!asset) {
                response.status(400).send({ message: "Cannot find Asset, rolling back" });
                return;
            }

            QRCode.toDataURL(asset._id.toString(), function (err, url) {
                if (err) {
                    response.status(500).send({ message: "couldn't generate QR code" });
                    return;
                }

                var body =
                    `<body style="background: whitesmoke; text-align: center">
                        <h1 style="color: #0275d8; font-family: Helvetica, Arial;">RepairMe No-Reply</h1>
                        <h2> Attached to this email is a QR code for signing up for the RepairMe service! </h2>
                        <h4> Alternatively, you are able to use this code: ${asset._id} to sign up for the service </h4>
                        <h2> Thank you for using RepairMe! </h2>
                     </body>
                    `;

                var mailOptions = {
                    to: request.body.toEmail,
                    subject: 'RepairMe - Sign Up Code.',
                    html: body,
                    attachments: [{
                        fileName: "qrcode.jpg",
                        path: url
                    }]
                };

                smtpTransport.sendMail(mailOptions, function (error, resp) {
                    if (error) {
                        console.log(error);
                        response.send(error);
                        return;
                    }
                    response.send({ success: true, message: "Sent Mail!" });
                });
            })
        });
    });

router.route("/updateBM")
    .put(function (request, response) {

        Asset.findOneAndUpdate({ _id: request.body.id }, { $push: { clientID: request.body.clientID } }, { new: true }, (err, asset) => {
            if (err) {
                response.status(500).send({ err: err });
                return;
            }
            // if(asset){
           // console.log(asset)

            response.status(200).send({ success: true, message: "Asset Updated w Client" });
            return;
            // }
            // else{
            //     response.status(400).send({success:false,message:'Asset Not Found'})
            //     return
            // }
        });
    })

router.route('/confirm')
    .get(function (request, response) {
        console.log("found query" + request.query.id)
        Asset.findOne({ _id: request.query.id }, function (err, asset) {
            if (err) {
                response.status(500).send({ err: err });
                return;
            }
            if (asset) {
                response.status(200).send({ success: true, message: "Asset found" });
                return
            }
            else {
                response.status(400).send({ success: false, message: "Asset not found" });
                return;
            }
        })
    })
    
    
module.exports = router;