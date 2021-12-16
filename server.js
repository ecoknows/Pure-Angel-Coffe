import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import UtilsRouter from "./server/router/utils.router.js";
import UserRouter from "./server/router/user.router.js";
import GenealogyRouter from "./server/router/genealogy.router.js";
import DirectReferralRouter from "./server/router/direct-referral.router.js";
import AdminRouter from "./server/router/admin.router.js";

import path from "path";
import IndirectReferralRouter from "./server/router/indirect-referral.router.js";
import PairingBonusRouter from "./server/router/pairing-bonus.router.js";
import SeedRouter from "./server/router/seed.router.js";
import UserCashouts from "./server/router/user-cashouts.router.js";
import MegaCenterRouter from "./server/router/mega-center.router.js";
import AutomaticEquivalentRebatesRouter from "./server/router/automatic-equivalent-rebates.router.js";
import CreateNewPinRouter from "./server/router/create-new-pin.router.js";
import NewMemberRouter from "./server/router/new-member.router.js";
import StockInventoryRouter from "./server/router/stock-inventory.router.js";
import NewOrderRouter from "./server/router/new-order.router.js";
import UpgradeAccountRouter from "./server/router/upgrade-account.router.js";
import IncomeHistoryRouter from "./server/router/income-history.router.js";
import GivePinToStockistRouter from "./server/router/give-pin-to-stockist.router.js";
import PinHistoryRouter from "./server/router/pin-history.router.js";
import FixerRouter from "./server/router/fixer.router.js";

const __dirname = path.resolve();

dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log("Connected to Database!");
});

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + "/dist/pure-angel-coffee"));

app.use(UtilsRouter);

app.use("/api/user", UserRouter);
app.use("/api/admin", AdminRouter);
app.use("/api/mega-center", MegaCenterRouter);
app.use("/api/genealogy", GenealogyRouter);
app.use("/api/direct-referral", DirectReferralRouter);
app.use("/api/indirect-referral", IndirectReferralRouter);
app.use("/api/pairing-bonus", PairingBonusRouter);
app.use("/api/user-cashouts", UserCashouts);

app.use("/api/aer", AutomaticEquivalentRebatesRouter);

app.use("/api/income-history", IncomeHistoryRouter);
app.use("/api/pin-history", PinHistoryRouter);

app.use("/api/create-new-pin", CreateNewPinRouter);
app.use("/api/give-pin-to-stockist", GivePinToStockistRouter);

app.use("/api/upgrade-account", UpgradeAccountRouter);
app.use("/api/new-member", NewMemberRouter);
app.use("/api/new-order", NewOrderRouter);
app.use("/api/stock-inventory", StockInventoryRouter);

app.use("/api/seed", SeedRouter);
app.use("/api/fixer", FixerRouter);

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname + "/dist/pure-angel-coffee/index.html"));
});

app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});
