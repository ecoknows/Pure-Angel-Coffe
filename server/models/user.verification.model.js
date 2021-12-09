import mongoose from "mongoose";

const userVerificationSchema = new mongoose.Schema(
  {
    account_number: { type: String },

    user_id: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    address: { type: String },
    birthdate: { type: String },

    secret_code: { type: String },

    verified: { type: Boolean, default: true },

    direct_referral: { type: Number, default: 0 },
    indirect_referral: { type: Number, default: 0 },
    pairing_bonus: { type: Number, default: 0 },
    automatic_equivalent_rebates: { type: Number, default: 0 },

    overall_income: { type: Number, default: 0 },
    unpaid_income: { type: Number, default: 0 },

    pairing_bonus_paired_count: { type: Number, default: 0 },
    starting_date_of_first_paired: { type: Date },
    product_voucher: { type: Number, default: 0 },

    stock_coffee: { type: Number },
    stock_soap: { type: Number },

    pin_stock_coffee: { type: Number },
    pin_stock_soap: { type: Number },

    stock_coffee_b1t1: { type: Number },
    stock_soap_b1t1: { type: Number },

    stock_coffee_b2t3: { type: Number },
    stock_soap_b2t3: { type: Number },

    number_of_members: { type: Number },
    number_of_stockist: { type: Number },
    number_of_mega_center: { type: Number },

    new_member_income: { type: Number },

    b1t1_ae_rebates: { type: Number, default: 0 },
    b2t3_ae_rebates: { type: Number, default: 0 },

    coffee_income: { type: Number },
    soap_income: { type: Number },

    b1t1_stockist_encode_new_order: { type: Number },
    b2t3_stockist_encode_new_order: { type: Number },

    stockist_repeat_purchase_coffee: { type: Number },
    stockist_repeat_purchase_soap: { type: Number },

    system: {
      payment: { type: Number },
    },

    mega_center: {
      user_id: { type: String, index: true },
      first_name: { type: String },
      last_name: { type: String },
    },

    root_user_genealogy: {
      user_id: { type: String, index: true },
      first_name: { type: String },
      last_name: { type: String },
      address: { type: String },
      position: { type: String },
    },

    user_that_invite: {
      user_id: { type: String, index: true },
      first_name: { type: String },
      last_name: { type: String },
      address: { type: String },
    },

    indirect_referral_user: {
      user_id: { type: String, index: true },
      first_name: { type: String },
      last_name: { type: String },
      address: { type: String },
    },

    is_stockist: { type: Boolean },
    is_admin: { type: Boolean },
    is_mega_center: { type: Boolean },
    is_owner: { type: Boolean },
  },
  {
    timestamps: true,
  }
);

const UserVerification = mongoose.model(
  "UserVerification",
  userVerificationSchema
);

export default UserVerification;
