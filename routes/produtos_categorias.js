const express = require("express");
const router = express.Router();
const ProdutosCategoriasController = require("../controllers/produtos_categorias_controller");
const login = require("../middlewares/login");

//------ retorna todas as categorias -------------
router.get("/", ProdutosCategoriasController.getProdutosCategorias);

//-------- retorna os dados de uma categoria ---------
router.get(
    "/:id_categoria",
    ProdutosCategoriasController.getProdutosCategoriasId
);

//---------- inseri um pedidos ---------
router.post(
    "/",
    login.obrigatorio,
    ProdutosCategoriasController.salvarProdutosCategorias
);
//---------- atualiza parte de um pedidos ---------
router.patch(
    "/:id_categoria",
    ProdutosCategoriasController.atualizarProdutosCategorias
);

//---------- deleta um pedidos ---------
router.delete(
    "/:id_categoria",
    ProdutosCategoriasController.deletarProdutosCategorias
);
module.exports = router;