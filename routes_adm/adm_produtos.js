const express = require("express");
const router = express.Router();
const ProdutoController = require("../controllers_admin/adm-produtosController");
const login = require("../middlewares/login");
const uploadImagens = require("../middlewares/upload_imagens");

//------ retorna todos os produtos(completo) -------------
router.get("/listacompleta", ProdutoController.getProdutosCompleto);

//-------- salvar um produto ---------
router.post("/", ProdutoController.salvarProduto);

//-------- salvar um produto ---------
router.put("/:id_produto", ProdutoController.atualizarProduto);

//-------- salvar um produto ---------
router.put(
    "/ativar_inativar_produto/:id_produto",
    ProdutoController.ativarInativarProduto
);

//---------- salvar imagem do produto ---------
router.post(
    "/anexararquivos/:id_produto",
    uploadImagens.single("imagemproduto"),
    ProdutoController.salvarImagem
);
module.exports = router;