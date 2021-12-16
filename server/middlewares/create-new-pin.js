import PinGiving from "../models/pin-giving.model.js";
import { COFFEE_PACKAGE_PER_PIN, SOAP_PACKAGE_PER_PIN } from "../constants.js";
import User from "../models/user.model.js";
import UserVerification from "../models/user.verification.model.js";

export async function initializeAccount(req, res, next) {
  const body = req.body;
  const user = req.user;

  const searched_account = await User.findOne({
    account_number: body.account_number,
  });

  const verification_account = await UserVerification.findOne({
    user_id: searched_account._id,
  });

  const admin_user = await UserVerification.findOne({
    user_id: user._id,
  });

  if (
    searched_account &&
    verification_account &&
    (searched_account.is_mega_center ||
      searched_account.is_admin ||
      searched_account.is_stockist)
  ) {
    req.searched_account = searched_account;
    req.verification_account = verification_account;
    req.number_of_pin = req.body.number_of_pin;
    req.admin_user = admin_user;
    req.total_income = 0;

    next();
  } else {
    res.status(404).send({ message: "Invalid Account...." });
  }
}

export async function checkStock(req, res, next) {
  const number_of_pin = req.number_of_pin;
  const admin_user = req.admin_user;

  if (admin_user) {
    if (
      admin_user.stock_coffee >= COFFEE_PACKAGE_PER_PIN * number_of_pin &&
      admin_user.stock_soap >= SOAP_PACKAGE_PER_PIN * number_of_pin
    ) {
      next();
    } else {
      res.status(404).send({ message: "Please restock product is empty..." });
    }
  } else {
    res.status(404).send({ message: "Cannot find user..." });
  }
}

export async function updatePin(req, res, next) {
  const searched_account = req.searched_account;
  const number_of_pin = req.number_of_pin;

  searched_account.number_of_pin = searched_account.number_of_pin
    ? searched_account.number_of_pin + number_of_pin
    : number_of_pin;

  if (searched_account.ending_pin == undefined) {
    searched_account.ending_pin = 0;
  }

  await searched_account.save();

  next();
}

export async function updateStock(req, res, next) {
  const searched_account = req.searched_account;
  const verification_account = req.verification_account;
  const number_of_pin = req.number_of_pin;
  const total_coffee_added = number_of_pin * COFFEE_PACKAGE_PER_PIN;
  const total_soap_added = number_of_pin * SOAP_PACKAGE_PER_PIN;

  verification_account.pin_stock_coffee = verification_account.pin_stock_coffee
    ? verification_account.pin_stock_coffee + total_coffee_added
    : total_coffee_added;

  verification_account.pin_stock_soap = verification_account.pin_stock_soap
    ? verification_account.pin_stock_soap + total_soap_added
    : total_soap_added;

  verification_account.stock_coffee = verification_account.stock_coffee
    ? verification_account.stock_coffee + total_coffee_added
    : total_coffee_added;

  verification_account.stock_soap = verification_account.stock_soap
    ? verification_account.stock_soap + total_soap_added
    : total_soap_added;

  await createPinGiving(
    req.user,
    searched_account,
    number_of_pin,
    total_coffee_added,
    total_soap_added
  );

  await verification_account.save();

  next();
}

export async function updateAdminStock(req, res, next) {
  const admin_user = req.admin_user;
  const number_of_pin = req.number_of_pin;
  const total_coffee_added = number_of_pin * COFFEE_PACKAGE_PER_PIN;
  const total_soap_added = number_of_pin * SOAP_PACKAGE_PER_PIN;

  admin_user.stock_coffee = admin_user.stock_coffee - total_coffee_added;
  admin_user.stock_soap = admin_user.stock_soap - total_soap_added;

  await admin_user.save();

  next();
}

async function createPinGiving(
  user,
  recipient,
  quantity,
  coffee_quantity,
  soap_quantity
) {
  const pinGiving = new PinGiving({
    account_number: user.account_number,
    user_id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    address: user.address,

    recipient: {
      account_number: recipient.account_number,
      user_id: recipient._id,
      first_name: recipient.first_name,
      last_name: recipient.last_name,
      address: recipient.address,
    },

    quantity: quantity,
    soap_quantity: soap_quantity,
    coffee_quantity: coffee_quantity,
  });

  await pinGiving.save();
}
