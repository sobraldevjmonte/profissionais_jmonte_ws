const express = require("express");
const router = express.Router();
const ProdutoCategoriasController = require("../controllers_admin/admProdutosCategoriasController");
const uploadImagensCategorias = require("../middlewares/upload_imagens_categorias");

//------ retorna toas as categorias dos produtos -------------
router.get(
    "/listacompleta",
    ProdutoCategoriasController.getCategoriasProdutosCompleto
);

//-------- retorna os dados de um produtos ---------
//router.get(
//   "/:id_categoria",
//   ProdutoCategoriasController.getCategoriasProdutoId
//);

//-------- salvar categoria ---------
router.post("/", ProdutoCategoriasController.salvarCategoria);

//-------- salvar categoria ---------
router.put("/:id_categoria", ProdutoCategoriasController.atualizarCategoria);

//-------- salvar categoria ---------
router.put(
    "/ativar_inativar_categoria/:id_categoria",
    ProdutoCategoriasController.ativarInativarCategoria
);

//---------- salvar imagem da categoria ---------
router.post(
    "/anexararquivos/:id_categoria",
    uploadImagensCategorias.single("imagemprodutocategoria"),
    ProdutoCategoriasController.salvarImagemCategoria
);
module.exports = router;