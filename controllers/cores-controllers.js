const pg = require("../conexao");

//------ retorna todos as cores -------------
exports.getCores = async(req, res) => {
    try {
        const result = await pg.execute("SELECT * FROM cores");
        const response = {
            quantidade: result.rows.length,
            cores: result.rows,
        };
        console.log("---------- LISTA TODAS AS CORES ----------------");
        res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({ error: error, mensagem: "Erro ao procurar" });
    }
};