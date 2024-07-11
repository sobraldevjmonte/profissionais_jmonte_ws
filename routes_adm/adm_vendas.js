const express = require("express");
const router = express.Router();
const AdmVendasController = require("../controllers_admin/adm-vendasController.js");

// --------------------------- todos os pedidos -----------------------------------
router.get("/:id_loja", AdmVendasController.listaTodosPedidos);

// ----------------------- listar pedidos pelo status selecionado -----------------
router.get(
  "/status/:id_loja/:status",
  AdmVendasController.listaPedidosPorStatus
);

//---------- listar anexos ---------
router.get("/anexos/:id_venda", AdmVendasController.getAnexosVendas);

//------------- atualiza status pedido APROVADO/REJEITADO ------------------------
router.put("/atualizarStatusPedido", AdmVendasController.atualizarStatusPedido);
router.put("/premiarPedido", AdmVendasController.premiarPedido);
router.put(
  "/atualizarMotivoRejeicaoPedido",
  AdmVendasController.atualizarMotivoRejeicaoPedido
);

module.exports = router;
