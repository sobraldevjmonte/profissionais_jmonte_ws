const pg = require("../conexao");

//------ retorna todos os pedidos -------------
exports.getPedidos = async(req, res) => {
    try {
        const result = await pg.execute("SELECT * FROM pedidos");
        const response = {
            quantidade: result.rows.length,
            pedidos: result.rows,
        };
        await pg.end();
        console.log("------- LISTA TODOS OS PEDIDOS ---------");
        res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({ error: error, mensagem: "Erro ao procurar" });
    }
};

//---------- inseri um pedidos ---------
exports.salvarPedido = async(req, res) => {
    const { preco, quantidade, id_produto } = req.body;
    var total = quantidade * preco;
    try {
        const result = await pg.execute(
            "INSERT INTO pedidos (id_usuario, preco, quantidade , id_produto ,total_item) VALUES ($1, $2 ,$3, $4 , $5) RETURNING *", [req.usuarioToken.id_usuario, preco, quantidade, id_produto, total]
        );
        await pg.end();
        const response = {
            mensagem: "Pedido criado com sucesso",
            pedidoCriado: {
                id_pedido_gerado: result.rows[0].id,
                id_produto: id_produto,
                id_usuario: req.usuarioToken.id_usuario,
                quantidade: quantidade,
                preco: preco,
                total_item: total,
            },
        };
        console.log("---------- PEDIDO SALVO -----------");
        res.status(201).send(response);
    } catch (error) {
        return res.status(500).send({ error: error, mensagem: "Erro ao salvar!" });
    }
};

//-------- retorna os dados de um pedidos ---------
exports.getUmPedido = async(req, res) => {
    const id = req.params.id_pedido;
    try {
        const result = await pg.execute(
            "SELECT * FROM pedidos WHERE id_pedido=$1", [id]
        );
        await pg.end();
        const response = {
            quantidade: result.rows.length,
            pedido: result.rows,
        };
        console.log("----- LISTA PEDIDO(id): " + id);
        res.status(200).send(response);
    } catch (error) {
        return res
            .status(500)
            .send({ error: error, mensagem: "Erro ao procurar!" });
    }
};

//---------- atualiza parte de um pedidos ---------
exports.atualizaPedido = async(req, res) => {
    const { preco, quantidade } = req.body;
    const id_pedido = req.params.id_pedido;
    var total = quantidade * preco;
    try {
        await pg.execute(
            "UPDATE pedidos SET quantidade=$1, preco=$2, total_item=$3 WHERE id_pedido=$4", [quantidade, preco, total, id_pedido]
        );
        const response = {
            mensagem: "Pedido atualizado com sucesso!",
            pedido: id_pedido,
        };
        console.log("------ ATUALIZA PEDIDO: " + id_pedido);
        res.status(200).send(response);
    } catch (error) {
        return res
            .status(500)
            .send({ error: error, mensagem: "Erro ao atualizar pedido!" });
    }
};

//---------- deleta um pedidos ---------
exports.deletarPedido = async(req, res) => {
    const id = req.params.id_pedido;
    try {
        await pg.execute("DELETE FROM pedidos WHERE id_pedido=$1", [id]);
        const response = {
            mensagem: "Pedido excluido com sucesso!",
            id_pedido: id,
        };
        console.log("------- DELETA PEDIDO: " + id);
        res.status(202).send(response);
    } catch (error) {
        return res
            .status(500)
            .send({ error: error, mensagem: "Erro ao deletar pedido!" });
    }
};