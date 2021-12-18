import UserVerification from "../models/user.verification.model.js";
import User from "../models/user.model.js";
import CoffeeStockistRepeatPurchase from "../models/coffee-stockist-repeat-purchase.model.js";
import StockistEncodeNewOrder from "../models/stockist-encode-new-order.model.js";
import CoffeeIncome from "../models/coffee-income.model.js";
import TotalIncome from "../models/total-income.model.js";
import SoapIncome from "../models/soap-income.model.js";
import {
  COFFEE_B1T1_AE_REBATES,
  COFFEE_B1T1_MEGA_CENTER_INCOME,
  COFFEE_B1T1_SRP,
  B1T1_STOCKIST_ENCODE_NEW_ORDER,
  COFFEE_B1T1_STOCKIST_INCOME,
  COFFEE_B2T3_AE_REBATES,
  COFFEE_B2T3_MEGA_CENTER_INCOME,
  COFFEE_B2T3_SRP,
  B2T3_STOCKIST_ENCODE_NEW_ORDER,
  COFFEE_B2T3_STOCKIST_INCOME,
  SOAP_B1T1_SRP,
  SOAP_B2T3_SRP,
  SOAP_B1T1_MEGA_CENTER_INCOME,
  SOAP_B1T1_STOCKIST_INCOME,
  SOAP_B2T3_MEGA_CENTER_INCOME,
  SOAP_B2T3_STOCKIST_INCOME,
  SOAP_B1T1_AE_REBATES,
  SOAP_B2T3_AE_REBATES,
  ADMIN_PURCHASE_INCOME,
  COFFEE,
  SOAP,
  B1T1_MEGA_CENTER_AE_REBATES,
  B2T3_MEGA_CENTER_AE_REBATES,
  INCOME_CHARGE,
} from "../constants.js";
import Purchase from "../models/purchase.model.js";
import AutomaticEquivalentRebates from "../models/automatic-equivalent-rebates.model.js";
import SoapStockistRepeatPurchase from "../models/soap-stockist-repeat-purchase.model.js";

export async function initializeNewOrder(req, res, next) {
  const body = req.body;
  const user = req.user;

  const buyer = await UserVerification.findOne({ user_id: body.buyer });
  const seller = await UserVerification.findOne({ user_id: user._id });

  if (seller && buyer) {
    const seller_user = await User.findById(seller.user_id);
    const buyer_user = await User.findById(buyer.user_id);
    req.buyer = buyer;
    req.seller = seller;
    req.buyer_user = buyer_user;
    req.seller_user = seller_user;

    next();
  } else {
    res.status(401).send({ message: "Cannot find users!" });
  }
}

export async function orderStock(req, res, next) {
  const body = req.body;
  const seller_user = req.seller_user;

  if (seller_user.is_admin) {
    req.coffee_box = body.coffee_package * 2;
    req.soap_box = body.soap_package * 2;

    req.coffee_total_price = body.coffee_package * COFFEE_B1T1_SRP;
    req.soap_total_price = body.soap_package * SOAP_B1T1_SRP;

    await updateSellerAdminStock(req, res, next);
  } else if (body.package == "b1t1") {
    req.coffee_box = body.coffee_package * 2;
    req.soap_box = body.soap_package * 2;

    req.coffee_total_price = body.coffee_package * COFFEE_B1T1_SRP;
    req.soap_total_price = body.soap_package * SOAP_B1T1_SRP;

    await updateSellerStockB1t1(req, res, next);
  } else if (body.package == "b2t3") {
    req.coffee_box = body.coffee_package * 2 + body.coffee_package * 3;
    req.soap_box = body.soap_package * 2 + body.soap_package * 3;

    req.coffee_total_price = body.coffee_package * COFFEE_B2T3_SRP;
    req.soap_total_price = body.soap_package * SOAP_B2T3_SRP;

    await updateSellerStockB2t3(req, res, next);
  }
}

