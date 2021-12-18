import express from "express";
import expressAsyncHandler from "express-async-handler";
import {
  initializeUpgradeAccount,
  updateGenealogy,
  upgradeToMegaCenter,
  upgradeToMember,
  upgradeToStockist,
} from "../middlewares/upgrade-account.js";
import User from "../models/user.model.js";
import { checkIfAdmin, verifyUserToken } from "../utils.js";

let UpgradeAccountRouter = express.Router();

UpgradeAccountRouter.post(
  "/search-account",
  verifyUserToken,
  expressAsyncHandler(async (req, res) => {
    const searched_account = await User.findOne({
      account_number: req.body.account_number,
    });
    if (searched_account) {
      res.send({
        message: "Successfully Search Account",
        data: searched_account,
      });
    } else {
      res.status(404).send({ message: "That Account is Invalid" });
    }
  })
);

UpgradeAccountRouter.get(
  "/search-mega-centers",
  verifyUserToken,
  expressAsyncHandler(async (req, res) => {
    const mega_centers = await User.find({
      is_mega_center: true,
    });
    if (mega_centers) {
      res.send({
        message: "Successfully Fetch Mega Centers",
        data: mega_centers,
      });
    } else {
      res.status(404).send({ message: "Cannot find megacenters" });
    }
  })
);

UpgradeAccountRouter.post(
  "/upgrade",
  verifyUserToken,
  checkIfAdmin,
  initializeUpgradeAccount,
  upgradeToMegaCenter,
  upgradeToStockist,
  upgradeToMember,
  updateGenealogy,
  expressAsyncHandler(async (req, res) => {
    res.send({
      message: "Successfully Upgrade Account!",
    });
  })
);

export default UpgradeAccountRouter;
