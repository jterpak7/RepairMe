// models/subcontractor.js
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// create new instance of the mongoose.schema. the schema takes an
// object that shows the shape of your database entries.
const SubcontractorSchema = new Schema({
  accountID: {type: mongoose.Schema.Types.ObjectId, ref: 'Account'},
  contractorBelongingTo: {type:mongoose.Schema.Types.ObjectId, ref: 'Contractor'},
  phoneNumber: String,
  email: String,
  firstName: String,
  lastName: String
});

// export our module to use in server.js
export default mongoose.model('Subcontractor', SubcontractorSchema);