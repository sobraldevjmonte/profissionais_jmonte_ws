const pg = require("../conexao");

//--------------------- LISTA TAMANHOS --------------------
exports.getTamanhosProdutosCompleto = async(req, res) => {
    try {
        const result = await pg.execute(
            "SELECT * FROM tamanhos ORDER BY id_tamanho DESC"
        );

        const response = {
            quantidade: result.rows.length,
            tamanhos: result.rows,
        };
        console.log("------ LISTA TAMANHOS ----");
        res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({ error: error, mensagem: "Erro ao procurar" });
    }
};

//-------------------- ATIVAR/INAT TAMANHOS -----------------
exports.ativarInativarTamanho = async(req, res) => {
    let id_tamanho = req.params.id_tamanho;
    const { ativo } = req.body;

    try {
        await pg.execute("UPDATE tamanhos set ativo = $1 WHERE id_tamanho = $2", [
            ativo,
            id_tamanho,
        ]);

        const response = {
            mensagem: "Tamanho de Produto atualizado com sucesso!",
            tamanho: {
                id_tamanho: id_tamanho,
                ativo: ativo,
            },
        };
        console.log("--------- ATIVAR/INAT TAMANHOS ---------");
        res.status(201).send(response);
    } catch (error) {
        return res
            .status(500)
            .send({ error: error, mensagem: "Não foi possivel salvar!" });
    }
};

//------------- ATUAL TAMANHOS ----------------
exports.atualizarTamanhoProduto = async(req, res) => {
    let id_tamanho = req.params.id_tamanho;
    const { descricao_tamanho, sigla_tamanho } = req.body;
    try {
        const resultTamanho = await pg.execute(
            "UPDATE tamanhos set descricao = $1, sigla = $2 WHERE id_tamanho = $3", [descricao_tamanho, sigla_tamanho, id_tamanho]
        );

        const response = {
            mensagem: "Tamanho de Produto atualizado com sucesso!",
            tamanho: {
                id_tamanho: id_tamanho,
                descricao_tamanho: descricao_tamanho,
                sigla_tamanho: sigla_tamanho,
            },
        };
        console.log("------ ATUAL TAMANHOS -------");
        res.status(201).send(response);
    } catch (error) {
        return res
            .status(500)
            .send({ error: error, mensagem: "Não foi possivel salvar!" });
    }
};

//--------------- SALVAR TAMANHO -----------------
exports.salvarTamanhoProduto = async(req, res) => {
    let ativo = "S";
    const { descricao_tamanho, sigla_tamanho } = req.body;
    try {
        const resultTamanho = await pg.execute(
            "INSERT INTO tamanhos(descricao, sigla, ativo) VALUES ($1, $2, $3) RETURNING *", [descricao_tamanho, sigla_tamanho, ativo]
        );

        const response = {
            mensagem: "Tamanho de Produto cadastrado com sucesso!",
            produto: {
                id_tamanho: resultTamanho.rows[0].id_tamanho,
                descricao_tamanho: descricao_tamanho,
                sigla_tamanho: sigla_tamanho,
                ativo: ativo,
            },
        };
        console.log("--------- SALVAR TAMANHO -------");
        res.status(201).send(response);
    } catch (error) {
        return res
            .status(500)
            .send({ error: error, mensagem: "Não foi possivel salvar!" });
    }
};