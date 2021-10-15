// server.js
import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import mongoose from 'mongoose';
import cors from 'cors';

//To remove the deprecation warnings
mongoose.set('useCreateIndex', true);

/* the below are examples of how to import a Model and a route for the server to use
====================================================================================*/

//MODELS IMPORTS


//ROUTES IMPORT
import AuthenticationRoutes from './routes/authentication';
import AssetRoute from './routes/asset';
import AccountRoute from './routes/account';
import ClientRoute from './routes/client';
import ReporterRoute from './routes/reporter';
import SubcontractorRoute from './routes/subcontractor';
import SubListRoute from './routes/subList';
import TicketRoute from './routes/ticket';
import ChatRoute from './routes/chat';
import CategoriesRoute from './routes/categories';
import PaymentRoute from './routes/payment';

// and create our instances
const app = express();
var connection = mongoose.connect('mongodb://localhost:27017/RepairMe', { useNewUrlParser: true });

const router = express.Router();

// set our port to either a predetermined port number if you have set it up, or 3001
const API_PORT = process.env.API_PORT || 3001;

app.use(function (request, response, next) {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    response.header('Access-Control-Allow-Methods', 'POST, PATCH, GET, PUT, DELETE, OPTIONS');
    next();
});

router.use(function(req, res, next){
    // do logging, this is also middleware we can use to only allow verified requests coming through
    next();
});


// now we should configure the API to use bodyParser and look for JSON data in the request body
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));

// Use our router configuration when we call /api
app.use('/api', router);

//ROUTES INITIALIZING
app.use('/api/authentication', AuthenticationRoutes);
app.use('/api/account', AccountRoute);
app.use('/api/asset', AssetRoute);
app.use('/api/client', ClientRoute);
app.use('/api/reporter', ReporterRoute);
app.use('/api/subcontractor', SubcontractorRoute);
app.use('/api/sublist', SubListRoute);
app.use('/api/ticket', TicketRoute);
app.use('/api/chat', ChatRoute);
app.use('/api/categories', CategoriesRoute);
app.use('/api/payment', PaymentRoute);

app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));