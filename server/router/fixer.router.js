import UserVerification from "../models/user.verification.model.js";
import express from "express";
import expressAsyncHandler from "express-async-handler";
import User from "../models/user.model.js";

const FixerRouter = express.Router();

FixerRouter.get(
  "/verify/account-number",
  expressAsyncHandler(async (req, res) => {
    const users_verification = await UserVerification.find({
      account_number: { $exists: false },
    });

    for (let i = 0; i < users_verification.length; i++) {
      const user = await User.findById(users_verification[i].user_id);

      // console.log("Users: ", users.length);

      const user_verification = await UserVerification.findById(
        users_verification[i]._id
      );

      user_verification.account_number = user.account_number;

      user_verification.save();
    }

    res.send({ message: users.length });
  })
);

async function VerifyAccount() {}
export default FixerRouter;
