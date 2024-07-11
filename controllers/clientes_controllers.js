const { Console } = require("console");
const pg = require("../conexao");

exports.salvarCliente = async(req, res) => {
    const { id_usuario, nome_cliente, id_loja } = req.body;
    console.log(req.body);
    let sql = 'INSERT INTO clientes (id_usuario, nome_cliente, id_loja) VALUES ($1, $2 ,$3) RETURNING *';
    console.log(sql);
    try {
        const result = await pg.execute(sql, [id_usuario, nome_cliente, id_loja]
        );
        const response = {
            mensagem: "Cliente salvo com sucesso",
            pedidoCriado: {
                id_cliente: result.rows[0].id_cliente,
                nome_cliente: nome_cliente,
            },
        };
        console.log("-------- SALVA CLIENTE -----------");
        res.status(201).send(response);
    } catch (error) {
        return res.status(500).send({ error: error, mensagem: "Erro ao salvar!" });
    }
};
exports.getTodosClientes = async(req, res) => {
    const id_usuario = req.params.id_usuario;
    try {
        const result = await pg.execute(
            "SELECT * FROM clientes WHERE id_usuario=$1 ORDER BY id_cliente DESC", [id_usuario]
        );
        const response = {
            quantidade: result.rows.length,
            clientes: result.rows,
        };
        console.log("------- LISTA TODOS OS CLIENTES ---------");
        res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({ error: error, mensagem: "Erro ao procurar" });
    }
};