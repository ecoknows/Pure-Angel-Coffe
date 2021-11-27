import express from "express";
import expressAsyncHandler from "express-async-handler";
import {
  initializeNewOrder,
  orderStock,
  createPurchase,
  purchaseIncome,
  automaticEquivalentRebatesIncome,
  stockistRepeatPurchase,
  stockistEncodeNewOrder,
  updateStock,
} from "../middlewares/new-order.js";
import User from "../models/user.model.js";
import { checkIfAdminStockMega, verifyUserToken } from "../utils.js";

let NewOrderRouter = express.Router();

NewOrderRouter.post(
  "/search-account",
  verifyUserToken,
  expressAsyncHandler(async (req, res) => {
    const user = req.user;
    const user_search = await User.findOne({
      account_number: req.body.account_number,
    });

    if (user_search) {
      let mega_center_user,
        referral_user = undefined;

      if (user_search.is_stockist) {
        mega_center_user = await User.findOne({
          secret_code_suffix: user_search.secret_code_suffix,
          is_mega_center: true,
        });
        if (user.is_stockist) {
          referral_user = mega_center_user;
        }
      } else {
        if (user.is_stockist) {
          mega_center_user = await User.findOne({
            secret_code_suffix: user_search.secret_code_suffix,
            is_mega_center: true,
          });
        }
        referral_user = await User.findById(
          user_search.user_that_invite.user_id
        );
      }

      res.send({
        message: "Successfully Search User",
        data: { user: user_search, referral_user, mega_center_user },
      });
    } else {
      res.status(401).send({
        message: "Cannot find users!",
      });
    }
  })
);

NewOrderRouter.post(
  "/order",
  verifyUserToken,
  checkIfAdminStockMega,
  initializeNewOrder,
  orderStock,
  updateStock,

  createPurchase,
  purchaseIncome,
  automaticEquivalentRebatesIncome,
  stockistRepeatPurchase,
  stockistEncodeNewOrder,

  expressAsyncHandler(async (req, res) => {
    res.send({ message: "Successfully Ordered!" });
  })
);

export default NewOrderRouter;
