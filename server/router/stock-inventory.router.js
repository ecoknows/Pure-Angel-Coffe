import express from "express";
import expressAsyncHandler from "express-async-handler";
import UserVerification from "../models/user.verification.model.js";
import { checkIfAdmin, verifyUserToken } from "../utils.js";

let StockInventoryRouter = express.Router();

StockInventoryRouter.post(
  "/re-stock",
  verifyUserToken,
  checkIfAdmin,
  expressAsyncHandler(async (req, res) => {
    let user = await UserVerification.findOne({ user_id: req.user._id });

    if (user) {
      if (
        req.body.stock_coffee_b1t1 != undefined &&
        req.body.stock_coffee_b1t1 >= 0
      ) {
        user.stock_coffee_b1t1 = req.body.stock_coffee_b1t1;
      }

      if (
        req.body.stock_coffee_b2t3 != undefined &&
        req.body.stock_coffee_b2t3 >= 0
      ) {
        user.stock_coffee_b2t3 = req.body.stock_coffee_b2t3;
      }

      if (
        req.body.stock_soap_b1t1 != undefined &&
        req.body.stock_soap_b1t1 >= 0
      ) {
        user.stock_soap_b1t1 = req.body.stock_soap_b1t1;
      }

      if (
        req.body.stock_soap_b2t3 != undefined &&
        req.body.stock_soap_b2t3 >= 0
      ) {
        user.stock_soap_b2t3 = req.body.stock_soap_b2t3;
      }

      user.stock_coffee = user.stock_coffee_b1t1 + user.stock_coffee_b2t3;
      user.stock_soap = user.stock_soap_b1t1 + user.stock_soap_b2t3;

      await user.save();

      res.send({
        message: "Successfully Restock! Item",
      });
    } else {
      res.send({
        message: "Invalid User",
      });
    }
  })
);

export default StockInventoryRouter;
