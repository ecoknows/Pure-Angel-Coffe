import mongoose from "mongoose";

const indirectReferralSchema = new mongoose.Schema({
  user_id: { type: String, required: true, index: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  address: { type: String },

  user_that_invite: {
    user_id: { type: String, required: true, index: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    address: { type: String },
  },

  user: {
    user_id: { type: String, required: true, index: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    address: { type: String },
  },

  income: { type: Number, default: 0 },
});

const IndirectReferral = mongoose.model(
  "IndirectReferral",
  indirectReferralSchema
);

export default IndirectReferral;