export async function updateStock(req, res, next) {
  const buyer = req.buyer;
  const coffee_ordered = req.coffee_box;
  const soap_ordered = req.soap_box;

  if (req.body.package == "b1t1") {
    buyer.stock_coffee_b1t1 = buyer.stock_coffee_b1t1
      ? buyer.stock_coffee_b1t1 + coffee_ordered
      : coffee_ordered;

    buyer.stock_soap_b1t1 = buyer.stock_soap_b1t1
      ? buyer.stock_soap_b1t1 + soap_ordered
      : soap_ordered;

    buyer.stock_coffee = buyer.stock_coffee
      ? buyer.stock_coffee + coffee_ordered
      : coffee_ordered;

    buyer.stock_soap = buyer.stock_soap
      ? buyer.stock_soap + soap_ordered
      : soap_ordered;

    await buyer.save();
    next();
  } else if (req.body.package == "b2t3") {
    buyer.stock_coffee_b2t3 = buyer.stock_coffee_b2t3
      ? buyer.stock_coffee_b2t3 + coffee_ordered
      : coffee_ordered;

    buyer.stock_soap_b2t3 = buyer.stock_soap_b2t3
      ? buyer.stock_soap_b2t3 + soap_ordered
      : soap_ordered;

    buyer.stock_coffee = buyer.stock_coffee
      ? buyer.stock_coffee + coffee_ordered
      : coffee_ordered;

    buyer.stock_soap = buyer.stock_soap
      ? buyer.stock_soap + soap_ordered
      : soap_ordered;

    await buyer.save();
    next();
  }
}

export async function createPurchase(req, res, next) {
  const coffee_box = req.coffee_box;
  const soap_box = req.soap_box;
  const soap_total_price = req.soap_total_price;
  const coffee_total_price = req.coffee_total_price;
  const body = req.body;
  const buyer = req.buyer;
  const seller = req.seller;

  if (coffee_box) {
    const newPurchase = await Purchase({
      user_id: buyer.user_id,
      first_name: buyer.first_name,
      last_name: buyer.last_name,
      address: buyer.address,
      package: body.package,
      product: "coffee",
      quantity: coffee_box,
      value: coffee_total_price,

      seller: {
        user_id: seller.user_id,
        first_name: seller.first_name,
        last_name: seller.last_name,
        address: seller.address,
      },
    });

    await newPurchase.save();
  }

  if (soap_box) {
    const newPurchase = await Purchase({
      user_id: buyer.user_id,
      first_name: buyer.first_name,
      last_name: buyer.last_name,
      address: buyer.address,
      package: body.package,
      product: "soap",
      quantity: soap_box,
      value: soap_total_price,

      seller: {
        user_id: seller.user_id,
        first_name: seller.first_name,
        last_name: seller.last_name,
        address: seller.address,
      },
    });

    await newPurchase.save();
  }
  next();
}

export async function automaticEquivalentRebatesIncome(req, res, next) {
  const buyer = req.buyer;
  const body = req.body;
  const seller_user = req.seller_user;
  const buyer_user = req.buyer_user;

  const referral_verification = await UserVerification.findOne({
    user_id: buyer.user_that_invite.user_id,
  });

  const referral_user = await User.findById(buyer.user_that_invite.user_id);

  if (
    referral_verification &&
    !buyer_user.is_stockist &&
    !buyer_user.is_mega_center &&
    !buyer_user.is_admin
  ) {
    if (body.package == "b1t1") {
      const coffee_total_income = body.coffee_package * COFFEE_B1T1_AE_REBATES;
      const soap_total_income = body.soap_package * SOAP_B1T1_AE_REBATES;

      const coffee_total_income_with_charge =
        coffee_total_income - coffee_total_income * INCOME_CHARGE;
      const soap_total_income_with_charge =
        soap_total_income - soap_total_income * INCOME_CHARGE;

      const total_income = coffee_total_income + soap_total_income;
      const total_income_charge =
        coffee_total_income_with_charge + soap_total_income_with_charge;

      referral_verification.b1t1_ae_rebates =
        referral_verification.b1t1_ae_rebates + total_income_charge;

      referral_verification.overall_income =
        referral_verification.overall_income + total_income_charge;

      referral_verification.unpaid_income =
        referral_verification.unpaid_income + total_income_charge;

      await createTotalIncome(
        referral_user,
        "AE Rebates ( B1T1 )",
        total_income
      );

      await AERebatesCreate(
        referral_user,
        buyer_user,
        seller_user,
        "b1t1",
        COFFEE,
        req.coffee_box,
        coffee_total_income
      );

      await AERebatesCreate(
        referral_user,
        buyer_user,
        seller_user,
        "b1t1",
        SOAP,
        req.soap_box,
        soap_total_income
      );

      await referral_verification.save();
    } else if (body.package == "b2t3") {
      const coffee_total_income = body.coffee_package * COFFEE_B2T3_AE_REBATES;
      const soap_total_income = body.soap_package * SOAP_B2T3_AE_REBATES;

      const coffee_total_income_with_charge =
        coffee_total_income - coffee_total_income * INCOME_CHARGE;
      const soap_total_income_with_charge =
        soap_total_income - soap_total_income * INCOME_CHARGE;

      const total_income = coffee_total_income + soap_total_income;

      const total_income_charge =
        coffee_total_income_with_charge + soap_total_income_with_charge;

      referral_verification.b2t3_ae_rebates =
        referral_verification.b2t3_ae_rebates + total_income_charge;

      referral_verification.overall_income =
        referral_verification.overall_income + total_income_charge;

      referral_verification.unpaid_income =
        referral_verification.unpaid_income + total_income_charge;

      await createTotalIncome(
        referral_user,
        "AE Rebates ( B2T3 )",
        total_income
      );

      await AERebatesCreate(
        referral_user,
        buyer_user,
        seller_user,
        "b2t3",
        COFFEE,
        req.coffee_box,
        coffee_total_income
      );

      await AERebatesCreate(
        referral_user,
        buyer_user,
        seller_user,
        "b2t3",
        SOAP,
        req.soap_box,
        soap_total_income
      );

      await referral_verification.save();
    }
  }

  next();
}

