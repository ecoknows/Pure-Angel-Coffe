import CoffeeIncome from "../models/coffee-income.model.js";
import express from "express";
import expressAsyncHandler from "express-async-handler";
import { verifyUserToken } from "../utils.js";
import SoapIncome from "../models/soap-income.model.js";
import NewMemberIncome from "../models/new-member-income.model.js";
import AutomaticEquivalentRebates from "../models/automatic-equivalent-rebates.model.js";
import DirectReferral from "../models/direct-referral.model.js";
import IndirectReferral from "../models/indirect-referral.model.js";
import PairingBonus from "../models/pairing-bonus.model.js";
import StockistEncodeNewOrder from "../models/stockist-encode-new-order.model.js";
import CoffeeStockistRepeatPurchase from "../models/coffee-stockist-repeat-purchase.model.js";
import SoapStockistRepeatPurchase from "../models/soap-stockist-repeat-purchase.model.js";
import ProductVoucher from "../models/product-voucher.model.js";
import TotalIncome from "../models/total-income.model.js";

const IncomeHistoryRouter = express.Router();

IncomeHistoryRouter.get(
  "/coffee-income",
  verifyUserToken,
  expressAsyncHandler(async (req, res) => {
    const user = req.user;
    const coffeeIncome = await CoffeeIncome.find({
      user_id: user._id,
    }).sort({ createdAt: -1 });

    if (coffeeIncome) {
      res.send({
        message: "Successfully Fetch Data",
        data: coffeeIncome,
      });
    } else {
      res.send({
        message: "Empty Income",
      });
    }
  })
);

IncomeHistoryRouter.get(
  "/soap-income",
  verifyUserToken,
  expressAsyncHandler(async (req, res) => {
    const user = req.user;
    const soapIncome = await SoapIncome.find({
      user_id: user._id,
    }).sort({ createdAt: -1 });

    if (soapIncome) {
      res.send({
        message: "Successfully Fetch Data",
        data: soapIncome,
      });
    } else {
      res.send({
        message: "Empty Income",
      });
    }
  })
);

IncomeHistoryRouter.get(
  "/new-member-income",
  verifyUserToken,
  expressAsyncHandler(async (req, res) => {
    const user = req.user;
    const newMemberIncome = await NewMemberIncome.find({
      user_id: user._id,
    }).sort({ createdAt: -1 });

    if (newMemberIncome) {
      res.send({
        message: "Successfully Fetch Data",
        data: newMemberIncome,
      });
    } else {
      res.send({
        message: "Empty Income",
      });
    }
  })
);

IncomeHistoryRouter.get(
  "/ae-rebates-b1t1",
  verifyUserToken,
  expressAsyncHandler(async (req, res) => {
    const user = req.user;
    const aeRebatesB1t1 = await AutomaticEquivalentRebates.find({
      user_id: user._id,
      package: "b1t1",
    }).sort({ createdAt: -1 });

    if (aeRebatesB1t1) {
      res.send({
        message: "Successfully Fetch Data",
        data: aeRebatesB1t1,
      });
    } else {
      res.send({
        message: "Empty Income",
      });
    }
  })
);

IncomeHistoryRouter.get(
  "/ae-rebates-b2t3",
  verifyUserToken,
  expressAsyncHandler(async (req, res) => {
    const user = req.user;
    const aeRebatesB1t1 = await AutomaticEquivalentRebates.find({
      user_id: user._id,
      package: "b2t3",
    }).sort({ createdAt: -1 });

    if (aeRebatesB1t1) {
      res.send({
        message: "Successfully Fetch Data",
        data: aeRebatesB1t1,
      });
    } else {
      res.send({
        message: "Empty Income",
      });
    }
  })
);

IncomeHistoryRouter.get(
  "/direct-referral",
  verifyUserToken,
  expressAsyncHandler(async (req, res) => {
    const user = req.user;
    const directReferral = await DirectReferral.find({
      user_id: user._id,
    }).sort({ createdAt: -1 });

    if (directReferral) {
      res.send({
        message: "Successfully Fetch Data",
        data: directReferral,
      });
    } else {
      res.send({
        message: "Empty Income",
      });
    }
  })
);

IncomeHistoryRouter.get(
  "/indirect-referral",
  verifyUserToken,
  expressAsyncHandler(async (req, res) => {
    const user = req.user;
    const indirectReferral = await IndirectReferral.find({
      user_id: user._id,
    }).sort({ createdAt: -1 });

    if (indirectReferral) {
      res.send({
        message: "Successfully Fetch Data",
        data: indirectReferral,
      });
    } else {
      res.send({
        message: "Empty Income",
      });
    }
  })
);

