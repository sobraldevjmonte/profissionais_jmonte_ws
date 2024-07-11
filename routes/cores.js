const express = require("express");
const router = express.Router();
const CoresController = require("../controllers/cores-controllers.js");
const login = require("../middlewares/login");

//------ retorna todos as cores -------------
router.get("/", login.opcional, CoresController.getCores);

module.exports = router;