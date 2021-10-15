// models/client.js
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// create new instance of the mongoose.schema. the schema takes an
// object that shows the shape of your database entries.
const ChatSchema = new Schema({
  ticketID: {type: mongoose.Schema.Types.ObjectId, ref: 'OpenTicket'},
  messages:[Object],
  asset: {type: mongoose.Schema.Types.ObjectId, ref: 'Assets'},
  tenantID: {type: mongoose.Schema.Types.ObjectId, ref: 'Account'},
  subcontractorID: {type: mongoose.Schema.Types.ObjectId, ref: 'Account'},
  newForAsset:Boolean,
  newForTenant:Boolean,
  newForSubcontractor:Boolean,
  messagesHash:String
});

// export our module to use in server.js
export default mongoose.model('Chat', ChatSchema);

/*
{
    _id: 0,
    name: "Tenant",
},
{
    _id: 1,
    name: "Contractor",
},
{
    _id: 2,
    name: "Building Manager",
}
*/