export async function purchaseIncome(req, res, next) {
  const seller = req.seller;
  const buyer = req.buyer;
  const seller_user = req.seller_user;
  const buyer_user = req.buyer_user;
  const user = req.user;
  const body = req.body;

  if (body.package == "b1t1") {
    if (user.is_mega_center && !buyer_user.is_stockist) {
      const coffee_total_income =
        COFFEE_B1T1_MEGA_CENTER_INCOME * body.coffee_package;

      const soap_total_income =
        SOAP_B1T1_MEGA_CENTER_INCOME * body.soap_package;

      const coffee_total_income_with_charge =
        coffee_total_income - coffee_total_income * INCOME_CHARGE;

      const soap_total_income_with_charge =
        soap_total_income - soap_total_income * INCOME_CHARGE;

      const total_income =
        coffee_total_income_with_charge + soap_total_income_with_charge;

      seller.coffee_income = seller.coffee_income
        ? seller.coffee_income + coffee_total_income_with_charge
        : coffee_total_income_with_charge;

      seller.soap_income = seller.soap_income
        ? seller.soap_income + soap_total_income_with_charge
        : soap_total_income_with_charge;

      seller.overall_income = seller.overall_income + total_income;
      seller.unpaid_income = seller.unpaid_income + total_income;

      await createTotalIncome(
        seller_user,
        "Coffee Income",
        coffee_total_income
      );

      await createTotalIncome(seller_user, "Soap Income", soap_total_income);

      await CoffeeIncomeRebates(
        seller_user,
        buyer_user,
        "b1t1",
        body.coffee_package,
        coffee_total_income
      );

      await SoapIncomeRebates(
        seller_user,
        buyer_user,
        "b1t1",
        body.soap_package,
        soap_total_income
      );

      await seller.save();
    } else if (user.is_stockist) {
      const coffee_total_income =
        COFFEE_B1T1_STOCKIST_INCOME * body.coffee_package;

      const soap_total_income = SOAP_B1T1_STOCKIST_INCOME * body.soap_package;

      const total_income = coffee_total_income + soap_total_income;

      seller.coffee_income = seller.coffee_income
        ? seller.coffee_income + coffee_total_income
        : coffee_total_income;

      seller.soap_income = seller.soap_income
        ? seller.soap_income + soap_total_income
        : soap_total_income;

      seller.overall_income = seller.overall_income + total_income;
      seller.unpaid_income = seller.unpaid_income + total_income;

      await createTotalIncome(
        seller_user,
        "Coffee Income",
        coffee_total_income
      );

      await createTotalIncome(seller_user, "Soap Income", soap_total_income);

      await CoffeeIncomeRebates(
        seller_user,
        buyer_user,
        "b1t1",
        body.coffee_package,
        coffee_total_income
      );

      await SoapIncomeRebates(
        seller_user,
        buyer_user,
        "b1t1",
        body.soap_package,
        soap_total_income
      );

      await seller.save();
    } else if (user.is_admin) {
      const coffee_total_income = ADMIN_PURCHASE_INCOME * req.coffee_box;

      const soap_total_income = ADMIN_PURCHASE_INCOME * req.soap_box;

      const total_income = coffee_total_income + soap_total_income;

      seller.coffee_income = seller.coffee_income
        ? seller.coffee_income + coffee_total_income
        : coffee_total_income;

      seller.soap_income = seller.soap_income
        ? seller.soap_income + soap_total_income
        : soap_total_income;

      seller.overall_income = seller.overall_income + total_income;
      seller.unpaid_income = seller.unpaid_income + total_income;

      await createTotalIncome(
        seller_user,
        "Coffee Income",
        coffee_total_income
      );

      await createTotalIncome(seller_user, "Soap Income", soap_total_income);

      await CoffeeIncomeRebates(
        seller_user,
        buyer_user,
        "b1t1",
        body.coffee_package,
        coffee_total_income
      );

      await SoapIncomeRebates(
        seller_user,
        buyer_user,
        "b1t1",
        body.soap_package,
        soap_total_income
      );

      await seller.save();
    }
  } else if (body.package == "b2t3") {
    if (user.is_mega_center && !buyer_user.is_stockist) {
      const coffee_total_income =
        COFFEE_B2T3_MEGA_CENTER_INCOME * body.coffee_package;
      const soap_total_income =
        SOAP_B2T3_MEGA_CENTER_INCOME * body.soap_package;

      const total_income = coffee_total_income + soap_total_income;

      seller.coffee_income = seller.coffee_income
        ? seller.coffee_income + coffee_total_income
        : coffee_total_income;

      seller.soap_income = seller.soap_income
        ? seller.soap_income + soap_total_income
        : soap_total_income;

      seller.overall_income = seller.overall_income + total_income;
      seller.unpaid_income = seller.unpaid_income + total_income;

      await createTotalIncome(
        seller_user,
        "Coffee Income",
        coffee_total_income
      );

      await createTotalIncome(seller_user, "Soap Income", soap_total_income);

      await CoffeeIncomeRebates(
        seller_user,
        buyer_user,
        "b2t3",
        body.coffee_package,
        coffee_total_income
      );

      await SoapIncomeRebates(
        seller_user,
        buyer_user,
        "b2t3",
        body.soap_package,
        soap_total_income
      );

      await seller.save();
    } else if (user.is_stockist) {
      const coffee_total_income =
        COFFEE_B2T3_STOCKIST_INCOME * body.coffee_package;

      const soap_total_income = SOAP_B2T3_STOCKIST_INCOME * body.soap_package;

      const total_income = coffee_total_income + soap_total_income;

      seller.coffee_income = seller.coffee_income
        ? seller.coffee_income + coffee_total_income
        : coffee_total_income;

      seller.soap_income = seller.soap_income
        ? seller.soap_income + soap_total_income
        : soap_total_income;

      seller.overall_income = seller.overall_income + total_income;
      seller.unpaid_income = seller.unpaid_income + total_income;

      await createTotalIncome(
        seller_user,
        "Coffee Income",
        coffee_total_income
      );

      await createTotalIncome(seller_user, "Soap Income", soap_total_income);

      await CoffeeIncomeRebates(
        seller_user,
        buyer_user,
        "b2t3",
        body.coffee_package,
        coffee_total_income
      );

      await SoapIncomeRebates(
        seller_user,
        buyer_user,
        "b2t3",
        body.soap_package,
        soap_total_income
      );

      await seller.save();
    } else if (user.is_admin) {
      const coffee_total_income = ADMIN_PURCHASE_INCOME * req.coffee_box;

      const soap_total_income = ADMIN_PURCHASE_INCOME * req.soap_box;

      const total_income = coffee_total_income + soap_total_income;

      seller.coffee_income = seller.coffee_income
        ? seller.coffee_income + coffee_total_income
        : coffee_total_income;

      seller.soap_income = seller.soap_income
        ? seller.soap_income + soap_total_income
        : soap_total_income;

      seller.overall_income = seller.overall_income + total_income;
      seller.unpaid_income = seller.unpaid_income + total_income;

      await createTotalIncome(
        seller_user,
        "Coffee Income",
        coffee_total_income
      );

      await createTotalIncome(seller_user, "Soap Income", soap_total_income);

      await CoffeeIncomeRebates(
        seller_user,
        buyer_user,
        "b2t3",
        body.coffee_package,
        coffee_total_income
      );

      await SoapIncomeRebates(
        seller_user,
        buyer_user,
        "b2t3",
        body.soap_package,
        soap_total_income
      );

      await seller.save();
    }
  }

  next();
}

