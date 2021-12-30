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

    const restock_coffee = req.body.restock_coffee;
    const restock_soap = req.body.restock_soap;

    if (user) {
      if (restock_coffee != undefined && restock_coffee >= 0) {
        user.stock_coffee = user.stock_coffee + restock_coffee;
      }

      if (restock_soap != undefined && restock_soap >= 0) {
        user.stock_soap = user.stock_soap + restock_soap;
      }

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
