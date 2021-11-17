import Genealogy from "../models/genealogy.model.js";
import User from "../models/user.model.js";
import UserVerification from "../models/user.verification.model.js";
import { nanoid } from "nanoid";

import bcrypt from "bcryptjs";
import DirectReferral from "../models/direct-referral.model.js";
import {
  DIRECT_REFERRAL_PAYMENT,
  INDIRECT_REFERRAL_LIMIT,
  INDIRECT_REFERRAL_PAYMENT,
  PAIRING_BONUS_PAYMENT,
  ADMIN_NEW_MEMBER_INCOME,
  MEGA_CENTER_NEW_MEMBER_INCOME,
  STOCKIST_NEW_MEMBER_INCOME,
  PAIRING_BONUS_MAX_COUNT_PER_DAY,
  PAIRING_BONUS_TYPE,
  PAIRING_PRODUCT_VOUCHER_PAYMENT,
  PRODUCT_VOUCHER_TYPE,
} from "../constants.js";
import IndirectReferral from "../models/indirect-referral.model.js";
import PairingBonus from "../models/pairing-bonus.model.js";
import NewMemberIncome from "../models/new-member-income.model.js";

import moment from "moment";

export async function initializeNewMember(req, res, next) {
  const body = req.body;

  const place_under_user = await User.findOne({
    account_number: body.place_under_account,
  });

  const referral_user = await User.findOne({
    account_number: body.referral_account,
  });

  const user = await User.findById(req.user._id);

  if (
    user &&
    place_under_user &&
    referral_user &&
    user.ending_pin >= 0 &&
    user.number_of_pin
  ) {
    req.user = user;
    req.referral_user = referral_user;
    req.place_under_user = place_under_user;
    next();
  } else {
    res.status(409).send({ message: "Invalid User!" });
  }
}

export async function increaseEndingPinDecreaseNumberOfPin(req, res, next) {
  const user = req.user;

  if (user) {
    user.ending_pin = user.ending_pin + 1;
    user.number_of_pin = user.number_of_pin - 1;

    await user.save();

    next();
  } else {
    res.status(404).send({ message: "User Doesn't exist" });
  }
}

export async function createChildUser(req, res, next) {
  const body = req.body;
  const position = body.position;
  const referral_user = req.referral_user;
  const place_under_user = req.place_under_user;
  const password = nanoid(10);

  let child_user = new User({
    account_number: body.account_number,
    password: bcrypt.hashSync(password, 8),
    temporary_password: password,
    user_number: body.user_number,

    first_name: body.first_name,
    last_name: body.last_name,

    contact_number: body.contact_number,
    secret_code_suffix: referral_user.secret_code_suffix,

    mega_center: referral_user?.is_mega_center
      ? {
          user_id: referral_user._id,
          first_name: referral_user.first_name,
          last_name: referral_user.last_name,
        }
      : referral_user?.mega_center
      ? {
          user_id: referral_user.mega_center.user_id,
          first_name: referral_user.mega_center.first_name,
          last_name: referral_user.mega_center.last_name,
        }
      : undefined,

    root_user_genealogy: {
      user_id: place_under_user._id,
      first_name: place_under_user.first_name,
      last_name: place_under_user.last_name,
      address: place_under_user.address,
      position: position,
    },

    user_that_invite: {
      user_id: referral_user._id,
      first_name: referral_user.first_name,
      last_name: referral_user.last_name,
      address: referral_user.address,
    },
  });

  req.child_user = await child_user.save();

  next();
}

export async function createChildVerification(req, res, next) {
  const child_user = req.child_user;
  const referral_user = req.referral_user;
  const place_under_user = req.place_under_user;
  const position = req.body.position;

  let child_user_verification = new UserVerification({
    account_number: child_user.account_number,
    user_id: child_user._id,
    first_name: child_user.first_name,
    last_name: child_user.last_name,

    mega_center: referral_user?.is_mega_center
      ? {
          user_id: referral_user._id,
          first_name: referral_user.first_name,
          last_name: referral_user.last_name,
        }
      : referral_user?.mega_center
      ? {
          user_id: referral_user.mega_center.user_id,
          first_name: referral_user.mega_center.first_name,
          last_name: referral_user.mega_center.last_name,
        }
      : undefined,

    user_that_invite: {
      user_id: referral_user._id,
      first_name: referral_user.first_name,
      last_name: referral_user.last_name,
      address: referral_user.address,
    },
    root_user_genealogy: {
      user_id: place_under_user._id,
      first_name: place_under_user.first_name,
      last_name: place_under_user.last_name,
      address: place_under_user.address,
      position: position,
    },
  });

  if (referral_user) {
    child_user_verification.indirect_referral_user.user_id =
      referral_user.user_that_invite.user_id;

    child_user_verification.indirect_referral_user.first_name =
      referral_user.user_that_invite.first_name;

    child_user_verification.indirect_referral_user.last_name =
      referral_user.user_that_invite.last_name;

    child_user_verification.indirect_referral_user.address =
      referral_user.user_that_invite.address;
  }

  await child_user_verification.save();

  next();
}

