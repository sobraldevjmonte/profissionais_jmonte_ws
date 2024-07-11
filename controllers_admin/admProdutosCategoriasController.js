const pg = require("../conexao");

//--------------------- LISTA CATEGORIAS --------------------
exports.getCategoriasProdutosCompleto = async(req, res) => {
    try {
        const result = await pg.execute(
            "SELECT * FROM produtos_categorias ORDER BY id_categoria DESC"
        );

        const response = {
            quantidade: result.rows.length,
            categorias: result.rows,
        };
        console.log("-------- LISTA CATEGORIAS -------");
        res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({ error: error, mensagem: "Erro ao procurar" });
    }
};

//--------- ATIVAR/INAT CATEGORIA ------------
exports.ativarInativarCategoria = async(req, res) => {
    let id_categoria = req.params.id_categoria;
    const { ativo } = req.body;

    try {
        await pg.execute(
            "UPDATE produtos_categorias set ativo = $1 WHERE id_categoria = $2", [ativo, id_categoria]
        );

        const response = {
            mensagem: "Tamanho de Produto atualizado com sucesso!",
            categoria: {
                id_categoria: id_categoria,
                ativo: ativo,
            },
        };
        console.log("----- ATIVAR/INAT CATEGORIA ---");
        res.status(201).send(response);
    } catch (error) {
        return res
            .status(500)
            .send({ error: error, mensagem: "Não foi possivel salvar!" });
    }
};

//------------ ATUAL CATEGORIA ------------
exports.atualizarCategoria = async(req, res) => {
    let id_categoria = req.params.id_categoria;
    const { descricao_categoria } = req.body;

    try {
        await pg.execute(
            "UPDATE produtos_categorias set descricao_categoria = $1 WHERE id_categoria = $2", [descricao_categoria, id_categoria]
        );

        const response = {
            mensagem: "Tamanho de Produto atualizado com sucesso!",
            categoria: {
                descricao_categoria: descricao_categoria,
                id_categoria: id_categoria,
            },
        };
        console.log("------- ATUAL CATEGORIA ---------");
        res.status(201).send(response);
    } catch (error) {
        return res
            .status(500)
            .send({ error: error, mensagem: "Não foi possivel salvar!" });
    }
};

//----------- SALVAR CATEGORIA -------------
exports.salvarCategoria = async(req, res) => {
    let ativo = "S";
    const { descricao_categoria } = req.body;
    try {
        const resultCategoria = await pg.execute(
            "INSERT INTO produtos_categorias(descricao_categoria, ativo) VALUES ($1, $2) RETURNING *", [descricao_categoria, ativo]
        );

        const response = {
            mensagem: "Categoria cadastrada com sucesso!",
            categoria: {
                id_categoria: resultCategoria.rows[0].id_categoria,
                descricao_categoria: descricao_categoria,
            },
        };
        res.status(201).send(response);
    } catch (error) {
        return res
            .status(500)
            .send({ error: error, mensagem: "Não foi possivel salvar!" });
    }
};

//------------ SALVAR IMG CATEGORIA --------------
exports.salvarImagemCategoria = async(req, res) => {
    let id_categoria = req.params.id_categoria;
    let link_anexo = req.file.filename;
    try {
        await pg.execute(
            "UPDATE produtos_categorias set imagem = $1 WHERE id_categoria = $2", [link_anexo, id_categoria]
        );

        const response = {
            mensagem: "Imagem da categoria atualizada!",
        };
        console.log("-------- SALVAR IMG CATEGORIA ------");
        res.status(201).send(response);
    } catch (error) {
        return res
            .status(500)
            .send({ error: error, mensagem: "Não foi possivel atualizar!" });
    }
};