export async function stockistRepeatPurchase(req, res, next) {
  const body = req.body;
  const buyer = req.buyer;
  const coffee_package = body.coffee_package;
  const soap_package = body.soap_package;

  const buyer_user = req.buyer_user;

  if (buyer_user.is_stockist) {
    const stockist_mega_center = await User.findOne({
      secret_code_suffix: buyer_user.secret_code_suffix,
      is_mega_center: true,
    });

    const user_verifaciton_mega_center = await UserVerification.findOne({
      user_id: stockist_mega_center._id,
    });

    if (body.package == "b1t1") {
      if (coffee_package) {
        const total_income = coffee_package * B1T1_MEGA_CENTER_AE_REBATES;
        const total_income_with_charge =
          total_income - total_income * INCOME_CHARGE;

        user_verifaciton_mega_center.stockist_repeat_purchase_coffee =
          user_verifaciton_mega_center.stockist_repeat_purchase_coffee
            ? user_verifaciton_mega_center.stockist_repeat_purchase_coffee +
              total_income_with_charge
            : total_income_with_charge;

        user_verifaciton_mega_center.overall_income =
          user_verifaciton_mega_center.overall_income +
          total_income_with_charge;

        user_verifaciton_mega_center.unpaid_income =
          user_verifaciton_mega_center.unpaid_income + total_income_with_charge;

        await createTotalIncome(
          stockist_mega_center,
          "Stockist Repeat Purchase Coffee Income",
          total_income
        );

        await CoffeeStockistRepeatPurchaseRebates(
          stockist_mega_center,
          buyer_user,
          "b1t1",
          coffee_package,
          total_income
        );

        await user_verifaciton_mega_center.save();
      }

      if (soap_package) {
        const total_income = soap_package * B1T1_MEGA_CENTER_AE_REBATES;
        const total_income_with_charge =
          total_income - total_income * INCOME_CHARGE;

        user_verifaciton_mega_center.stockist_repeat_purchase_soap =
          user_verifaciton_mega_center.stockist_repeat_purchase_soap
            ? user_verifaciton_mega_center.stockist_repeat_purchase_soap +
              total_income_with_charge
            : total_income_with_charge;

        user_verifaciton_mega_center.overall_income =
          user_verifaciton_mega_center.overall_income +
          total_income_with_charge;
        user_verifaciton_mega_center.unpaid_income =
          user_verifaciton_mega_center.unpaid_income + total_income_with_charge;

        await createTotalIncome(
          stockist_mega_center,
          "Stockist Repeat Purchase Soap Income",
          total_income
        );

        await SoapStockistRepeatPurchaseRebates(
          stockist_mega_center,
          buyer_user,
          "b1t1",
          soap_package,
          total_income
        );

        await user_verifaciton_mega_center.save();
      }
    } else if (body.package == "b2t3") {
      if (coffee_package) {
        const total_income = coffee_package * B2T3_MEGA_CENTER_AE_REBATES;
        const total_income_with_charge =
          total_income - total_income * INCOME_CHARGE;

        user_verifaciton_mega_center.stockist_repeat_purchase_coffee =
          user_verifaciton_mega_center.stockist_repeat_purchase_coffee
            ? user_verifaciton_mega_center.stockist_repeat_purchase_coffee +
              total_income_with_charge
            : total_income_with_charge;

        user_verifaciton_mega_center.overall_income =
          user_verifaciton_mega_center.overall_income +
          total_income_with_charge;

        user_verifaciton_mega_center.unpaid_income =
          user_verifaciton_mega_center.unpaid_income + total_income_with_charge;

        await createTotalIncome(
          stockist_mega_center,
          "Stockist Repeat Purchase Coffee Income",
          total_income
        );

        await CoffeeStockistRepeatPurchaseRebates(
          stockist_mega_center,
          buyer_user,
          "b2t3",
          coffee_package,
          total_income
        );

        await user_verifaciton_mega_center.save();
      }

      if (soap_package) {
        const total_income = soap_package * B2T3_MEGA_CENTER_AE_REBATES;
        const total_income_with_charge =
          total_income - total_income * INCOME_CHARGE;

        user_verifaciton_mega_center.stockist_repeat_purchase_soap =
          user_verifaciton_mega_center.stockist_repeat_purchase_soap
            ? user_verifaciton_mega_center.stockist_repeat_purchase_soap +
              total_income_with_charge
            : total_income_with_charge;

        user_verifaciton_mega_center.overall_income =
          user_verifaciton_mega_center.overall_income +
          total_income_with_charge;
        user_verifaciton_mega_center.unpaid_income =
          user_verifaciton_mega_center.unpaid_income + total_income_with_charge;

        await createTotalIncome(
          stockist_mega_center,
          "Stockist Repeat Purchase Soap Income",
          total_income
        );

        await SoapStockistRepeatPurchaseRebates(
          stockist_mega_center,
          buyer_user,
          "b2t3",
          soap_package,
          total_income
        );

        await user_verifaciton_mega_center.save();
      }
    }
  }

  next();
}

