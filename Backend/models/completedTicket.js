// models/completedTicket.js
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// create new instance of the mongoose.schema. the schema takes an
// object that shows the shape of your database entries.
const CompletedTicketSchema = new Schema({
  AssetID: {type: mongoose.Schema.Types.ObjectId, ref: 'Asset'},
  image: String,
  description: String,
  ticketState: String,
  timeOpened: String,
  acceptorID: {type: mongoose.Schema.Types.ObjectId, ref: 'Account'},
  contractorID: {type: mongoose.Schema.Types.ObjectId, ref: 'Account'},
  timeAccepted: Date,
  timeSubbed: Date,
  comments: [String],
  commenterID: [String],
  timeReviewable: Date,
  // invoiceID: TO DO
  cost: Number,
  timeCompleted: Date
});

// export our module to use in server.js
export default mongoose.model('CompletedTicket', CompletedTicketSchema);