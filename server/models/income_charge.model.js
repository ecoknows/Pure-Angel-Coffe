import mongoose from "mongoose";

const incomeChargeSchema = new mongoose.Schema(
  {
    account_number: { type: String },
    user_id: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    address: { type: String },

    type: { type: String, required: true },
    value: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

const IncomeCharge = mongoose.model("IncomeCharge", incomeChargeSchema);

export default IncomeCharge;
