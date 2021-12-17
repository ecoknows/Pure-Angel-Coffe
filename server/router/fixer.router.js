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
export default FixerRouter;