export async function updateGenealogy(req, res, next) {
  const position = req.body.position;
  const place_under_user = req.place_under_user;
  const child_user = req.child_user;
  const genealogy = await Genealogy.findOne({
    user_id: place_under_user._id,
  });

  req.genealogy = genealogy;

  if (genealogy) {
    if (position == "left") {
      genealogy.left_branch = {
        user_id: child_user._id,
        account_number: child_user.account_number,

        user_that_invite: {
          user_id: child_user.user_that_invite.user_id,
          first_name: child_user.user_that_invite.first_name,
          last_name: child_user.user_that_invite.last_name,
          address: child_user.user_that_invite.address,
        },

        first_name: child_user.first_name,
        last_name: child_user.last_name,
        address: child_user.address,
      };
      req.genealogy = await genealogy.save();
    } else if (position == "right") {
      genealogy.right_branch = {
        user_id: child_user._id,
        account_number: child_user.account_number,

        user_that_invite: {
          user_id: child_user.user_that_invite.user_id,
          first_name: child_user.user_that_invite.first_name,
          last_name: child_user.user_that_invite.last_name,
          address: child_user.user_that_invite.address,
        },
        first_name: child_user.first_name,
        last_name: child_user.last_name,
        address: child_user.address,
      };
      req.genealogy = await genealogy.save();
    }
  }

  next();
}

export async function addNewGenealogy(req, res, next) {
  let genealogy = req.genealogy;
  const place_under_user = req.place_under_user;
  const position = req.body.position;
  const child_user = req.child_user;

  if (genealogy == undefined) {
    if (position == "left") {
      genealogy = new Genealogy({
        user_id: place_under_user._id,
        account_number: place_under_user.account_number,
        first_name: place_under_user.first_name,
        last_name: place_under_user.last_name,
        address: place_under_user.address,

        is_stockist: place_under_user.is_stockist,
        is_admin: place_under_user.is_admin,
        is_mega_center: place_under_user.is_mega_center,
        is_owner: place_under_user.is_owner,

        user_that_invite: place_under_user?.user_that_invite
          ? {
              user_id: place_under_user.user_that_invite.user_id,
              first_name: place_under_user.user_that_invite.first_name,
              last_name: place_under_user.user_that_invite.last_name,
              address: place_under_user.user_that_invite.address,
            }
          : undefined,

        left_branch: {
          user_id: child_user._id,
          account_number: child_user.account_number,
          user_that_invite: {
            user_id: child_user.user_that_invite.user_id,
            first_name: child_user.user_that_invite.first_name,
            last_name: child_user.user_that_invite.last_name,
            address: child_user.user_that_invite.address,
          },

          first_name: child_user.first_name,
          last_name: child_user.last_name,
          address: child_user.address,

          is_stockist: child_user.is_stockist,
          is_admin: child_user.is_admin,
          is_mega_center: child_user.is_mega_center,
        },
      });
      req.genealogy = await genealogy.save();
    } else if (position == "right") {
      genealogy = new Genealogy({
        user_id: place_under_user._id,
        account_number: place_under_user.account_number,
        first_name: place_under_user.first_name,
        last_name: place_under_user.last_name,
        address: place_under_user.address,
        account_number: place_under_user.account_number,

        is_stockist: place_under_user.is_stockist,
        is_admin: place_under_user.is_admin,
        is_mega_center: place_under_user.is_mega_center,
        is_owner: place_under_user.is_owner,

        user_that_invite: place_under_user?.user_that_invite
          ? {
              user_id: place_under_user.user_that_invite.user_id,
              first_name: place_under_user.user_that_invite.first_name,
              last_name: place_under_user.user_that_invite.last_name,
              address: place_under_user.user_that_invite.address,
            }
          : undefined,

        right_branch: {
          user_id: child_user._id,
          account_number: child_user.account_number,

          user_that_invite: {
            user_id: child_user.user_that_invite.user_id,
            first_name: child_user.user_that_invite.first_name,
            last_name: child_user.user_that_invite.last_name,
            address: child_user.user_that_invite.address,
          },

          first_name: child_user.first_name,
          last_name: child_user.last_name,
          address: child_user.address,

          is_stockist: child_user.is_stockist,
          is_admin: child_user.is_admin,
          is_mega_center: child_user.is_mega_center,
        },
      });
      req.genealogy = await genealogy.save();
    }
  }

  next();
}

