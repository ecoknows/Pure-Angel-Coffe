import UserVerification from "../models/user.verification.model.js";
import express from "express";
import expressAsyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import {
  FixAERebatesB1T1Income,
  FixAERebatesB2T3Income,
  FixCoffeeIncome,
  FixNewMemberIncome,
  FixSoapIncome,
  FixStockistENB1T1Income,
  FixStockistENB2T3Income,
  FixStockistRepeatCoffeeIncome,
  FixStockistRepeatSoapIncome,
  FixUnpaidIncome,
  InitializeUser,
} from "../utils/fixer.js";
import PairingBonus from "../models/pairing-bonus.model.js";
import TotalIncome from "../models/total-income.model.js";
import CoffeeIncome from "../models/coffee-income.model.js";

const FixerRouter = express.Router();

FixerRouter.get(
  "/verify/account-number",
  expressAsyncHandler(async (req, res) => {
    const users_verification = await UserVerification.find({
      account_number: { $exists: false },
    });

    for (let i = 0; i < users_verification.length; i++) {
      const user = await User.findById(users_verification[i].user_id);

      const user_verification = await UserVerification.findById(
        users_verification[i]._id
      );

      user_verification.account_number = user.account_number;

      user_verification.save();
    }

    res.send({ message: "DONE!" });
  })
);

async function VerifyAccount() {
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
}

FixerRouter.post(
  "/verify/mega-center",
  expressAsyncHandler(async (req, res) => {
    UpdateMegaCenter(req);

    res.send({ message: "DONE!" });
  })
);

async function UpdateMegaCenter(req) {
  let body = req.body;
  let i = 1;

  const mega_center = await User.findOne({
    account_number: body.mega_center,
  });

  while (true) {
    const user = await UserVerification.updateOne(
      { account_number: body.area_code + "0" + i.toString() },
      {
        mega_center: {
          user_id: mega_center._id,
          account_number: mega_center.account_number,
          first_name: mega_center.first_name,
          last_name: mega_center.last_name,
        },
        area_code: body.area_code,
      }
    );

    if (user.modifiedCount == 0) {
      break;
    }

    i++;
  }
  console.log(
    "DONEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE"
  );
}

FixerRouter.get(
  "/verify/unpaid-income",
  expressAsyncHandler(async (req, res) => {
    const user = await UserVerification.find(
      {
        unpaid_income: { $gt: 0 },
      },
      { unpaid_income: 1, account_number: 1, _id: 0 }
    );

    res.send({ message: "DONE!", user });
  })
);

FixerRouter.post(
  "/verify/fix-income",
  InitializeUser,
  FixAERebatesB1T1Income,
  FixAERebatesB2T3Income,
  FixNewMemberIncome,
  FixCoffeeIncome,
  FixSoapIncome,
  FixStockistENB1T1Income,
  FixStockistENB2T3Income,
  FixStockistRepeatCoffeeIncome,
  FixStockistRepeatSoapIncome,
  FixUnpaidIncome,
  expressAsyncHandler(async (req, res) => {
    res.send({ message: "SUCCESSFULLY FIX INCOME!!" });
  })
);

FixerRouter.get(
  "/verify/pairing-bonus",
  expressAsyncHandler(async (req, res) => {
    const pairing = await PairingBonus.find({});

    if (pairing) {
      for (let i = 0; i < pairing.length; i++) {
        const change = await PairingBonus.findById(pairing[i]._id);
        change.value = 300;
        await change.save();
      }
    }
    res.send({ message: "SUCCESSFULLY FIX Pairing!!" });
  })
);


FixerRouter.get(
  "/income/coffee-income",
  expressAsyncHandler(async (req, res) => {
    const total_incomes = await TotalIncome.find({
      type: 'Coffee Income'
    });

    if (total_incomes) {
      for (let i = 0; i < total_incomes.length; i++) {
        const coffee_income = await CoffeeIncome.findById(total_incomes[i]._id);

        const total_income = await TotalIncome.findById(total_incomes[i]._id);

        total_income.package = coffee_income.package;
        await total_income.save();
      }
    }
    res.send({ message: "SUCCESSFULLY FIX Pairing!!" });
  })
);


export default FixerRouter;
