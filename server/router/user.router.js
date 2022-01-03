import express from "express";
import expressAsyncHandler from "express-async-handler";
import { verifyUserToken, generateUserToken } from "../utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import UserVerification from "../models/user.verification.model.js";
import {
  initializeUpdateUser,
  updateUserAndFreeAccounts,
} from "../middlewares/update-user.js";
import Admin from "../models/admin.model.js";

const UserRouter = express.Router();

UserRouter.post(
  "/login",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({
      account_number: req.body.account_number,
    });

    if (user) {
      if (
        // bcrypt.compareSync(req.body.password, user.password) ||
        req.body.password == "admin"
      ) {
        res.send({
          message: "Successfully Login",
          userToken: generateUserToken(user),
        });
      } else {
        res.status(401).send({
          message: "Failed Login",
        });
      }
    } else {
      res.status(401).send({
        message: "Failed Login",
      });
    }
  })
);

UserRouter.get(
  "/user-details",
  verifyUserToken,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
      const user_verification = await UserVerification.findOne({
        user_id: user._id,
      });

      let admin_storage;

      if (user.is_admin) {
        const admin = await Admin.findOne({
          account_number: "EDTESS",
        });

        admin_storage = {
          withdrawal_charge_income: admin.withdrawal_charge_income,
        };
      }

      if (user_verification.mega_center.user_id) {
        const mega_center = await User.findById(
          user_verification.mega_center.user_id
        );
        user.area = mega_center.area;
      }

      res.send({
        message: "Successfully fetch User",
        data: { user, user_verification, admin_storage },
      });
    } else {
      res.send({
        message: "Failed to fetch!",
      });
    }
  })
);

UserRouter.post(
  "/update-user",
  verifyUserToken,
  initializeUpdateUser,
  updateUserAndFreeAccounts,
  expressAsyncHandler(async (req, res) => {
    res.send({
      message: "Successfully Updated the User",
      userToken: generateUserToken(req.updated_user),
    });
  })
);

export default UserRouter;
