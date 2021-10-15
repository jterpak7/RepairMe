// models/openTicket.js
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import mongoosePaginate from 'mongoose-paginate';

// create new instance of the mongoose.schema. the schema takes an
// object that shows the shape of your database entries.
const OpenTicketSchema = new Schema({
  AssetID: {type: mongoose.Schema.Types.ObjectId, ref: 'Asset'},
  UserID: {type: mongoose.Schema.Types.ObjectId, ref: 'Account'},
  Bids: [{SubId: String, Price: String, Hourly: Boolean, Fixed: Boolean, ExpectedHours: Number, FirstHour: Number, SubsequentHours: Number, MaterialsIncludedInPrice: Boolean}],
  image: String,
  title: String,
  thumbnail: String,
  description: String,
  descSentiment: Number,
  buckets: [String],
  category: {type: mongoose.Schema.Types.ObjectId, ref: 'Category'},
  ticketState: String,
  timeOpened: Date,
  acceptorID: {type: mongoose.Schema.Types.ObjectId, ref: 'Account'},
  contractorID: {type: mongoose.Schema.Types.ObjectId, ref: 'Account'},
  timeAccepted: Date,
  subcontractorID: {type: mongoose.Schema.Types.ObjectId, ref: 'Account'},
  timeSubbed: Date,
  timeStarted: Date,
  timeEnded: Date,
  labour: Number,
  materials: [Object],
  comments: [String],
  commenterID: [String],
  timeReviewable: Date
});

OpenTicketSchema.index({description: 'text', category: 'text', ticketState: 'text', buckets: 'text'});

OpenTicketSchema.plugin(mongoosePaginate);

// export our module to use in server.js
export default mongoose.model('OpenTicket', OpenTicketSchema);

/*
what are our states?
-
-
-
Open - on the marketplace or assigned to a subcontracter
In Progress - started by a subcontractor
Completed - finished by a contractor

*/