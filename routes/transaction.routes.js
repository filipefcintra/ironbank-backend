const express = require("express");
const router = express.Router();

const AccountModel = require("../models/Account.model");
const TransactionModel = require("../models/Transaction.model");

const isAuthenticated = require("../middlewares/isAuthenticated");
const attachCurrentUser = require("../middlewares/attachCurrentUser");

router.post(
  "/transaction",
  isAuthenticated,
  attachCurrent,
  async (req, res, next) => {
    try {
      const { accountId, amount } = req.body;

      //Criando transação
      const newTransaction = await TransactionModel.create({ ...req.body });

      //Atualizando o saldo
      const updateAccount = await AccountModel.findOneAndUpdate(
        { _id: accountId },
        {
          $inc: {
            balance: amount,
          },
        }
      );

      if (!updatedAccount) {
        return res.status(404).json({ error: "Conta não encontrada" });
      }

      return res.status(200).json(newTransaction);
    } catch (error) {
      next(error);
    }
  }
);

// Vizualização das transações da conta (extrato)

router.get(
  "/transaction/:accountId",
  isAuthenticated,
  attachCurrentUser,
  async (req, res, next) => {
    try {
      const { accountId } = req.params;

      const transactions = await TransactionModel.find({
        accountId: accountId,
      });

      return res.status(200).json(transactions);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
