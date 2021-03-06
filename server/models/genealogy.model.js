import mongoose from "mongoose";

const genealogySchema = new mongoose.Schema(
  {
    user_id: { type: String, index: true },

    account_number: { type: String, index: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },

    left_count: { type: Number, default: 0 },
    right_count: { type: Number, default: 0 },

    user_that_invite: {
      user_id: { type: String, index: true },
      first_name: { type: String },
      last_name: { type: String },
      address: { type: String },
    },

    left_branch: {
      type: {
        user_id: { type: String, index: true },

        account_number: { type: String, index: true },
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },

        left_count: { type: Number, default: 0 },
        right_count: { type: Number, default: 0 },

        user_that_invite: {
          user_id: { type: String, index: true },
          first_name: { type: String },
          last_name: { type: String },
          address: { type: String },
        },

        is_stockist: { type: Boolean },
        is_admin: { type: Boolean },
        is_mega_center: { type: Boolean },
        is_owner: { type: Boolean },

        left_branch: { type: Object },
        right_branch: { type: Object },
      },
    },

    right_branch: {
      type: {
        user_id: { type: String, index: true },

        account_number: { type: String, index: true },
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },

        left_count: { type: Number, default: 0 },
        right_count: { type: Number, default: 0 },

        user_that_invite: {
          user_id: { type: String, index: true },
          first_name: { type: String },
          last_name: { type: String },
          address: { type: String },
        },

        is_stockist: { type: Boolean },
        is_admin: { type: Boolean },
        is_mega_center: { type: Boolean },
        is_owner: { type: Boolean },

        left_branch: { type: Object },
        right_branch: { type: Object },
      },
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

const Genealogy = mongoose.model("Genealogy", genealogySchema);

export default Genealogy;
