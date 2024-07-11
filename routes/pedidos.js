const express = require('express');
const router = express.Router();
const PedidosController = require('../controllers/pedidos-controllers');
const login = require('../middlewares/login');

//------ retorna todos os pedidos -------------
router.get('/', PedidosController.getPedidos) ;

//---------- inseri um pedidos ---------
router.post('/', login.obrigatorio, PedidosController.salvarPedido);

//-------- retorna os dados de um pedidos ---------
router.get('/:id_pedido', PedidosController.getUmPedido);

//---------- atualiza parte de um pedidos ---------
router.patch('/:id_pedido', PedidosController.atualizaPedido);

//---------- deleta um pedidos ---------
router.delete('/:id_pedido', PedidosController.deletarPedido);
module.exports = router;