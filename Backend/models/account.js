// models/account.js
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// create new instance of the mongoose.schema. the schema takes an
// object that shows the shape of your database entries.
const AccountSchema = new Schema({
  username: String,
  hashedPassword: String,
  stripeID: String,
  salt: String,
  isContractor: Boolean,
  contractorID: {type: mongoose.Schema.Types.ObjectId, ref: 'Contractor'},
  isSubcontractor: Boolean,
  subContractor: {type: mongoose.Schema.Types.ObjectId, ref: 'Subcontractor'},
  isBM: Boolean,
  isTenant: Boolean,
  firstName: String,
  lastName: String,
  email: String,
  phoneNumber: String,
  assetID: {type: mongoose.Schema.Types.ObjectId, ref: 'Asset'},
});

// export our module to use in server.js
export default mongoose.model('Account', AccountSchema);