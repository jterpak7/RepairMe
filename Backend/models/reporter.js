// models/reporter.js
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// create new instance of the mongoose.schema. the schema takes an
// object that shows the shape of your database entries.
const ReporterSchema = new Schema({
  isTenant: Boolean,
  isBM: Boolean,
  accountID: {type: mongoose.Schema.Types.ObjectId, ref: 'Account'},
  assetID: {type: mongoose.Schema.Types.ObjectId, ref: 'Asset'}
});

// export our module to use in server.js
export default mongoose.model('Reporter', ReporterSchema);