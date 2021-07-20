const express = require("express");
const router = express.Router();

const AccountModel = require("../models/Account.model");

const isAuthenticated = require("../middlewares/isAuthenticated");
const attachCurrentUser = require("../middlewares/attachCurrentUser");

// Criando nova conta
router.post(
  "/account",
  isAuthenticated,
  attachCurrentUser,
  async (req, res, next) => {
    try {
      const { type } = req.body;
      const loggedInUser = req.currentUser;

      const lastInsertedAccount = await AccountModel.findOne(
        {},
        { accountNumber: 1, _id: 0 },
        { sort: { accountNumber: -1 }, limit: 1 }
      );
      // Criando numeros de conta de maneira automática e sequencial.
      const accountNumber = lastInsertedAccount
        ? lastInsertedAccount.accountNumber + 1
        : 1;
      // Inserindo contas no banco de dados
      const newAccount = await AccountModel.create({
        userId: loggedInUser._id,
        accountNumber: accountNumber,
        type: type,
      });

      return res.status(201).json(newAccount);
    } catch (err) {
      next(err);
    }
  }
);

// Vizualização de conta unica

router.get(
  "/account/:id",
  isAuthenticated,
  attachCurrentUser,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const account = await AccountModel.findOne({ _id: id });

      return res.status(200).json(account);
    } catch (err) {
      next(err);
    }
  }
);

// Todas as contas do usuários

router.get(
  "/account",
  isAuthenticated,
  attachCurrentUser,
  async (req, res, next) => {
    try {
      const loggedInUser = req.currentUser;
      const accounts = await AccountModel.find({ userId: loggedInUser._id });
      //Exemplo de regra de negócio
      if (!accounts) {
        return res.status(404).json({ error: "Você ainda não tem uma conta." });
      }

      return res.status(200).json(accounts);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
