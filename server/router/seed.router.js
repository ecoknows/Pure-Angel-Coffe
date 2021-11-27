import express from "express";
import expressAsyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import UserVerification from "../models/user.verification.model.js";
import Genealogy from "../models/genealogy.model.js";
import {
  modifyAdmin,
  createAdminUser,
  createOwner,
  payBonuses,
  createMegaCenters,
  createHeads,
} from "../utils/seed.js";

import { TextMe } from "../middlewares/text-message.js";
import { WELCOME_TEXT_MESSAGE } from "../constants.js";

let SeedRouter = express.Router();

async function SeedStructure(req, res) {
  const owner = await createOwner();

  const left_admin = await createAdminUser(owner, "left", 1);
  const right_admin = await createAdminUser(owner, "right", 2);

  await modifyAdmin(owner, left_admin, right_admin);

  await payBonuses(left_admin);
  await payBonuses(right_admin);

  await createMegaCenters(left_admin, right_admin);

  const heads_info = [
    {
      array: [1, 2, 4, 8, 16],
    },
  ];

  const mega_centers = await User.find({
    is_mega_center: true,
  });

  for (let i = 0; i < mega_centers.length; i++) {
    await createHeads(
      mega_centers[i],
      mega_centers[i],
      heads_info,
      0,
      15,
      15,
      2,
      32
    );
  }
}

SeedRouter.post(
  "/",
  expressAsyncHandler(async (req, res) => {
    SeedStructure(req, res);
    res.send({ message: "Sucessfully Seed 31 Heads!" });
  })
);

async function FifteenHeads(req, res) {
  const body = req.body;

  const mega_center = await User.findOne({
    account_number: body.account_number,
    is_mega_center: true,
  });

  let ending_code = req.body.ending_code;

  for (let i = req.body.leader; i <= req.body.last_leader; i += 15) {
    const current_head = await User.findOne({
      account_number: mega_center.secret_code_suffix + "0" + i.toString(),
    });

    const heads_info = [
      {
        array: [1, 2, 4, 8],
      },
    ];

    await createHeads(
      mega_center,
      current_head,
      heads_info,
      0,
      7,
      7,
      i + 1,
      ending_code
    );
    ending_code += 112;
  }
}

SeedRouter.post(
  "/fifteen-heads",
  expressAsyncHandler(async (req, res) => {
    FifteenHeads(req, res);
    res.send({ message: "Sucessfully Seed 15 Heads!" });
  })
);

async function SevenHeads(req, res, codigs) {
  const body = req.body;

  const mega_center = await User.findOne({
    account_number: body.account_number,
    is_mega_center: true,
  });

  let number = req.body.number;

  let ending_code = codigs[number].ending_code;

  for (let i = codigs[number].leader; i <= codigs[number].last_leader; i += 7) {
    const current_head = await User.findOne({
      account_number: mega_center.secret_code_suffix + "0" + i.toString(),
    });

    const heads_info = [
      {
        array: [1, 2, 4],
      },
    ];

    await createHeads(
      mega_center,
      current_head,
      heads_info,
      0,
      3,
      3,
      i + 1,
      ending_code
    );
    ending_code += 24;
  }
}

SeedRouter.post(
  "/seven-heads",
  expressAsyncHandler(async (req, res) => {
    const codigs = [
      {
        leader: 512,
        last_leader: 729,
        ending_code: 4096,
        expected_total_number: 448,
      },
      {
        leader: 736,
        last_leader: 953,
        ending_code: 4864,
        expected_total_number: 896,
      },
      {
        leader: 960,
        last_leader: 1177,
        ending_code: 5632,
        expected_total_number: 1344,
      },
      {
        leader: 1184,
        last_leader: 1401,
        ending_code: 6400,
        expected_total_number: 1792,
      },
      {
        leader: 1408,
        last_leader: 1625,
        ending_code: 7168,
        expected_total_number: 2240,
      },
      {
        leader: 1632,
        last_leader: 1849,
        ending_code: 7936,
        expected_total_number: 2688,
      },
      {
        leader: 1856,
        last_leader: 2073,
        ending_code: 8704,
        expected_total_number: 3136,
      },
      {
        leader: 2080,
        last_leader: 2297,
        ending_code: 9472,
        expected_total_number: 3584,
      },
      {
        leader: 2304,
        last_leader: 2521,
        ending_code: 10240,
        expected_total_number: 4032,
      },
      {
        leader: 2528,
        last_leader: 2745,
        ending_code: 11008,
        expected_total_number: 4480,
      },
      {
        leader: 2752,
        last_leader: 2969,
        ending_code: 11776,
        expected_total_number: 4928,
      },
      {
        leader: 2976,
        last_leader: 3193,
        ending_code: 12544,
        expected_total_number: 5376,
      },
      {
        leader: 3200,
        last_leader: 3417,
        ending_code: 13312,
        expected_total_number: 5824,
      },
      {
        leader: 3424,
        last_leader: 3641,
        ending_code: 14080,
        expected_total_number: 6272,
      },
      {
        leader: 3648,
        last_leader: 3865,
        ending_code: 14848,
        expected_total_number: 6720,
      },
      {
        leader: 3872,
        last_leader: 4089,
        ending_code: 15616,
        expected_total_number: 7168,
      },
    ];

    SevenHeads(req, res, codigs);
    res.send({
      message: "Sucessfully Seed 7 Heads!",
      expected_total_number:
        codigs[req.body.number].expected_total_number +
        req.body.last_total_ending,
    });
  })
);

