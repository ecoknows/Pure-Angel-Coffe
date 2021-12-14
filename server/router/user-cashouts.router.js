import express from "express";
import expressAsyncHandler from "express-async-handler";
import Cashout from "../models/cashout.model.js";
import UserVerification from "../models/user.verification.model.js";
import { verifyUserToken } from "../utils.js";

const UserCashouts = express.Router();

UserCashouts.get(
  "/",
  verifyUserToken,
  expressAsyncHandler(async (req, res) => {
    const user = req.user;

    const cashouts = await Cashout.aggregate([{ $sort: { createdAt: -1 } }]);

    if (cashouts) {
      res.send({
        message: "Succesffully Fetch cashouts",
        data: cashouts,
      });
    } else {
      res.status(401).send({
        message: "You don't have cashouts yet....",
      });
    }
  })
);

UserCashouts.post(
  "/cashout",
  verifyUserToken,
  expressAsyncHandler(async (req, res) => {
    const body = req.body;
    const user = req.user;

    const userVerification = await UserVerification.findOne({
      user_id: user._id,
    });

    if (userVerification) {
      if (userVerification.unpaid_income >= body.amount) {
        const newCashout = new Cashout({
          user_id: user._id,
          account_number: user.account_number,

          first_name: user.first_name,
          last_name: user.last_name,
          address: user.address,
          contact_number: user.contact_number,

          amount: body.amount,
          mode_of_withdrawal: body.mode_of_withdrawal,
        });

        const createCashout = await newCashout.save();

        userVerification.unpaid_income =
          userVerification.unpaid_income - createCashout.amount;

        await userVerification.save();

        res.send({
          message: "Successfully Cashout money!",
        });
      } else {
        res.status(401).send({
          message: "Not enought money",
        });
      }
    } else {
      res.status(401).send({
        message: "UserVerification missing",
      });
    }
  })
);

export default UserCashouts;
