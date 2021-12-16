import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    account_number: { type: String, index: true },
    password: { type: String, index: true },
    temporary_password: { type: String },
    user_number: { type: Number },

    first_name: { type: String, required: true, index: true },
    last_name: { type: String, required: true, index: true },
    address: { type: String, index: true },
    birthdate: { type: String, index: true },
    contact_number: { type: String, required: true, index: true },

    secret_code_suffix: { type: String, required: true },

    ending_pin: { type: Number },
    number_of_pin: { type: Number },

    free_account_leader: { type: Number },

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

    is_stockist: { type: Boolean },
    is_admin: { type: Boolean },
    is_mega_center: { type: Boolean },
    is_owner: { type: Boolean, index: true },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