async function ThreeHeads(req, res, codigs) {
  const body = req.body;

  const mega_center = await User.findOne({
    account_number: body.account_number,
    is_mega_center: true,
  });

  let number = req.body.number;

  for (let i = codigs[number].leader; i <= codigs[number].last_leader; i += 3) {
    const current_head = await User.findOne({
      account_number: mega_center.secret_code_suffix + "0" + i.toString(),
    });

    const heads_info = [
      {
        array: [1],
      },
    ];

    await createHeads(
      mega_center,
      current_head,
      heads_info,
      0,
      undefined,
      null,
      i + 1,
      null
    );
  }
}

SeedRouter.post(
  "/three-heads",
  expressAsyncHandler(async (req, res) => {
    const codigs = [
      {
        leader: 4096,
        last_leader: 4678,
        expected_total_number: 390,
      },
      {
        leader: 4681,
        last_leader: 5263,
        expected_total_number: 780,
      },
      {
        leader: 5266,
        last_leader: 5848,
        expected_total_number: 1170,
      },
      {
        leader: 5851,
        last_leader: 6433,
        expected_total_number: 1560,
      },
      {
        leader: 6436,
        last_leader: 7018,
        expected_total_number: 1950,
      },
      {
        leader: 7021,
        last_leader: 7603,
        expected_total_number: 2340,
      },
      {
        leader: 7606,
        last_leader: 8188,
        expected_total_number: 2730,
      },
      {
        leader: 8191,
        last_leader: 8773,
        expected_total_number: 3120,
      },
      {
        leader: 8776,
        last_leader: 9358,
        expected_total_number: 3510,
      },
      {
        leader: 9361,
        last_leader: 9943,
        expected_total_number: 3900,
      },
      {
        leader: 9946,
        last_leader: 10528,
        expected_total_number: 4290,
      },
      {
        leader: 10531,
        last_leader: 11113,
        expected_total_number: 4680,
      },
      {
        leader: 11116,
        last_leader: 11698,
        expected_total_number: 5070,
      },
      {
        leader: 11701,
        last_leader: 12283,
        expected_total_number: 5460,
      },
      {
        leader: 12286,
        last_leader: 12868,
        expected_total_number: 5850,
      },
      {
        leader: 12871,
        last_leader: 13453,
        expected_total_number: 6240,
      },
      {
        leader: 13456,
        last_leader: 14038,
        expected_total_number: 6630,
      },
      {
        leader: 14041,
        last_leader: 14623,
        expected_total_number: 7020,
      },
      {
        leader: 14626,
        last_leader: 15208,
        expected_total_number: 7410,
      },
      {
        leader: 15211,
        last_leader: 15793,
        expected_total_number: 7800,
      },
      {
        leader: 15796,
        last_leader: 16381,
        expected_total_number: 8192,
      },
    ];

    ThreeHeads(req, res, codigs);

    res.send({
      message: "Sucessfully Seed 3 Heads!",
      expected_total_number:
        codigs[req.body.number].expected_total_number +
        req.body.last_total_ending,
    });
  })
);

async function ModifySevenHeads(req, res, number) {
  const users = await User.find({
    last_name: "Tijada " + number.toString() + " ( 7 Heads )",
  });
  let count = 7;
  let roots = 15;
  for (let x = 0; x < users.length; x++) {
    const user = await User.findById(users[x]._id);

    user.username =
      "analee-" +
      number.toString() +
      "-" +
      count.toString() +
      "-root-" +
      roots.toString() +
      "-root-7-heads";

    await user.save();

    if (count == 14) {
      count = 7;
      roots++;
    } else {
      count++;
    }
  }
}

