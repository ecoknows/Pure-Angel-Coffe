import express from "express";
import expressAsyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import {
  modifyAdmin,
  createAdminUser,
  createOwner,
  payBonuses,
  createMegaCenters,
  createHeads,
} from "../utils/seed.js";

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
      array: [1, 2, 4, 8],
      name: "( 31 Heads )",
      username: "-31-heads",
    },
  ];

  const mega_centers = await User.find({
    is_mega_center: true,
  });

  for (let i = 0; i < mega_centers.length; i++) {
    await createHeads(mega_centers[i], mega_centers[i], heads_info, 0);
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
    username: body.username,
    is_mega_center: true,
  });

  for (let i = 15; i <= 30; i++) {
    const current_head = await User.findOne({
      username: body.username + "-" + i.toString() + "-31-heads",
    });

    const heads_info = [
      {
        array: [1, 2, 4],
        name: "( 15 Heads )",
        username: "-" + i.toString() + "-root-15-heads",
      },
    ];

    await createHeads(mega_center, current_head, heads_info, 0);
  }
}

SeedRouter.post(
  "/fifteen-heads",
  expressAsyncHandler(async (req, res) => {
    FifteenHeads(req, res);
    res.send({ message: "Sucessfully Seed 31 Heads!" });
  })
);

async function SevenHeads(req, res) {
  const body = req.body;

  const mega_center = await User.findOne({
    username: body.username,
    is_mega_center: true,
  });

  //15 - 30

  for (let i = 7; i <= 14; i++) {
    const current_head = await User.findOne({
      username:
        body.username +
        "-" +
        i.toString() +
        "-" +
        body.root_number +
        "-root-15-heads",
    });

    const heads_info = [
      {
        array: [1, 2],
        name: "( 7 Heads )",
        username: "-" + i.toString() + "-root-7-heads",
      },
    ];

    await createHeads(mega_center, current_head, heads_info, 0);
  }
}

SeedRouter.post(
  "/seven-heads",
  expressAsyncHandler(async (req, res) => {
    SevenHeads(req, res);
    res.send({ message: "Sucessfully Seed 31 Heads!" });
  })
);

async function ThreeHeads(req, res) {
  const body = req.body;

  const mega_center = await User.findOne({
    username: body.username,
    is_mega_center: true,
  });

  //15 - 30

  for (let root = 7; root <= 14; root++) {
    for (let i = 3; i <= 6; i++) {
      const current_head = await User.findOne({
        username:
          body.username +
          "-" +
          i.toString() +
          "-" +
          root.toString() +
          "-root-7-heads",
      });

      const heads_info = [
        {
          array: [1, 2],
          name: "( 7 Heads )",
          username: "-" + i.toString() + "-root-3-heads",
        },
      ];

      await createHeads(mega_center, current_head, heads_info, 0);
    }
  }
}

SeedRouter.post(
  "/three-heads",
  expressAsyncHandler(async (req, res) => {
    ThreeHeads(req, res);
    res.send({ message: "Sucessfully Seed 31 Heads!" });
  })
);

export default SeedRouter;
