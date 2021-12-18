import UserVerification from "../models/user.verification.model.js";
import { INCOME_CHARGE } from "../constants.js";
import CoffeeIncome from "../models/coffee-income.model.js";
import SoapIncome from "../models/soap-income.model.js";
import NewMemberIncome from "../models/new-member-income.model.js";
import AutomaticEquivalentRebates from "../models/automatic-equivalent-rebates.model.js";
import StockistEncodeNewOrder from "../models/stockist-encode-new-order.model.js";
import CoffeeStockistRepeatPurchase from "../models/coffee-stockist-repeat-purchase.model.js";
import SoapStockistRepeatPurchase from "../models/soap-stockist-repeat-purchase.model.js";
import IndirectReferral from "../models/indirect-referral.model.js";
import PairingBonus from "../models/pairing-bonus.model.js";
import DirectReferral from "../models/direct-referral.model.js";

export async function InitializeUser(req, res, next) {
  const body = req.body;

  const user_verification = await UserVerification.findOne({
    account_number: body.account_number,
  });

  if (user_verification) {
    req.user_verification = user_verification;
    next();
  } else {
    res.status(401).send({ message: "Cannot find user" });
  }
}

export async function FixAERebatesB2T3Income(req, res, next) {
  const body = req.body;
  const user_verification = req.user_verification;

  const aeRebatesB2T3 = await AutomaticEquivalentRebates.find({
    account_number: body.account_number,
    package: "b2t3",
  });

  if (aeRebatesB2T3.length != 0) {
    let result = 0;
    let charge_result = 0;

    for (let i = 0; i < aeRebatesB2T3.length; i++) {
      const value = aeRebatesB2T3[i].value;

      result += value;
      charge_result += value - value * INCOME_CHARGE;
    }

    if (result == user_verification.b2t3_ae_rebates) {
      user_verification.b2t3_ae_rebates = charge_result;
      const updated_user_verification = await user_verification.save();
      req.user_verification = updated_user_verification;
      next();
    } else {
      // res.send({ message: "ERROR!! AE Rebates B2T3 Income" });
      next();
    }
  } else {
    next();
  }
}

export async function FixAERebatesB1T1Income(req, res, next) {
  const body = req.body;
  const user_verification = req.user_verification;

  const aeRebatesB1T1 = await AutomaticEquivalentRebates.find({
    account_number: body.account_number,
    package: "b1t1",
  });

  if (aeRebatesB1T1.length != 0) {
    let result = 0;
    let charge_result = 0;

    for (let i = 0; i < aeRebatesB1T1.length; i++) {
      const value = aeRebatesB1T1[i].value;

      result += value;
      charge_result += value - value * INCOME_CHARGE;
    }

    if (result == user_verification.b1t1_ae_rebates) {
      user_verification.b1t1_ae_rebates = charge_result;
      const updated_user_verification = await user_verification.save();
      req.user_verification = updated_user_verification;
      next();
    } else {
      // res.send({ message: "ERROR!! AE Rebates B1T1 Income" });
      next();
    }
  } else {
    next();
  }
}

export async function FixNewMemberIncome(req, res, next) {
  const body = req.body;
  const user_verification = req.user_verification;

  const newMemberIncome = await NewMemberIncome.find({
    account_number: body.account_number,
  });

  if (newMemberIncome.length != 0) {
    let result = 0;
    let charge_result = 0;

    for (let i = 0; i < newMemberIncome.length; i++) {
      const value = newMemberIncome[i].value;

      result += value;
      charge_result += value - value * INCOME_CHARGE;
    }

    if (result == user_verification.new_member_income) {
      user_verification.new_member_income = charge_result;
      const updated_user_verification = await user_verification.save();
      req.user_verification = updated_user_verification;
      next();
    } else {
      // res.send({ message: "ERROR!! New Member Income" });
      next();
    }
  } else {
    next();
  }
}

