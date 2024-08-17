const express = require("express");
const router = express.Router();
const AdmBrindesController = require("../controllers_admin/adm-brindes-controller.js");
const uploadImagens = require("../middlewares/upload_imagens_brindes");
// --------------------------- lista todos os brindes -----------------------------------
router.get("/lista-completa", AdmBrindesController.listaTodosBrindes);

// ----------------------- cadastrar brindes -----------------
router.post("/salvar", AdmBrindesController.salvarBrinde);

// ----------------------- inativar/ativar brindes -----------------
router.put("/inativar-brinde/:id_brinde", AdmBrindesController.inativarBrinde);

// ----------------------- atualizar cadastro de brindes -----------------
router.put("/atualizar/:id_brinde", AdmBrindesController.atualizarBrinde);

//---------- salvar imagem do produto ---------
router.post(
    "/anexararquivos/:id_brinde",
    uploadImagens.single("imagembrinde"),
    AdmBrindesController.salvarImagem
);

// ------ retorna pontos dos pedidos ------------
router.post("/solIcitarBrinde", AdmBrindesController.solicitarBrinde);

// ------ listar todos os pedido de brindes ------------
router.get("/listar-pedidos-brindes", AdmBrindesController.lirtarPedidosBrindes);


router.post("/aprovar-pedido/:id_pedido/:id_autorizador", AdmBrindesController.aprovarPedido);
router.post("/rejeitar-pedido/:id_pedido/:id_parceiro", AdmBrindesController.rejeitaPedido);
router.post("/entregar-pedido/:id_pedido/:id_premio/:id_entregador", AdmBrindesController.entregarPedido);

module.exports = router;