export async function stockistEncodeNewOrder(req, res, next) {
  const seller = req.seller;
  const seller_user = req.seller_user;
  const user = req.user;
  const body = req.body;
  const coffee_package = body.coffee_package;
  const soap_package = body.soap_package;

  if (user.is_stockist) {
    const stockist_user = await User.findById(user._id);

    const mega_center_user = await User.findOne({
      secret_code_suffix: stockist_user.secret_code_suffix,
      is_mega_center: true,
    });

    if (mega_center_user) {
      const mega_center_verification = await UserVerification.findOne({
        user_id: mega_center_user._id,
      });

      if (mega_center_verification) {
        if (body.package == "b1t1") {
          const coffee_icome = coffee_package * B1T1_STOCKIST_ENCODE_NEW_ORDER;
          const soap_income = soap_package * B1T1_STOCKIST_ENCODE_NEW_ORDER;

          const total_income = coffee_icome + soap_income;

          mega_center_verification.b1t1_stockist_encode_new_order =
            mega_center_verification.b1t1_stockist_encode_new_order
              ? mega_center_verification.b1t1_stockist_encode_new_order +
                total_income
              : total_income;

          mega_center_verification.overall_income =
            mega_center_verification.overall_income + total_income;

          mega_center_verification.unpaid_income =
            mega_center_verification.unpaid_income + total_income;

          await createTotalIncome(
            mega_center_user,
            "B1T1 Stockist Encode New Order Income",
            total_income
          );

          await StockistEncodeNewOrderRebates(
            mega_center_user,
            seller_user,
            "b1t1",
            coffee_package,
            total_income
          );

          await mega_center_verification.save();
        } else if (body.package == "b2t3") {
          0;
          const coffee_icome = coffee_package * B2T3_STOCKIST_ENCODE_NEW_ORDER;
          const soap_income = soap_package * B2T3_STOCKIST_ENCODE_NEW_ORDER;

          const total_income = coffee_icome + soap_income;

          mega_center_verification.b2t3_stockist_encode_new_order =
            mega_center_verification.b2t3_stockist_encode_new_order
              ? mega_center_verification.b2t3_stockist_encode_new_order +
                total_income
              : total_income;

          mega_center_verification.overall_income =
            mega_center_verification.overall_income + total_income;

          mega_center_verification.unpaid_income =
            mega_center_verification.unpaid_income + total_income;

          await createTotalIncome(
            mega_center_user,
            "B2T3 Stockist Encode New Order Income",
            total_income
          );

          await StockistEncodeNewOrderRebates(
            mega_center_user,
            seller_user,
            "b2t3",
            coffee_package,
            total_income
          );
          await mega_center_verification.save();
        }
      }
    }
  }

  next();
}

