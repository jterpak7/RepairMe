//This table is for storing all the sessions that are currently active, it maps user ID to a nonce that is specific to the session

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

var sessionSchema = new Schema(
    {
        userID: { type: String, unique: true },
        type: String, //type is whether the user is a Tenant, BM or Subcontractor
        token: String,
    }
);

export default mongoose.model('Session', sessionSchema);