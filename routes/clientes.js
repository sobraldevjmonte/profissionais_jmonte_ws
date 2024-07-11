const express = require('express');
//const { route } = require('../app');
const router = express.Router();
const ClientesController = require('../controllers/clientes_controllers');
//const login = require('../middlewares/login');

//-------- retorna os clientes do usuario ---------
router.get('/:id_usuario', ClientesController.getTodosClientes);

//--------salvar cliente ---------
router.post('/', ClientesController.salvarCliente);



module.exports = router;