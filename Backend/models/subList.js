// models/subList.js
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// create new instance of the mongoose.schema. the schema takes an
// object that shows the shape of your database entries.
const SubListSchema = new Schema({
  subcontractorID: {type: mongoose.Schema.Types.ObjectId, ref: 'Subcontractor'},
  openTicketID: {type: mongoose.Schema.Types.ObjectId, ref: 'OpenTicket'},
  completedTicketID: {type: mongoose.Schema.Types.ObjectId, ref: 'CompletedTicket'},
  contractPrice: Number,
  hourlyRate: Number,
  checkIn: Date,
  checkOut: Date,
  hoursWorked: Date
});

// export our module to use in server.js
export default mongoose.model('SubList', SubListSchema);