export async function addDirectReferral(req, res, next) {
  const referral_user = req.referral_user;
  const child_user = req.child_user;

  const newDirectReferral = new DirectReferral({
    account_number: referral_user.account_number,
    user_id: referral_user._id,
    first_name: referral_user.first_name,
    last_name: referral_user.last_name,
    address: referral_user.address,

    root_user: {
      user_id: child_user.root_user_genealogy.user_id,
      first_name: child_user.root_user_genealogy.first_name,
      last_name: child_user.root_user_genealogy.last_name,
      address: child_user.root_user_genealogy.address,
    },

    user: {
      account_number: child_user.account_number,
      user_id: child_user._id,
      first_name: child_user.first_name,
      last_name: child_user.last_name,
      address: child_user.address,
    },

    value: DIRECT_REFERRAL_PAYMENT,
  });

  await newDirectReferral.save();

  next();
}

export async function recurIndirectReferral(req, res, next) {
  const referral_user = req.referral_user;
  const child_user = req.child_user;

  await addIndirectReferral(
    referral_user.user_that_invite.user_id,
    referral_user,
    child_user,
    referral_user,
    0
  );

  next();
}

export async function recurPairingBonus(req, res, next) {
  const child_user = req.child_user;

  await addPairingBonus(child_user, child_user);

  next();
}

export async function recurModifyBranchCountOfRoot(req, res, next) {
  const place_under_user = req.place_under_user;

  await modifyBranchCountOfRoot(
    place_under_user._id,
    req.body.position,
    undefined
  );

  next();
}

export async function payDirectReferral(req, res, next) {
  const user_to_verify = await UserVerification.findOne({
    user_id: req.child_user._id,
  });

  const user_that_invite = await UserVerification.findOne({
    user_id: user_to_verify.user_that_invite.user_id,
  });

  if (user_that_invite) {
    user_that_invite.direct_referral =
      user_that_invite.direct_referral + DIRECT_REFERRAL_PAYMENT;

    user_that_invite.overall_income =
      user_that_invite.overall_income + DIRECT_REFERRAL_PAYMENT;

    await user_that_invite.save();
  }

  req.user_to_verify = user_to_verify;

  next();
}

export async function payIndirectReferral(req, res, next) {
  const user_to_verify = req.user_to_verify;

  const id_of_the_indirect_referral =
    user_to_verify.indirect_referral_user.user_id;

  await indirectReferralRecursion(
    user_to_verify,
    id_of_the_indirect_referral,
    0
  );

  next();
}

export async function checkIfThereIsPairingBonus(req, res, next) {
  const user_to_verify = req.user_to_verify;

  const pairingBonuses = await PairingBonus.find({
    $or: [
      {
        "left.user_id": user_to_verify.user_id,
        right: { $exists: true },
      },
      {
        "right.user_id": user_to_verify.user_id,
        left: { $exists: true },
      },
    ],
  });

  if (pairingBonuses) {
    for (let i = 0; i < pairingBonuses.length; i++) {
      const pairingBonus = await PairingBonus.findById(pairingBonuses[i]._id);

      const user = await UserVerification.findOne({
        user_id: pairingBonus.user_id,
      });

      const left = await UserVerification.findOne({
        user_id: pairingBonus.left.user_id,
      });
      const right = await UserVerification.findOne({
        user_id: pairingBonus.right.user_id,
      });

      if (left.verified && right.verified && pairingBonus.payed == false) {
        await updatePairingStatus(user, pairingBonus);
      }
    }
  }

  next();
}

export async function checkTotalIncome(req, res, next) {
  const user = req.user;

  if (user.is_mega_center) {
    req.total_income = MEGA_CENTER_NEW_MEMBER_INCOME;
  } else if (user.is_stockist) {
    req.total_income = STOCKIST_NEW_MEMBER_INCOME;
  } else if (user.is_admin) {
    req.total_income = ADMIN_NEW_MEMBER_INCOME;
  }

  next();
}

