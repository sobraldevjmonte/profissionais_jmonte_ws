const pg = require("../conexao");

//------ retorna todos as cores -------------
exports.getTamanhos = async(req, res) => {
    try {
        const result = await pg.execute("SELECT * FROM tamanhos");
        const response = {
            quantidade: result.rows.length,
            pedidos: result.rows,
        };
        console.log("------- RETORNA CORES----------");
        res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({ error: error, mensagem: "Erro ao procurar" });
    }
};