async function AERebatesCreate(
  referral_user,
  buyer,
  seller,
  package_type,
  product,
  quantity,
  value
) {
  if (value) {
    const aeRebates = await AutomaticEquivalentRebates({
      account_number: referral_user.account_number,
      user_id: referral_user._id,
      first_name: referral_user.first_name,
      last_name: referral_user.last_name,
      address: referral_user.address,

      buyer: {
        account_number: referral_user.account_number,
        user_id: buyer._id,
        first_name: buyer.first_name,
        last_name: buyer.last_name,
        address: buyer.address,
      },

      seller: {
        account_number: referral_user.account_number,
        user_id: seller._id,
        first_name: seller.first_name,
        last_name: seller.last_name,
        address: seller.address,
      },

      package: package_type,
      product: product,
      quantity: quantity,
      value: value,
    });

    await aeRebates.save();
  }
}

async function CoffeeIncomeRebates(
  seller_user,
  buyer_user,
  package_type,
  quantity,
  value
) {
  if (value) {
    const coffeeIncome = await CoffeeIncome({
      account_number: seller_user.account_number,
      user_id: seller_user._id,
      first_name: seller_user.first_name,
      last_name: seller_user.last_name,
      address: seller_user.address,

      buyer: {
        account_number: buyer_user.account_number,
        user_id: buyer_user._id,
        first_name: buyer_user.first_name,
        last_name: buyer_user.last_name,
        address: buyer_user.address,
      },

      package: package_type,
      quantity: quantity,
      value: value,
    });

    await coffeeIncome.save();
  }
}