IncomeHistoryRouter.get(
  "/pairing-bonus",
  verifyUserToken,
  expressAsyncHandler(async (req, res) => {
    const user = req.user;

    const pairingBonus = await PairingBonus.find({
      user_id: user._id,
      payed: true,
    }).sort({ createdAt: -1 });

    if (pairingBonus) {
      res.send({
        message: "Successfully Fetch Data",
        data: pairingBonus,
      });
    } else {
      res.send({
        message: "Empty Income",
      });
    }
  })
);

IncomeHistoryRouter.get(
  "/stockist-new-order-b1t1",
  verifyUserToken,
  expressAsyncHandler(async (req, res) => {
    const user = req.user;

    const stockistEncodeNewOrder = await StockistEncodeNewOrder.find({
      user_id: user._id,
      package: "b1t1",
    }).sort({ createdAt: -1 });

    if (stockistEncodeNewOrder) {
      res.send({
        message: "Successfully Fetch Data",
        data: stockistEncodeNewOrder,
      });
    } else {
      res.send({
        message: "Empty Income",
      });
    }
  })
);

IncomeHistoryRouter.get(
  "/stockist-new-order-b2t3",
  verifyUserToken,
  expressAsyncHandler(async (req, res) => {
    const user = req.user;

    const stockistEncodeNewOrder = await StockistEncodeNewOrder.find({
      user_id: user._id,
      package: "b2t3",
    }).sort({ createdAt: -1 });

    if (stockistEncodeNewOrder) {
      res.send({
        message: "Successfully Fetch Data",
        data: stockistEncodeNewOrder,
      });
    } else {
      res.send({
        message: "Empty Income",
      });
    }
  })
);

IncomeHistoryRouter.get(
  "/stockist-repeat-purchase-coffee",
  verifyUserToken,
  expressAsyncHandler(async (req, res) => {
    const user = req.user;

    const stockistRepeatPurchaseCoffee =
      await CoffeeStockistRepeatPurchase.find({
        user_id: user._id,
      }).sort({ createdAt: -1 });

    if (stockistRepeatPurchaseCoffee) {
      res.send({
        message: "Successfully Fetch Data",
        data: stockistRepeatPurchaseCoffee,
      });
    } else {
      res.send({
        message: "Empty Income",
      });
    }
  })
);

IncomeHistoryRouter.get(
  "/stockist-repeat-purchase-soap",
  verifyUserToken,
  expressAsyncHandler(async (req, res) => {
    const user = req.user;

    const stockistRepeatPurchaseSoap = await SoapStockistRepeatPurchase.find({
      user_id: user._id,
    }).sort({ createdAt: -1 });

    if (stockistRepeatPurchaseSoap) {
      res.send({
        message: "Successfully Fetch Data",
        data: stockistRepeatPurchaseSoap,
      });
    } else {
      res.send({
        message: "Empty Income",
      });
    }
  })
);

IncomeHistoryRouter.get(
  "/product-voucher",
  verifyUserToken,
  expressAsyncHandler(async (req, res) => {
    const user = req.user;

    const productVoucher = await ProductVoucher.find({
      user_id: user._id,
    }).sort({ createdAt: -1 });

    if (productVoucher) {
      res.send({
        message: "Successfully Fetch Data",
        data: productVoucher,
      });
    } else {
      res.send({
        message: "Empty Income",
      });
    }
  })
);

IncomeHistoryRouter.get(
  "/total-income",
  verifyUserToken,
  expressAsyncHandler(async (req, res) => {
    const user = req.user;

    const totalIncome = await TotalIncome.find({
      user_id: user._id,
    }).sort({ createdAt: -1 });

    if (totalIncome) {
      res.send({
        message: "Successfully Fetch Data",
        data: totalIncome,
      });
    } else {
      res.send({
        message: "Empty Income",
      });
    }
  })
);

IncomeHistoryRouter.post(
  "/search-total-income",
  verifyUserToken,
  expressAsyncHandler(async (req, res) => {
    const user_id = req.body.user_id;

    const totalIncome = await TotalIncome.find({
      user_id: user_id,
    }).sort({ createdAt: -1 });

    if (totalIncome) {
      res.send({
        message: "Successfully Fetch Data",
        data: totalIncome,
      });
    } else {
      res.send({
        message: "Empty Income",
      });
    }
  })
);

export default IncomeHistoryRouter;
