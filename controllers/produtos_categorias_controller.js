const pg = require("../conexao");

//--------------------- lista categorias --------------------
exports.getProdutosCategorias = async(req, res) => {
    let ativo = "S";
    try {
        const result = await pg.execute(
            "SELECT * FROM produtos_categorias WHERE ativo = $1 ORDER BY id_categoria", [ativo]
        );

        let q = result.rows.length;
        let dados = [];
        if (q > 0) {
            for (let i = 0; i < q; i++) {
                dados[i] = {
                    id_categoria: result.rows[i].id_categoria,
                    descricao_categoria: result.rows[i].descricao_categoria,
                    imagem: result.rows[i].imagem,
                    seq: i + 1,
                };
            }
        }

        const response = {
            quantidade: q,
            categorias: dados,
        };
        console.log("-------- LISTA CATEGORIAS --------");
        res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({ error: error, mensagem: "Erro ao procurar" });
    }
};
//--------------------- lista uma categoria por id--------------------
exports.getProdutosCategoriasId = async(req, res) => {
    const id_categoria = req.params.id_categoria;
    try {
        const result = await pg.execute(
            "SELECT * FROM produtos_categorias WHERE id_categoria=$1", [id_categoria]
        );
        const response = {
            quantidade: result.rows.length,
            categorias: result.rows,
        };
        console.log("--- RETORNA CATEGORIA: " + id_categoria);
        res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({ error: error, mensagem: "Erro ao procurar" });
    }
};

//--------------------- salva categoria --------------------
exports.salvarProdutosCategorias = async(req, res) => {
    const { descricao_categoria } = req.body;
    try {
        const result = await pg.execute(
            "INSERT INTO produtos_categorias (descricao_categoria) VALUES ($1) RETURNING *", [descricao_categoria]
        );
        const response = {
            mensagem: "Categoria salva com sucesso!",
            categoria: {
                id_gerado: result.rows[0].id_categoria,
                descricao_categoria: descricao_categoria,
            },
        };
        console.log("--- SALVA CATEGORIA ----");
        res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({ error: error, mensagem: "Erro ao salvar" });
    }
};

//--------------------- atualizar categoria --------------------
exports.atualizarProdutosCategorias = async(req, res) => {
    const id_categoria = req.params.id_categoria;
    const { descricao_categoria } = req.body;
    try {
        const result = await pg.execute(
            "UPDATE produtos_categorias SET descricao_categoria=$1 WHERE id_categoria=$2", [descricao_categoria, id_categoria]
        );
        const response = {
            mensagem: "Categoria atualizada com sucesso!",
            id_categoria: id_categoria,
            descricao_categoria: descricao_categoria,
        };
        console.log("------ ATUALIZA CATEGORIA ------");
        res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({ error: error, mensagem: "Erro ao atuaizar" });
    }
};

//--------------------- deleta categoria por id --------------------
exports.deletarProdutosCategorias = async(req, res) => {
    const id_categoria = req.params.id_categoria;
    try {
        const result = await pg.execute(
            "DELETE FROM produtos_categorias WHERE id_categoria=$1", [id_categoria]
        );
        const response = {
            mensagem: `Categoria ${id_categoria} deletada com sucesso!`,
        };
        console.log("---- DELETA CATEGORIA -----");
        res.status(202).send(response);
    } catch (error) {
        return res.status(500).send({ error: error, mensagem: "Erro ao deletar" });
    }
};