async function SoapIncomeRebates(
  seller_user,
  buyer_user,
  package_type,
  quantity,
  value
) {
  if (value) {
    const soapIncome = await SoapIncome({
      account_number: seller_user.account_number,
      user_id: seller_user._id,
      first_name: seller_user.first_name,
      last_name: seller_user.last_name,
      address: seller_user.address,

      buyer: {
        account_number: buyer_user.account_number,
        user_id: buyer_user._id,
        first_name: buyer_user.first_name,
        last_name: buyer_user.last_name,
        address: buyer_user.address,
      },

      package: package_type,
      quantity: quantity,
      value: value,
    });

    await soapIncome.save();
  }
}

async function CoffeeStockistRepeatPurchaseRebates(
  mega_center,
  stockist,
  package_type,
  quantity,
  value
) {
  if (value) {
    const coffeeStockistRP = await CoffeeStockistRepeatPurchase({
      account_number: mega_center.account_number,
      user_id: mega_center._id,
      first_name: mega_center.first_name,
      last_name: mega_center.last_name,
      address: mega_center.address,

      stockist: {
        account_number: stockist.account_number,
        user_id: stockist._id,
        first_name: stockist.first_name,
        last_name: stockist.last_name,
        address: stockist.address,
      },

      package: package_type,
      quantity: quantity,
      value: value,
    });

    await coffeeStockistRP.save();
  }
}

async function SoapStockistRepeatPurchaseRebates(
  mega_center,
  stockist,
  package_type,
  quantity,
  value
) {
  if (value) {
    const soapStockistRP = await SoapStockistRepeatPurchase({
      account_number: mega_center.account_number,
      user_id: mega_center._id,
      first_name: mega_center.first_name,
      last_name: mega_center.last_name,
      address: mega_center.address,

      stockist: {
        account_number: stockist.account_number,
        user_id: stockist._id,
        first_name: stockist.first_name,
        last_name: stockist.last_name,
        address: stockist.address,
      },

      package: package_type,
      quantity: quantity,
      value: value,
    });

    await soapStockistRP.save();
  }
}

async function StockistEncodeNewOrderRebates(
  mega_center,
  stockist,
  package_type,
  quantity,
  value
) {
  if (value) {
    const stockistEncodeNewOrder = await StockistEncodeNewOrder({
      account_number: mega_center.account_number,
      user_id: mega_center._id,
      first_name: mega_center.first_name,
      last_name: mega_center.first_name,
      address: mega_center.address,

      stockist: {
        account_number: stockist.account_number,
        user_id: stockist._id,
        first_name: stockist.first_name,
        last_name: stockist.last_name,
        address: stockist.address,
      },

      package: package_type,
      quantity: quantity,
      value: value,
    });

    await stockistEncodeNewOrder.save();
  }
}

async function createTotalIncome(user, type, total_income) {
  if (total_income) {
    const totalIncome = new TotalIncome({
      account_number: user.account_number,
      user_id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      address: user.address,

      type: type,
      value: total_income,
    });

    await totalIncome.save();
  }
}

