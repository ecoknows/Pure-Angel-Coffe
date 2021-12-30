import { WITHDRAWAL_CHARGE } from "../constants.js";
import express from "express";
import expressAsyncHandler from "express-async-handler";
import Cashout from "../models/cashout.model.js";
import UserVerification from "../models/user.verification.model.js";
import { verifyUserToken, checkIfAdmin } from "../utils.js";
import Admin from "../models/admin.model.js";
import moment from "moment";

const UserCashouts = express.Router();

UserCashouts.get(
  "/",
  verifyUserToken,
  expressAsyncHandler(async (req, res) => {
    const user = req.user;

    const cashouts = await Cashout.aggregate([{ $sort: { createdAt: -1 } }]);

    if (cashouts) {
      res.send({
        message: "Succesfully Fetch cashouts",
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
  "/approve-cashout",
  verifyUserToken,
  checkIfAdmin,
  expressAsyncHandler(async (req, res) => {
    const old_cashout = req.body.cashout;
    const remark = req.body.remark;

    const cashout = await Cashout.findById(old_cashout._id);

    if (cashout) {
      cashout.is_claimed = !old_cashout.is_claimed;
      cashout.remark = remark;
      cashout.date_claimed = moment();

      const updated_cashout = await cashout.save();
      if (updated_cashout.is_claimed) {
        res.send({
          message: "Succesffully Approve Cashout!",
        });
      } else {
        res.send({
          message: "Succesffully Reapprove Cashout!",
        });
      }
    } else {
      res.status(401).send({
        message: "Failed to Approve Cashout",
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
          withdrawal_charge: WITHDRAWAL_CHARGE,
          mode_of_withdrawal: body.mode_of_withdrawal,
        });

        const createCashout = await newCashout.save();

        const adminStorage = await Admin.findOne({
          account_number: "EDTESS",
        });

        adminStorage.withdrawal_charge_income =
          adminStorage.withdrawal_charge_income + WITHDRAWAL_CHARGE;

        userVerification.unpaid_income =
          userVerification.unpaid_income -
          (createCashout.amount + WITHDRAWAL_CHARGE);

        await userVerification.save();
        await adminStorage.save();

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