export async function FixCoffeeIncome(req, res, next) {
  const body = req.body;
  const user_verification = req.user_verification;

  const coffeeIncome = await CoffeeIncome.find({
    account_number: body.account_number,
  });

  if (coffeeIncome.length != 0) {
    let result = 0;
    let charge_result = 0;

    for (let i = 0; i < coffeeIncome.length; i++) {
      const value = coffeeIncome[i].value;

      result += value;
      charge_result += value - value * INCOME_CHARGE;
    }

    if (result == user_verification.coffee_income) {
      user_verification.coffee_income = charge_result;
      const updated_user_verification = await user_verification.save();
      req.user_verification = updated_user_verification;
      next();
    } else {
      // res.send({ message: "ERROR!! Coffee Income" });
      next();
    }
  } else {
    next();
  }
}

export async function FixSoapIncome(req, res, next) {
  const body = req.body;
  const user_verification = req.user_verification;

  const soapIncome = await SoapIncome.find({
    account_number: body.account_number,
  });

  if (soapIncome.length != 0) {
    let result = 0;
    let charge_result = 0;

    for (let i = 0; i < soapIncome.length; i++) {
      const value = soapIncome[i].value;

      result += value;
      charge_result += value - value * INCOME_CHARGE;
    }

    if (result == user_verification.soap_income) {
      user_verification.soap_income = charge_result;
      const updated_user_verification = await user_verification.save();
      req.user_verification = updated_user_verification;
      next();
    } else {
      // res.send({ message: "ERROR!! Soap Income" });
      next();
      next();
    }
  } else {
    next();
  }
}

export async function FixStockistENB1T1Income(req, res, next) {
  const body = req.body;
  const user_verification = req.user_verification;

  const stockistEncodeNewOrder = await StockistEncodeNewOrder.find({
    account_number: body.account_number,
    package: "b1t1",
  });

  if (stockistEncodeNewOrder.length != 0) {
    let result = 0;
    let charge_result = 0;

    for (let i = 0; i < stockistEncodeNewOrder.length; i++) {
      const value = stockistEncodeNewOrder[i].value;

      result += value;
      charge_result += value - value * INCOME_CHARGE;
    }

    if (result == user_verification.b1t1_stockist_encode_new_order) {
      user_verification.b1t1_stockist_encode_new_order = charge_result;
      const updated_user_verification = await user_verification.save();
      req.user_verification = updated_user_verification;
      next();
    } else {
      // res.send({ message: "ERROR!! StockistENB1T1 Income" });
      next();
    }
  } else {
    next();
  }
}

export async function FixStockistENB2T3Income(req, res, next) {
  const body = req.body;
  const user_verification = req.user_verification;

  const stockistEncodeNewOrder = await StockistEncodeNewOrder.find({
    account_number: body.account_number,
    package: "b2t3",
  });

  if (stockistEncodeNewOrder.length != 0) {
    let result = 0;
    let charge_result = 0;

    for (let i = 0; i < stockistEncodeNewOrder.length; i++) {
      const value = stockistEncodeNewOrder[i].value;

      result += value;
      charge_result += value - value * INCOME_CHARGE;
    }

    if (result == user_verification.b2t3_stockist_encode_new_order) {
      user_verification.b2t3_stockist_encode_new_order = charge_result;
      const updated_user_verification = await user_verification.save();
      req.user_verification = updated_user_verification;
      next();
    } else {
      // res.send({ message: "ERROR!! StockistENB2T3 Income" });
      next();
    }
  } else {
    next();
  }
}

export async function FixStockistRepeatCoffeeIncome(req, res, next) {
  const body = req.body;
  const user_verification = req.user_verification;

  const coffeeStockistRepeatPurchase = await CoffeeStockistRepeatPurchase.find({
    account_number: body.account_number,
  });

  if (coffeeStockistRepeatPurchase.length != 0) {
    let result = 0;
    let charge_result = 0;

    for (let i = 0; i < coffeeStockistRepeatPurchase.length; i++) {
      const value = coffeeStockistRepeatPurchase[i].value;

      result += value;
      charge_result += value - value * INCOME_CHARGE;
    }

    if (result == user_verification.stockist_repeat_purchase_coffee) {
      user_verification.stockist_repeat_purchase_coffee = charge_result;
      const updated_user_verification = await user_verification.save();
      req.user_verification = updated_user_verification;
      next();
    } else {
      // res.send({ message: "ERROR!! StockistRPCoffee Income" });
      next();
    }
  } else {
    next();
  }
}

