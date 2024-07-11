const express = require("express");
const router = express.Router();
const AdmUsuariosController = require("../controllers_admin/admUsuariosController.js");

// --------------------------- todos os pedidos -----------------------------------
router.get(
    "/listacompleta/:id_loja",
    AdmUsuariosController.getUsuariosCompleto
);
//-------- salvar categoria ---------
router.post("/", AdmUsuariosController.salvarUsuario);

//-------- ativar/inativar usuario ---------
router.put(
    "/ativar_inativar_usuario/:id_usuario",
    AdmUsuariosController.ativarInativarUsuario
);
module.exports = router;