export async function newMemberIncome(req, res, next) {
  const user = req.user;

  const total_income = req.total_income;

  if (user.is_mega_center || user.is_stockist || user.is_admin) {
    const user_verification = await UserVerification.findOne({
      user_id: user._id,
    });
    if (user_verification.new_member_income) {
      user_verification.new_member_income =
        user_verification.new_member_income + total_income;

      user_verification.overall_income =
        user_verification.overall_income + total_income;

      user_verification.unpaid_income =
        user_verification.unpaid_income + total_income;
    } else {
      user_verification.new_member_income = total_income;

      user_verification.overall_income =
        user_verification.overall_income + total_income;

      user_verification.unpaid_income =
        user_verification.unpaid_income + total_income;
    }

    await user_verification.save();

    await createNewMemberIncome(req);
  }

  next();
}

export async function unpaidIncome(req, res, next) {
  const user = req.user;
  const total_income = req.total_income;

  if (total_income) {
    user.unpaid_income = user.unpaid_income + total_income;
    user.overall_income = user.overall_income + total_income;
  }

  await user.save();

  next();
}

async function addIndirectReferral(
  id_indirect_referral,
  current_user,
  child_user,
  user_that_invite,
  count
) {
  const indirect_referral_user = await User.findById(id_indirect_referral);

  if (
    indirect_referral_user &&
    count < 5 &&
    user_that_invite._id != indirect_referral_user._id
  ) {
    const newIndirectReferral = await new IndirectReferral({
      account_number: indirect_referral_user.account_number,
      user_id: indirect_referral_user._id,
      first_name: indirect_referral_user.first_name,
      last_name: indirect_referral_user.last_name,
      address: indirect_referral_user.address,

      user_that_invite: {
        account_number: current_user.account_number,
        user_id: current_user._id,
        first_name: current_user.first_name,
        last_name: current_user.last_name,
        address: current_user.address,
      },

      user: {
        account_number: child_user.account_number,
        user_id: child_user._id,
        first_name: child_user.first_name,
        last_name: child_user.last_name,
        address: child_user.address,
      },

      value: INDIRECT_REFERRAL_PAYMENT,
    });

    await newIndirectReferral.save();

    await addIndirectReferral(
      indirect_referral_user.user_that_invite.user_id,
      current_user,
      child_user,
      user_that_invite,
      count + 1
    );
  }
}

async function addPairingBonus(child_user, new_root_user) {
  const new_user_genealogy = new_root_user.root_user_genealogy;

  const rootUserVerification = await UserVerification.findOne({
    user_id: new_user_genealogy.user_id,
  });

  const rooUser = await User.findById(new_user_genealogy.user_id);

  if (rootUserVerification) {
    if (new_user_genealogy.position == "left") {
      const checkIfThereIsLeft = await PairingBonus.findOne({
        user_id: rootUserVerification.user_id,
        left: undefined,
      });

      if (checkIfThereIsLeft) {
        checkIfThereIsLeft.left = {
          account_number: child_user.account_number,
          user_id: child_user._id,
          first_name: child_user.first_name,
          last_name: child_user.last_name,
          address: child_user.address,
        };

        await checkIfThereIsLeft.save();
      } else {
        const newPairing = new PairingBonus({
          account_number: rooUser.account_number,
          user_id: rooUser._id,
          first_name: rooUser.first_name,
          last_name: rooUser.last_name,
          address: rooUser.address,

          left: {
            account_number: child_user.account_number,
            user_id: child_user._id,
            first_name: child_user.first_name,
            last_name: child_user.last_name,
            address: child_user.address,
          },

          value: PAIRING_BONUS_PAYMENT,
        });

        await newPairing.save();
      }

      const newRootUser = await rootUserVerification.save();
      await addPairingBonus(child_user, newRootUser);
    } else if (new_user_genealogy.position == "right") {
      const checkIfThereIsRight = await PairingBonus.findOne({
        user_id: rootUserVerification.user_id,
        right: undefined,
      });

      if (checkIfThereIsRight) {
        checkIfThereIsRight.right = {
          account_number: child_user.account_number,
          user_id: child_user._id,
          first_name: child_user.first_name,
          last_name: child_user.last_name,
          address: child_user.address,
        };

        await checkIfThereIsRight.save();
      } else {
        const newPairing = new PairingBonus({
          account_number: rooUser.account_number,
          user_id: rooUser._id,
          first_name: rooUser.first_name,
          last_name: rooUser.last_name,
          address: rooUser.address,

          right: {
            account_number: child_user.account_number,
            user_id: child_user._id,
            first_name: child_user.first_name,
            last_name: child_user.last_name,
            address: child_user.address,
          },

          value: PAIRING_BONUS_PAYMENT,
        });

        await newPairing.save();
      }

      const newRootUser = await rootUserVerification.save();
      await addPairingBonus(child_user, newRootUser);
    }
  }
}