export async function FixStockistRepeatSoapIncome(req, res, next) {
  const body = req.body;
  const user_verification = req.user_verification;

  const soapStockistRepeatPurchase = await SoapStockistRepeatPurchase.find({
    account_number: body.account_number,
  });

  if (soapStockistRepeatPurchase.length != 0) {
    let result = 0;
    let charge_result = 0;

    for (let i = 0; i < soapStockistRepeatPurchase.length; i++) {
      const value = soapStockistRepeatPurchase[i].value;

      result += value;
      charge_result += value - value * INCOME_CHARGE;
    }

    if (result == user_verification.stockist_repeat_purchase_soap) {
      user_verification.stockist_repeat_purchase_soap = charge_result;
      const updated_user_verification = await user_verification.save();
      req.user_verification = updated_user_verification;
      next();
    } else {
      // res.send({ message: "ERROR!! StockistRPSoap Income" });
      next();
    }
  } else {
    next();
  }
}

export async function FixUnpaidIncome(req, res, next) {
  const body = req.body;

  const user_verification = req.user_verification;

  const direct_referral = await DirectReferralIncome(body.account_number);
  const pairing_bonus = await PairingBonusIncome(body.account_number);
  const indirect_referral = await IndirectReferralIncome(body.account_number);

  const b1t1_ae_rebates = user_verification.b1t1_ae_rebates;
  const b2t3_ae_rebates = user_verification.b2t3_ae_rebates;
  const new_member_income = user_verification.new_member_income
    ? user_verification.new_member_income
    : 0;
  const coffee_income = user_verification.coffee_income
    ? user_verification.coffee_income
    : 0;
  const soap_income = user_verification.soap_income
    ? user_verification.soap_income
    : 0;
  const b1t1_stockist_encode_new_order =
    user_verification.b1t1_stockist_encode_new_order
      ? user_verification.b1t1_stockist_encode_new_order
      : 0;
  const b2t3_stockist_encode_new_order =
    user_verification.b2t3_stockist_encode_new_order
      ? user_verification.b2t3_stockist_encode_new_order
      : 0;

  const stockist_repeat_purchase_coffee =
    user_verification.stockist_repeat_purchase_coffee
      ? user_verification.stockist_repeat_purchase_coffee
      : 0;
  const stockist_repeat_purchase_soap =
    user_verification.stockist_repeat_purchase_soap
      ? user_verification.stockist_repeat_purchase_soap
      : 0;

  const total =
    direct_referral +
    pairing_bonus +
    indirect_referral +
    b1t1_ae_rebates +
    b2t3_ae_rebates +
    new_member_income +
    coffee_income +
    soap_income +
    b1t1_stockist_encode_new_order +
    b2t3_stockist_encode_new_order +
    stockist_repeat_purchase_coffee +
    stockist_repeat_purchase_soap;

  user_verification.unpaid_income = total;

  await user_verification.save();

  next();
}

async function DirectReferralIncome(account_number) {
  let result = 0;

  const directRefferral = await DirectReferral.find({
    account_number,
  });

  if (directRefferral) {
    for (let i = 0; i < directRefferral.length; i++) {
      result +=
        directRefferral[i].value - directRefferral[i].value * INCOME_CHARGE;
    }
  }

  return result;
}

async function PairingBonusIncome(account_number) {
  let result = 0;

  const pairingBonus = await PairingBonus.find({
    account_number,
    payed: true,
  });

  if (pairingBonus) {
    for (let i = 0; i < pairingBonus.length; i++) {
      result += pairingBonus[i].value - pairingBonus[i].value * INCOME_CHARGE;
    }
  }

  return result;
}

async function IndirectReferralIncome(account_number) {
  let result = 0;

  const indirectReferral = await IndirectReferral.find({
    account_number,
  });

  if (indirectReferral) {
    for (let i = 0; i < indirectReferral.length; i++) {
      result +=
        indirectReferral[i].value - indirectReferral[i].value * INCOME_CHARGE;
    }
  }

  return result;
}
