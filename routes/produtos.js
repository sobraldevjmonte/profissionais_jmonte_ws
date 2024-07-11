const express = require("express");
const router = express.Router();
const ProdutoController = require("../controllers/produtos-controller");
const login = require("../middlewares/login");

//------ retorna todos os produtos(completo) -------------
router.get("/completo", ProdutoController.getProdutosCompleto);

//------ retorna todos os produtos(resumo) -------------
router.get("/resumo", ProdutoController.getProdutosResumo);

//-------- retorna os dados de um produtos ---------
router.get("/:id_produto", ProdutoController.getProdutoId);

//-------- retorna os dados de um pedidos ---------
router.get(
    "/categoria/:id_categoria",
    ProdutoController.getProdutosCategoriasId
);

//-------- retorna os produtos pela descricao ---------
router.get("/", ProdutoController.getProdutoDescricao);

router.post("/", login.obrigatorio, ProdutoController.salvarProduto);

//---------- atualiza parte de um usuario ---------
router.patch("/:id_produto", ProdutoController.atualizarProduto);

//---------- deleta um usuario ---------
router.delete("/:id_produto", ProdutoController.deletarProduto);

module.exports = router;