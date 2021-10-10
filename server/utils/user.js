import Cashout from "../models/cashout.model.js";
import DirectReferral from "../models/direct-referral.model.js";
import Genealogy from "../models/genealogy.model.js";
import IndirectReferral from "../models/indirect-referral.model.js";
import PairingBonus from "../models/pairing-bonus.model.js";
import User from "../models/user.model.js";
import UserVerification from "../models/user.verification.model.js";

export async function updateUserAuthentication(update_info, existing_user) {
  existing_user.username = update_info.username;
  existing_user.first_name = update_info.first_name;
  existing_user.last_name = update_info.last_name;
  existing_user.birthdate = update_info.birthdate;
  existing_user.address = update_info.address;
  existing_user.contact_number = update_info.contact_number;

  const updated_user = await existing_user.save();

  await User.updateMany(
    {
      "root_user_genealogy.user_id": updated_user._id,
    },
    {
      "root_user_genealogy.first_name": updated_user.first_name,
      "root_user_genealogy.last_name": updated_user.last_name,
      "root_user_genealogy.address": updated_user.address,
    }
  );
  await User.updateMany(
    {
      "user_that_invite.user_id": updated_user._id,
    },
    {
      "user_that_invite.first_name": updated_user.first_name,
      "user_that_invite.last_name": updated_user.last_name,
      "user_that_invite.address": updated_user.address,
    }
  );

  await updateVerification(updated_user);
  await updateGenealogy(updated_user);
  await updateCashout(updated_user);
  await updateDirectReferral(updated_user);
  await updateIndirectReferral(updated_user);
  await updatePairingBonus(updated_user);

  return updated_user;
}

async function updateVerification(updated_user) {
  await UserVerification.updateOne(
    {
      user_id: updated_user._id,
    },
    {
      first_name: updated_user.first_name,
      last_name: updated_user.last_name,
      address: updated_user.address,
      birthdate: updated_user.birthdate,
    }
  );

  await UserVerification.updateMany(
    {
      "user_that_invite.user_id": updated_user._id,
    },
    {
      "user_that_invite.first_name": updated_user.first_name,
      "user_that_invite.last_name": updated_user.last_name,
      "user_that_invite.address": updated_user.address,
    }
  );

  await UserVerification.updateMany(
    {
      "root_user_genealogy.user_id": updated_user._id,
    },
    {
      "root_user_genealogy.first_name": updated_user.first_name,
      "root_user_genealogy.last_name": updated_user.last_name,
      "root_user_genealogy.address": updated_user.address,
    }
  );

  await UserVerification.updateMany(
    {
      "indirect_referral_user.user_id": updated_user._id,
    },
    {
      "indirect_referral_user.first_name": updated_user.first_name,
      "indirect_referral_user.last_name": updated_user.last_name,
      "indirect_referral_user.address": updated_user.address,
    }
  );
}

async function updateGenealogy(updated_user) {
  await Genealogy.updateOne(
    {
      user_id: updated_user._id,
    },
    {
      first_name: updated_user.first_name,
      last_name: updated_user.last_name,
      address: updated_user.address,
    }
  );

  await Genealogy.updateMany(
    {
      "user_that_invite.user_id": updated_user._id,
    },
    {
      "user_that_invite.first_name": updated_user.first_name,
      "user_that_invite.last_name": updated_user.last_name,
      "user_that_invite.address": updated_user.address,
    }
  );

  await Genealogy.updateMany(
    {
      "left_branch.user_id": updated_user._id,
    },
    {
      "left_branch.first_name": updated_user.first_name,
      "left_branch.last_name": updated_user.last_name,
      "left_branch.address": updated_user.address,
    }
  );

  await Genealogy.updateMany(
    {
      "left_branch.user_that_invite.user_id": updated_user._id,
    },
    {
      "left_branch.user_that_invite.first_name": updated_user.first_name,
      "left_branch.user_that_invite.last_name": updated_user.last_name,
      "left_branch.user_that_invite.address": updated_user.address,
    }
  );

  await Genealogy.updateMany(
    {
      "right_branch.user_id": updated_user._id,
    },
    {
      "right_branch.first_name": updated_user.first_name,
      "right_branch.last_name": updated_user.last_name,
      "right_branch.address": updated_user.address,
    }
  );

  await Genealogy.updateMany(
    {
      "right_branch.user_that_invite.user_id": updated_user._id,
    },
    {
      "right_branch.user_that_invite.first_name": updated_user.first_name,
      "right_branch.user_that_invite.last_name": updated_user.last_name,
      "right_branch.user_that_invite.address": updated_user.address,
    }
  );
}

async function updateCashout(updated_user) {
  await Cashout.updateMany(
    { user_id: updated_user._id },
    {
      first_name: updated_user.first_name,
      last_name: updated_user.last_name,
      address: updated_user.address,
      contact_number: updated_user.contact_number,
    }
  );
}

async function updateDirectReferral(updated_user) {
  await DirectReferral.updateOne(
    { user_id: updated_user._id },
    {
      first_name: updated_user.first_name,
      last_name: updated_user.last_name,
      address: updated_user.address,
    }
  );

  await DirectReferral.updateMany(
    { "root_user.user_id": updated_user._id },
    {
      "root_user.first_name": updated_user.first_name,
      "root_user.last_name": updated_user.last_name,
      "root_user.address": updated_user.address,
    }
  );

  await DirectReferral.updateMany(
    { "user.user_id": updated_user._id },
    {
      "user.first_name": updated_user.first_name,
      "user.last_name": updated_user.last_name,
      "user.address": updated_user.address,
    }
  );
}

async function updateIndirectReferral(updated_user) {
  await IndirectReferral.updateOne(
    { user_id: updated_user._id },
    {
      first_name: updated_user.first_name,
      last_name: updated_user.last_name,
      address: updated_user.address,
    }
  );
  await IndirectReferral.updateMany(
    { "user_that_invite.user_id": updated_user._id },
    {
      "user_that_invite.first_name": updated_user.first_name,
      "user_that_invite.last_name": updated_user.last_name,
      "user_that_invite.address": updated_user.address,
    }
  );

  await IndirectReferral.updateMany(
    { "user.user_id": updated_user._id },
    {
      "user.first_name": updated_user.first_name,
      "user.last_name": updated_user.last_name,
      "user.address": updated_user.address,
    }
  );
}

async function updatePairingBonus(updated_user) {
  await PairingBonus.updateOne(
    { user_id: updated_user._id },
    {
      first_name: updated_user.first_name,
      last_name: updated_user.last_name,
      address: updated_user.address,
    }
  );
  await PairingBonus.updateMany(
    { "left.user_id": updated_user._id },
    {
      "left.first_name": updated_user.first_name,
      "left.last_name": updated_user.last_name,
      "left.address": updated_user.address,
    }
  );

  await IndirectReferral.updateMany(
    { "right.user_id": updated_user._id },
    {
      "right.first_name": updated_user.first_name,
      "right.last_name": updated_user.last_name,
      "right.address": updated_user.address,
    }
  );
}
