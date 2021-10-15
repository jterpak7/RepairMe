// models/asset.js
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// create new instance of the mongoose.schema. the schema takes an
// object that shows the shape of your database entries.
const AssetsSchema = new Schema({
  clientID: [{type: mongoose.Schema.Types.ObjectId, ref: 'Client'}],
  address: String,
  city: String,
  postalCode: String,
  contractors: [{type: mongoose.Schema.Types.ObjectId, ref: 'Contractor'}],
  tickets: [{type: mongoose.Schema.Types.ObjectId, ref: 'Ticket'}]
});

// export our module to use in server.js
export default mongoose.model('Assets', AssetsSchema);