import express from "express";
import expressAsyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import { checkIfAdmin, verifyUserToken } from "../utils.js";

import {
  initializeAccount,
  checkStock,
  updateAdminStock,
  updatePin,
  updateStock,
} from "../middlewares/create-new-pin.js";
import UserVerification from "../models/user.verification.model.js";

let CreateNewPinRouter = express.Router();

CreateNewPinRouter.post(
  "/search-account",
  verifyUserToken,
  expressAsyncHandler(async (req, res) => {
    const searched_account = await User.findOne({
      account_number: req.body.account_number,
    });

    if (
      (searched_account && searched_account.is_mega_center) ||
      searched_account.is_stockist
    ) {
      const user_verification = await UserVerification.findOne({
        user_id: searched_account._id,
      });

      res.send({
        message: "Successfully Search Account",
        data: {
          user: searched_account,
          user_verification,
        },
      });
    } else {
      res.status(404).send({ message: "That Account is Invalid" });
    }
  })
);

CreateNewPinRouter.post(
  "/assign-pin",
  verifyUserToken,
  checkIfAdmin,
  initializeAccount,
  checkStock,
  updatePin,
  updateStock,
  updateAdminStock,
  expressAsyncHandler(async (req, res) => {
    res.send({ message: "Successfully Updated PIN!" });
  })
);

export default CreateNewPinRouter;
