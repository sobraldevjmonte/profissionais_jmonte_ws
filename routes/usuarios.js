const express = require("express");
const router = express.Router();
const UsuarioController = require("../controllers/usuarios-controllers");
const login = require("../middlewares/login");

//-------------- login -----------------------
router.post("/login", UsuarioController.login);

//------ retorna todos os usuarios -------------
router.get("/", login.opcional, UsuarioController.getUsuarios);

//---------------- salvar um usuarios ---------------------
router.post("/salvarusuario", UsuarioController.salvarUsuario);

// ------------- reset de senha -----------------
router.put("/resetsenha", UsuarioController.resetSenha);

//-------- retorna os dados de um usuarios ---------
router.get("/:id", UsuarioController.getUsuarioId);

//---------- atualiza parte de um usuario ---------
router.patch("/:id", UsuarioController.atualizarUsuario);

//---------- deleta um usuario ---------
router.delete("/:id", UsuarioController.deletarUsuario);

//-------- retorna os dados de um usuarios ---------
router.get("/nome/:nome", UsuarioController.getUsuarioNome);
//router.get('/teste', UsuarioController.teste);

module.exports = router;