async function modifyBranchCountOfRoot(
  root_user_verification_id,
  direction,
  old_genealogy
) {
  const root_genealogy = await Genealogy.findOne({
    user_id: root_user_verification_id,
  });

  if (root_genealogy) {
    if (direction == "left") {
      root_genealogy.left_count = root_genealogy.left_count + 1;
      if (old_genealogy) {
        root_genealogy.left_branch.left_count = old_genealogy.left_count;
        root_genealogy.left_branch.right_count = old_genealogy.right_count;
      }
    } else if (direction == "right") {
      root_genealogy.right_count = root_genealogy.right_count + 1;
      if (old_genealogy) {
        root_genealogy.right_branch.left_count = old_genealogy.left_count;
        root_genealogy.right_branch.right_count = old_genealogy.right_count;
      }
    }
    await root_genealogy.save();

    const root_user_verification = await UserVerification.findOne({
      user_id: root_user_verification_id,
    });

    if (root_user_verification) {
      await modifyBranchCountOfRoot(
        root_user_verification.root_user_genealogy.user_id,
        root_user_verification.root_user_genealogy.position,
        root_genealogy
      );
    }
  }
}

async function indirectReferralRecursion(
  user_to_verify,
  id_of_the_indirect_referral,
  count
) {
  const indirect_referral_user = await UserVerification.findOne({
    user_id: id_of_the_indirect_referral,
  });

  if (indirect_referral_user && count < INDIRECT_REFERRAL_LIMIT) {
    if (user_to_verify.verified) {
      indirect_referral_user.indirect_referral =
        indirect_referral_user.indirect_referral + INDIRECT_REFERRAL_PAYMENT;

      indirect_referral_user.overall_income =
        indirect_referral_user.overall_income + INDIRECT_REFERRAL_PAYMENT;

      indirect_referral_user.unpaid_income =
        indirect_referral_user.unpaid_income + INDIRECT_REFERRAL_PAYMENT;

      const updateIndirectReferral = await IndirectReferral.findOne({
        user_id: indirect_referral_user.user_id,
        "user_that_invite.user_id": user_to_verify.user_that_invite.user_id,
        "user.user_id": user_to_verify.user_id,
      });

      if (updateIndirectReferral) {
        updateIndirectReferral.income = INDIRECT_REFERRAL_PAYMENT;
        await updateIndirectReferral.save();
      }

      const indirect_user = await indirect_referral_user.save();

      await indirectReferralRecursion(
        user_to_verify,
        indirect_user.user_that_invite.user_id,
        count + 1
      );
    }
  }
}

async function createNewMemberIncome(req) {
  const user = req.user;
  const child_user = req.child_user;
  const total_income = req.total_income;

  const newMemberIncome = await NewMemberIncome({
    account_number: user.account_number,
    user_id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    address: user.address,

    new_member: {
      account_number: child_user.account_number,
      user_id: child_user._id,
      first_name: child_user.first_name,
      last_name: child_user.last_name,
      address: child_user.address,
    },

    value: total_income,
  });

  await newMemberIncome.save();
}

async function updatePairingStatus(user, pairingBonus) {
  const today = moment();
  let days = null;

  if (user.starting_date_of_first_paired) {
    const starting_date_of_first_paired = moment(
      user.starting_date_of_first_paired
    );

    const duration = moment.duration(today.diff(starting_date_of_first_paired));
    days = parseInt(duration.asDays());
  }

  if (
    (user.pairing_bonus_paired_count + 1) %
      (PAIRING_BONUS_MAX_COUNT_PER_DAY + 1) ==
      0 &&
    days == null
  ) {
    user.starting_date_of_first_paired = moment();

    user.product_voucher =
      user.product_voucher + PAIRING_PRODUCT_VOUCHER_PAYMENT;

    pairingBonus.income = PAIRING_BONUS_PAYMENT;

    pairingBonus.income_type = PRODUCT_VOUCHER_TYPE;
    pairingBonus.payed = true;

    await pairingBonus.save();
    await user.save();
  } else if (days > 0 || days == null) {
    user.starting_date_of_first_paired = undefined;

    user.pairing_bonus_paired_count = user.pairing_bonus_paired_count + 1;

    user.pairing_bonus = user.pairing_bonus + PAIRING_BONUS_PAYMENT;
    pairingBonus.income = PAIRING_BONUS_PAYMENT;

    user.overall_income = user.overall_income + PAIRING_BONUS_PAYMENT;
    user.unpaid_income = user.unpaid_income + PAIRING_BONUS_PAYMENT;

    pairingBonus.income_type = PAIRING_BONUS_TYPE;
    pairingBonus.payed = true;

    await pairingBonus.save();
    await user.save();
  }
}
