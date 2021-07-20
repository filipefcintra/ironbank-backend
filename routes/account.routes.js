const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypyjs");
const salt = 10;

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

//Rota para criação de novos cartões para o usuário

router.put(
  "/account/create-card",
  isAuthenticated,
  attachCurrentUser,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { pin } = req.body;

      // Criptografando o PIN do cartão
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPin = bcrypt.hashSync(pin, salt);

      //Logica para gerar numero de 16 digitos para o cartao de maneira aleatorio
      const generatedCardNumber = String(
        Math.floor(1000000000000000 + Math.random() * 9999999999999999)
      ).slice(-16);

      //Logica para gerar data de validade do cartão com base na data atual + 5 anos
      const now = new Date();
      now.setFullYear(now.getFullYear() + 5);

      const month = String(now.getMonth() + 1).padStart(2, "0");
      const year = String(now.getYear()).slice(-2);

      const generatedValidThru = `${month}/${year}`;

      // Logica para gerar codigo de segurança aleatorio
      const generatedSecurityCode = String(
        Math.floor(100 + Math.random() * 999)
      ).slice(-3);

      const newCard = await AccountModel.findOne(
        { _id: id },
        {
          $push: {
            cards: {
              pin: hashedPin,
              number: generatedCardNumber,
              validThru: generatedValidThru,
              securityCode: generatedSecurityCode,
            },
          },
        },
        { new: true }
      );

      if (!newCard) {
        return res.status(404).json({ error: "Conta não encontrada." });
      }

      return res.status(200).json(newCard);
    } catch (err) {
      next(err);
    }
  }
);

//Deletar um cartão

router.delete(
  "/account/:id/delete-card/:cardId",
  isAuthenticated,
  attachCurrentUser,
  async (req, res, next) => {
    try {
      const { id, cardId } = req.params;
      const updatedAccount = await AccountModel.findOneAndUpdate(
        { _id: id },
        {
          $pull: { cards: { _id: cardId } },
        }
      );
    } catch (error) {
      next(error);
    }
  }
);

// Deletar uma conta
router.delete(
  "/account/:id",
  isAuthenticated,
  attachCurrentUser,
  async (req, res, next) => {
    try {
      const { id } = req.params;

      const deletionResult = await AccountModel.deleteOne({ _id: id });

      if (!deletionResult) {
        return res.status(404).json({ error: "Conta não encontrada." });
      }
      // Boa pratica para delete, retorna um JSON com objeto vazio
      return res.status(200).json({});
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
