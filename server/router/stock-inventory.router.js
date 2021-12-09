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
        req.body.restock_coffee != undefined &&
        req.body.restock_coffee >= 0
      ) {
        user.stock_coffee = req.body.restock_coffee;
      }

      if (req.body.restock_soap != undefined && req.body.restock_soap >= 0) {
        user.stock_soap = req.body.restock_soap;
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
