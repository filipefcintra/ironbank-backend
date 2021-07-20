const express = require("express");
const router = express.Router();

const AccountModel = require("../models/Account.model");

const isAuthenticated = require("../middlewares/isAuthenticated");
const attachCurrentUser = require("../middlewares/attachCurrentUser");

router.post(
  "/account",
  isAuthenticated,
  attachCurrentUser,
  async (req, res, next) => {
    try {
      const { type } = req.body;
      const loggedInUser = req.currentUser;

      const lastInsertedAccount = AccountModel.find(
        {},
        { accountNumber: 1, _id: 0 }
      )
        .sort({ accountNumber: -1 })
        .limit(1);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;