SeedRouter.post(
  "/modify-seven-heads",
  expressAsyncHandler(async (req, res) => {
    await ModifySevenHeads(req, res, 1);
    await ModifySevenHeads(req, res, 2);
    await ModifySevenHeads(req, res, 3);
    await ModifySevenHeads(req, res, 4);
    await ModifySevenHeads(req, res, 5);
    await ModifySevenHeads(req, res, 6);
    res.send({ message: "Sucessfully Modify 7 Heads" });
  })
);

SeedRouter.post(
  "/clear-unpaid",
  expressAsyncHandler(async (req, res) => {
    await UserVerification.updateMany({}, { unpaid_income: 0 });

    //unpaid

    res.send({ message: "Sucessfully Clear Unpaid" });
  })
);

SeedRouter.post(
  "/account-number",
  expressAsyncHandler(async (req, res) => {
    const users = await User.find({ first_name: req.body.first_name }).sort({
      createdAt: 1,
    });
    await User.updateMany(
      { first_name: req.body.first_name },
      { $unset: { username: 1 } }
    );

    for (let i = 0; i < users.length; i++) {
      const user = await User.findById(users[i]._id);

      user.account_number = req.body.code + i.toString();
      user.secret_code_suffix = req.body.code;

      await user.save();
    }

    res.send({ message: "Sucessfully Updated Username" });
  })
);

SeedRouter.post(
  "/genealogy-account-number",
  expressAsyncHandler(async (req, res) => {
    const genealogies = await Genealogy.find({
      first_name: req.body.first_name,
    });

    for (let i = 0; i < genealogies.length; i++) {
      const genealogy = await Genealogy.findById(genealogies[i]._id);

      const user = await User.findById(genealogy.user_id);
      const leader_number = parseInt(
        user.account_number.substring(req.body.code.length)
      );

      genealogy.account_number = user.account_number;

      const left_count = leader_number * 2 + 1;
      const right_count = leader_number * 2 + 2;

      genealogy.left_branch.account_number =
        req.body.code + left_count.toString();
      genealogy.right_branch.account_number =
        req.body.code + right_count.toString();

      if (genealogy.left_count > 0) {
        const child_count = (genealogy.left_count + 1) / 2;

        genealogy.left_branch.left_count = child_count - 1;
        genealogy.left_branch.right_count = child_count - 1;

        genealogy.right_branch.left_count = child_count - 1;
        genealogy.right_branch.right_count = child_count - 1;
      }

      await genealogy.save();
    }

    res.send({ message: "Sucessfully Updated Genealogy" });
  })
);

async function AssignLeaders(req, i) {
  const user = await User.findOne({
    account_number: req.body.code + "0" + i.toString(),
  });

  user.free_account_leader = req.body.free_account_leader;

  user.save();
}

SeedRouter.post(
  "/leaders",
  expressAsyncHandler(async (req, res) => {
    for (let i = req.body.start; i <= req.body.end; i += req.body.count) {
      AssignLeaders(req, i);
    }

    res.send({ message: "Sucessfully Put leaders!" });
  })
);

SeedRouter.post(
  "/check-leaders",
  expressAsyncHandler(async (req, res) => {
    const leaders = await User.find({
      secret_code_suffix: req.body.code,
      free_account_leader: req.body.free_account_leader,
    });

    res.send({ message: "Sucessfully Put leaders!", leaders: leaders.length });
  })
);

SeedRouter.get(
  "/vonage",
  expressAsyncHandler(async (req, res) => {
    // const from = "EDTESS APIs";
    // const to = "639284060320";
    // const text = "A text message sent using the Vonage SMS API";

    // const vonage = new Vonage({
    //   apiKey: "da0e5c7e",
    //   apiSecret: "pMScP469a641PDWs",
    // });

    // vonage.message.sendSms(from, to, text, (err, responseData) => {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     if (responseData.messages[0]["status"] === "0") {
    //       console.log("Message sent successfully.");
    //     } else {
    //       console.log(
    //         `Message failed with error: ${responseData.messages[0]["error-text"]}`
    //       );
    //     }
    //   }
    // });

    // request.post(
    //   "https://textbelt.com/text",
    //   {
    //     form: {
    //       phone: "639686097100",
    //       message: "Hello world",
    //       key: "textbelt",
    //     },
    //   },
    //   (err, httpResponse, body) => {
    //     console.log(JSON.parse(body));
    //   }
    // );

    res.send({ message: "Sucessfully Put leaders!" });
  })
);

SeedRouter.get(
  "/test-async",
  expressAsyncHandler(async (req, res) => {
    // TextMe("09686097100", "GUMAGANA ANG API!");
    // itexmo({ apiCode: "TR-JERIC060320_2IN3G" });
  })
);

export default SeedRouter;
