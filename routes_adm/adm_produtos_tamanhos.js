const express = require("express");
const router = express.Router();
const ProdutoController = require("../controllers_admin/admProdutosTamanhosController");

//------ retorna toas as categorias dos produtos -------------
router.get("/listacompleta", ProdutoController.getTamanhosProdutosCompleto);

//-------- retorna os dados de um produtos ---------
// router.get("/:id_categoria", ProdutoController.getTamanhosProdutoId);

// -------- salvar um tamanho de produto ---------
router.post("/", ProdutoController.salvarTamanhoProduto);

// -------- atualizar um tamanho de produto ---------
router.put("/:id_tamanho", ProdutoController.atualizarTamanhoProduto);

// -------- ativar/inativar um tamanho de produto ---------
router.put(
    "/ativar_inativar_tamanho/:id_tamanho",
    ProdutoController.ativarInativarTamanho
);
module.exports = router;