import mongoose from "mongoose";

const totalIncomeSchema = new mongoose.Schema(
  {
    account_number: { type: String },
    user_id: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    address: { type: String },

    type: { type: String, required: true },
    package: {type: String},

    value: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

const TotalIncome = mongoose.model("TotalIncome", totalIncomeSchema);

export default TotalIncome;
