const express = require("express");
const router = express.Router();
const VendasController = require("../controllers/vendas-controllers.js");
const login = require("../middlewares/login");
const uploadComprovantes = require("../middlewares/upload_comprovantes");

//------ retorna todos os pedidos -------------
router.get('/listar_lojas', VendasController.getLojas) ;

//---------- salvar anexos ---------
router.post(
  "/anexararquivos/:id_venda", uploadComprovantes.single("comprovante"), VendasController.salvarAnexosVendas
);

router.delete("/deletaranexo/:id_anexo", VendasController.deletarComprovante);
router.delete("/deletarvenda/:id_venda", VendasController.deletarVenda);

//------ retorna todos as cores -------------
router.get("/:id_usuario", login.opcional, VendasController.getVendasDoUsuario);

// ------ retorna venda atual
router.get("/ultimavenda/:id_usuario", VendasController.getVendaAtual);

// ------ retorna pontos dos pedidos ------------
router.get("/pontosvendas/:id_usuario", VendasController.getPontosVendas);

// ------ retorna pontos dos pedidos ------------
router.get(
  "/pontosvendasquantidades/:id_venda/:id_produto/:id_tamanho",
  VendasController.getProdutosLancadosNasVendas
);

//---------- inseri um item na venda nova---------
router.post("/salvarItem", VendasController.salvarItem);

//---------- inserir um item na venda que existe ---------
router.put("/salvarItem", VendasController.salvarItem);

//---------- listar anexos ---------
router.get("/anexos/:id_venda", VendasController.getAnexosVendas);

//---------- buscar cliente setadona venda(se existir) --------------------------
router.get("/cliente/:id_venda", VendasController.getClienteDaVendas);

//--------selecionar cliente para a venda atual ---------
router.put(
  "/selecionarClienteParaPedido",
  VendasController.selecionarClienteParaPedido
);
//--------atualizar vendedor e data do pedido pelo profissional ---------
router.put("/up_vendedor_data", VendasController.upVendedorData);

//--------selecionar cliente para a venda atual ---------
router.put("/finalizarpedido/", VendasController.finalizarPedido);
router.post("/finalizar_pedido_parceiro_jmonte/", VendasController.finalizarPedidoParceiroJMonte);

//--------selecionar cliente para a venda atual ---------
router.get(
  "/listarpedidosusuario/:id_usuario", VendasController.listarPedidoUsuario
);

module.exports = router;
