import mongoose from "mongoose";

const cashoutSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true },
    account_number: { type: String, required: true },

    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    address: { type: String },
    contact_number: { type: String, required: true },

    amount: { type: Number, required: true },
    withdrawal_charge: { type: Number },
    is_claimed: { type: Boolean, default: false },
    mode_of_withdrawal: { type: String },
  },
  {
    timestamps: true,
  }
);

const Cashout = mongoose.model("Cashout", cashoutSchema);

export default Cashout;