async function updateSellerStockB1t1(req, res, next) {
  const seller = req.seller;
  const coffee_ordered = req.coffee_box;
  const soap_ordered = req.soap_box;

  const can_stock_coffee =
    seller.stock_coffee_b1t1 >= coffee_ordered || coffee_ordered == 0;

  const can_stock_soap =
    seller.stock_soap_b1t1 >= soap_ordered || soap_ordered == 0;

  if (
    can_stock_coffee &&
    can_stock_soap &&
    (coffee_ordered != 0 || soap_ordered != 0)
  ) {
    if (seller.stock_coffee_b1t1 != undefined && seller.stock_coffee_b1t1 > 0) {
      seller.stock_coffee_b1t1 = seller.stock_coffee_b1t1 - coffee_ordered;
      seller.stock_coffee = seller.stock_coffee - coffee_ordered;
    }

    if (seller.stock_soap_b1t1 != undefined && seller.stock_soap_b1t1 > 0) {
      seller.stock_soap_b1t1 = seller.stock_soap_b1t1 - soap_ordered;
      seller.stock_soap = seller.stock_soap - soap_ordered;
    }

    await seller.save();
    next();
  } else {
    if (can_stock_coffee == false && can_stock_soap == false) {
      res.status(401).send({
        message: "Your out of stock of coffee and soap",
      });
    } else if (can_stock_coffee == false) {
      res.status(401).send({
        message: "Your out of stock of coffee",
      });
    } else if (can_stock_soap == false) {
      res.status(401).send({
        message: "Your out of stock of soap",
      });
    }
  }
}

async function updateSellerStockB2t3(req, res, next) {
  const seller = req.seller;
  const coffee_ordered = req.coffee_box;
  const soap_ordered = req.soap_box;

  const can_stock_coffee =
    seller.stock_coffee_b2t3 >= coffee_ordered || coffee_ordered == 0;

  const can_stock_soap =
    seller.stock_soap_b2t3 >= soap_ordered || soap_ordered == 0;

  if (
    can_stock_coffee &&
    can_stock_soap &&
    (coffee_ordered != 0 || soap_ordered != 0)
  ) {
    if (seller.stock_coffee_b2t3 != undefined && seller.stock_coffee_b2t3 > 0) {
      seller.stock_coffee_b2t3 = seller.stock_coffee_b2t3 - coffee_ordered;
      seller.stock_coffee = seller.stock_coffee - coffee_ordered;
    }

    if (seller.stock_soap_b2t3 != undefined && seller.stock_soap_b2t3 > 0) {
      seller.stock_soap_b2t3 = seller.stock_soap_b2t3 - soap_ordered;
      seller.stock_soap = seller.stock_soap - soap_ordered;
    }

    await seller.save();
    next();
  } else {
    if (can_stock_coffee == false && can_stock_soap == false) {
      res.status(401).send({
        message: "Your out of stock of coffee and soap",
      });
    } else if (can_stock_coffee == false) {
      res.status(401).send({
        message: "Your out of stock of coffee",
      });
    } else if (can_stock_soap == false) {
      res.status(401).send({
        message: "Your out of stock of soap",
      });
    }
  }
}

async function updateSellerAdminStock(req, res, next) {
  const seller = req.seller;
  const coffee_ordered = req.coffee_box;
  const soap_ordered = req.soap_box;

  const can_stock_coffee =
    seller.stock_coffee >= coffee_ordered || coffee_ordered == 0;

  const can_stock_soap = seller.stock_soap >= soap_ordered || soap_ordered == 0;

  if (
    can_stock_coffee &&
    can_stock_soap &&
    (coffee_ordered != 0 || soap_ordered != 0)
  ) {
    if (seller.stock_coffee != undefined && seller.stock_coffee > 0) {
      seller.stock_coffee = seller.stock_coffee - coffee_ordered;
    }

    if (seller.stock_soap != undefined && seller.stock_soap > 0) {
      seller.stock_soap = seller.stock_soap - soap_ordered;
    }

    await seller.save();
    next();
  } else {
    if (can_stock_coffee == false && can_stock_soap == false) {
      res.status(401).send({
        message: "Your out of stock of coffee and soap",
      });
    } else if (can_stock_coffee == false) {
      res.status(401).send({
        message: "Your out of stock of coffee",
      });
    } else if (can_stock_soap == false) {
      res.status(401).send({
        message: "Your out of stock of soap",
      });
    }
  }
}
