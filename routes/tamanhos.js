const express = require("express");
const router = express.Router();
const TamanhosController = require("../controllers/tamanhos-controllers");

//------ retorna todos as cores -------------
router.get("/", TamanhosController.getTamanhos);

module.exports = router;