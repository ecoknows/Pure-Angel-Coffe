import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    account_number: { type: String, required: true, index: true },
    withdrawal_charge_income: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
