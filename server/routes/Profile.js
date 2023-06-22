const express = require("express");
const router = express.Router();

const { auth } = require("../middlewares/auth");

const {
  updateProfile,
  deleteAccount,
  getAllUserDetails,
} = require("../controllers/Profile");

router.put("./updateProfile", auth, updateProfile);
router.delete("./deleteAccount", deleteAccount);
router.get("./getAllUserDetails", getAllUserDetails);

// 2 contollers pending

module.exports = router;
