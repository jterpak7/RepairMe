// models/client.js
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// create new instance of the mongoose.schema. the schema takes an
// object that shows the shape of your database entries.
const ClientSchema = new Schema({
  phoneNumber: String,
  email: String,
  firstName: String,
  lastName: String
});

// export our module to use in server.js
export default mongoose.model('Client', ClientSchema);