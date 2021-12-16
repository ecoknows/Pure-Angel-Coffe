import UserVerification from "../models/user.verification.model.js";
import express from "express";
import expressAsyncHandler from "express-async-handler";
import User from "../models/user.model.js";

const FixerRouter = express.Router();

FixerRouter.get(
  "/verify/account-number",
  expressAsyncHandler(async (req, res) => {
    VerifyAccount();
    res.send({ message: "DONE!" });
  })
);

async function VerifyAccount() {
  const users = await User.find({});
  console.log("users : ", users.length);
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const user_verification = await UserVerification.findOne({
      user_id: user._id,
    });
    user_verification.account_number = user.account_number;

    await user_verification.save();
  }
}
export default FixerRouter;
