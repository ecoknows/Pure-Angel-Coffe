import User from "../models/user.model.js";
import Genealogy from "../models/genealogy.model.js";

export async function initializeUpgradeAccount(req, res, next) {
  const body = req.body;
  const searched_account = await User.findById(body.account_id);

  if (searched_account && searched_account.is_mega_center == undefined) {
    req.searched_account = searched_account;

    next();
  } else {
    res.status(404).send({
      message:
        "That Account is Invalid please check if it is existing account, and also you cannot upgrade already mega center account",
    });
  }
}

export async function upgradeToStockist(req, res, next) {
  const body = req.body;

  const searched_account = req.searched_account;

  if (body.status == "stockist") {
    searched_account.is_stockist = true;
    searched_account.is_mega_center = undefined;
    await searched_account.save();

    const mega_center = await User.findOne({
      account_number: body.mega_center_account_number,
    });

    if (mega_center) {
      searched_account.secret_code_suffix = mega_center.secret_code_suffix;

      await searched_account.save();

      next();
    } else {
      res.status(404).send({
        message: "Invalid Mega Center Account Number",
      });
    }
  } else {
    next();
  }
}

export async function upgradeToMegaCenter(req, res, next) {
  const body = req.body;

  const searched_account = req.searched_account;

  if (body.status == "mega-center") {
    searched_account.is_mega_center = true;
    searched_account.secret_code_suffix = body.assign_area;
    searched_account.is_stockist = undefined;
    await searched_account.save();
  }
  next();
}

export async function upgradeToMember(req, res, next) {
  const body = req.body;

  const searched_account = req.searched_account;

  if (body.status == "member") {
    searched_account.is_stockist = undefined;
    searched_account.is_mega_center = undefined;
    await searched_account.save();
  }
  next();
}

export async function updateGenealogy(req, res, next) {
  const body = req.body;
  const searched_account = req.searched_account;

  const searched_account_genealogy = await Genealogy.findOne({
    user_id: searched_account._id,
  });

  if (searched_account_genealogy) {
    if (body.status == "stockist") {
      searched_account_genealogy.is_stockist = true;
      searched_account_genealogy.is_mega_center = undefined;
      await searched_account_genealogy.save();
    } else if (body.status == "mega-center") {
      searched_account_genealogy.is_mega_center = true;
      searched_account_genealogy.is_stockist = undefined;
      await searched_account_genealogy.save();
    } else if (body.status == "member") {
      searched_account_genealogy.is_mega_center = undefined;
      searched_account_genealogy.is_stockist = undefined;
      await searched_account_genealogy.save();
    }
  }

  const root_user_genealogy = searched_account.root_user_genealogy;

  const root_account_genealogy = await Genealogy.findOne({
    user_id: root_user_genealogy.user_id,
  });

  if (root_account_genealogy) {
    if (root_user_genealogy.position == "left") {
      if (body.status == "stockist") {
        root_account_genealogy.left_branch.is_stockist = true;
        root_account_genealogy.left_branch.is_mega_center = undefined;
        await root_account_genealogy.save();
      } else if (body.status == "mega-center") {
        root_account_genealogy.left_branch.is_mega_center = true;
        root_account_genealogy.left_branch.is_stockist = undefined;
        await root_account_genealogy.save();
      } else if (body.status == "member") {
        root_account_genealogy.left_branch.is_mega_center = undefined;
        root_account_genealogy.left_branch.is_stockist = undefined;
        await root_account_genealogy.save();
      }
    } else if (root_user_genealogy.position == "right") {
      if (body.status == "stockist") {
        root_account_genealogy.right_branch.is_stockist = true;
        root_account_genealogy.right_branch.is_mega_center = undefined;
        await root_account_genealogy.save();
      } else if (body.status == "mega-center") {
        root_account_genealogy.right_branch.is_mega_center = true;
        root_account_genealogy.right_branch.is_stockist = undefined;
        await root_account_genealogy.save();
      } else if (body.status == "member") {
        root_account_genealogy.right_branch.is_mega_center = undefined;
        root_account_genealogy.right_branch.is_stockist = undefined;
        await root_account_genealogy.save();
      }
    }
  }

  res.send({
    message: "Successfully Upgrade User!",
  });
}
