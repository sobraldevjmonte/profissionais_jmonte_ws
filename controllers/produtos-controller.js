const pg = require("../conexao");

//------ retorna todos os produtos de uma categoria por id(cadastro completo) -------------
exports.getProdutosCategoriasId = async(req, res) => {
    let id_categoria = req.params.id_categoria;
    let quantidade = 0;
    let lprodutos = [];

    try {
        let sql =  "SELECT " +
                    "   p.id_produto, p.valor, p.codigo , p.descricao AS descricao_produto, p.imagem, " +
                    "   pt.id_produtos_tamanhos, pt.id_tamanho, pt.pontos, t.sigla " +
                    "FROM " + 
                    "   produtos p " +
                    "LEFT JOIN produtos_tamanhos pt ON " +
                    "   p.id_produto = pt.id_produto " +
                    "LEFT JOIN tamanhos t ON " +
                    "   pt.id_tamanho = t.id_tamanho " +
                    "JOIN produtos_categorias pf ON " + 
                    "   p.id_categoria = pf.id_categoria " + 
                    "AND " +
                    "   p.id_categoria = $1 " + 
                    "ORDER BY " + 
                    "   p.descricao"

        const resultProdutos = await pg.execute(sql, [id_categoria]
        );
        quantidade = resultProdutos.rows.length;

        if (quantidade > 0) {
            for (let index = 0; index < quantidade; index++) {
                lprodutos[index] = {
                    id_produto: resultProdutos.rows[index].id_produto,
                    codigo: resultProdutos.rows[index].codigo,
                    valor: parseFloat(resultProdutos.rows[index].valor),
                    descricao_produto: resultProdutos.rows[index].descricao_produto,
                    imagem: resultProdutos.rows[index].imagem,
                    id_produtos_tamanhos: resultProdutos.rows[index].id_produtos_tamanhos,
                    id_tamanho: resultProdutos.rows[index].id_tamanho,
                    pontos: resultProdutos.rows[index].pontos,
                    sigla: resultProdutos.rows[index].sigla,
                    sequencia: index,
                    quantidade: 0,
                };
            }
        }

        const response = {
            quantidade: resultProdutos.rows.length,
            produtos: lprodutos,
        };
        console.log("-- PRODs DA CATEGORIA: " + id_categoria);
        res.status(200).send(response);
    } catch (error) {
        return res
            .status(500)
            .send({ error: error, mensagem: "Erro ao procurar!" });
    }
};
//--------- RETORNA TODOS OS PRODUTOS --------------
exports.getProdutosCompleto = async(req, res) => {
    try {
        const result = await pg.execute(
            " SELECT produtos.descricao, produtos.peso, produtos.codigo, cores.sigla as cores, cores.id_cor , tamanhos.descricao as tamanhos, tamanhos.id_tamanho" +
            " FROM produtos, produtos_cores, produtos_tamanhos, cores, tamanhos " +
            " WHERE produtos.id_produto = produtos_cores.id_produto " +
            " AND produtos.id_produto = produtos_tamanhos.id_produto " +
            " AND cores.id_cor = produtos_cores.id_cor " +
            " AND tamanhos.id_tamanho = produtos_tamanhos.id_tamanho "
        );
        const response = {
            quantidade: result.rows.length,
            produtos: result.rows,
        };
        console.log("----- RETORNA PRODs ------");
        res.status(200).send(response);
    } catch (error) {
        return res
            .status(500)
            .send({ error: error, mensagem: "Erro ao procurar!" });
    }
};

//------ retorna todos os produtos(cadastro completo) -------------
exports.getProdutosResumo = async(req, res) => {
    try {
        const result = await pg.execute(
            "SELECT produtos.id_produto, produtos.codigo, produtos.descricao, produtos.imagem, produtos.valor FROM produtos"
        );
        const q = result.rows.length;
        var response;
        if (q > 1) {
            response = {
                quantidade: result.rows.length,
                produtos: result.rows,
            };
        } else {
            response = {
                quantidade: result.rows.length,
                produtos: {
                    id_produto: result.rows[0].id_produto,
                    codigo: result.rows[0].codigo,
                    descricao: result.rows[0].descricao,
                    valor: parseFloat(result.rows[0].valor),
                    imagem: result.rows[0].imagem,
                },
            };
        }
        console.log("----- RETORNA PRODs ------");
        res.status(200).send(response);
    } catch (error) {
        return res
            .status(500)
            .send({ error: error, mensagem: "Erro ao procurar!" });
    }
};

//---------------- RETORNA UM PRODUTO PELO id ------------
exports.getProdutoId = async(req, res) => {
    let id_produto = req.params.id_produto;
    let tamanhos_produtos = [];
    let tamanhos_produtos_linhas = 0;

    try {
        const resultA = await pg.execute(
            "SELECT p.id_produto, p.valor, p.codigo , p.descricao AS descricao_produto, p.imagem " +
            "FROM produtos p " +
            "WHERE p.id_produto = $1", [id_produto]
        );

        let resultB = await pg.execute(
            " SELECT produtos_tamanhos.id_tamanho, produtos_tamanhos.pontos, tamanhos.descricao AS descricao_tamanho, tamanhos.sigla AS sigla_tamanho" +
            " FROM produtos_tamanhos, tamanhos " +
            " WHERE produtos_tamanhos.id_tamanho = tamanhos.id_tamanho " +
            " AND produtos_tamanhos.id_produto = $1", [id_produto]
        );
        tamanhos_produtos = resultB.rows;
        tamanhos_produtos_linhas = resultB.rows.length;

        const response = {
            produtos: {
                id_produto: resultA.rows[0].id_produto,
                codigo: resultA.rows[0].codigo,
                valor: parseFloat(resultA.rows[0].valor),
                descricao_produto: resultA.rows[0].descricao_produto,
                imagem: resultA.rows[0].imagem,
                tamanhos_produtos_linhas: tamanhos_produtos_linhas,
                tamanhos_produtos: tamanhos_produtos,
            },
        };
        console.log("----- RETORNA UM PROD PELO id ------");
        res.status(200).send(response);
    } catch (error) {
        return res
            .status(500)
            .send({ error: error, mensagem: "Erro ao procurar!" });
    }
};

//------ RETORNA PRODUTO PELA DESCRIÇÃO -----
exports.getProdutoDescricao = async(req, res) => {
    let valor = req.params.valor;
    try {
        const result = await pg.execute(
            `SELECT  produtos.id_produto, produtos.codigo, produtos.descricao, produtos.imagem, produtos.valor FROM produtos WHERE produtos.descricao ILIKE $1`, ["%" + valor + "%"]
        );

        const q = result.rows.length;
        var response;
        if (q > 1) {
            response = {
                quantidade: result.rows.length,
                produtos: result.rows,
            };
        } else {
            response = {
                quantidade: result.rows.length,
                produtos: {
                    id_produto: result.rows[0].id_produto,
                    codigo: result.rows[0].codigo,
                    descricao: result.rows[0].descricao,
                    valor: parseFloat(result.rows[0].valor),
                    imagem: result.rows[0].imagem,
                },
            };
        }
        console.log("--------- RETORNA PROD PELA DESCRIÇÃO ---------");
        res.status(200).send(response);
    } catch (error) {
        return res
            .status(500)
            .send({ error: error, mensagem: "Erro ao procurar!" });
    }
};

//---------------- SALVA UM PRODUTO ---------------------
exports.salvarProduto = async(req, res) => {
    console.log("salvarProduto")
    const descricao_produto = req.body.descricao_produto;
    const preco = req.body.preco;
    const id_categoria = req.body.id_categoria;

    try {
        const result = await pg.execute(
            "INSERT INTO produtos(descricao_produto, preco, id_categoria) VALUES ($1, $2, $3) RETURNING *", [descricao_produto, preco, id_categoria]
        );

        const response = {
            mensagem: "Produto cadastrado com sucesso!",
            produto: {
                id_gerado: result.rows[0].id,
                descricao_produto: descricao_produto,
                preco: preco,
                id_categoria: id_categoria,
            },
        };
        console.log("-------- SALVA UM PRODUTO ---------");
        res.status(201).send(response);
    } catch (error) {
        return res
            .status(500)
            .send({ error: error, mensagem: "Não foi possivel salvar!" });
    }
};

//----------- ATUALIZAR PRODUTO ----------------
exports.atualizarProduto = async(req, res) => {
    const id_produto = req.body.id_produto;
    const descricao_produto = req.body.descricao_produto;
    const preco = req.body.preco;
    const id_categoria = req.body.id_categoria;

    try {
        await pg.execute(
            "UPDATE produtos SET descricao_produto=$1, preco = $2, id_categoria=$3 WHERE id_produto=$4", [descricao_produto, preco, id_categoria, id_produto]
        );
        const response = {
            mensagem: "Produto atualizado com sucesso!",
            id_produto: id_produto,
            descricao_produto: descricao_produto,
            preco: preco,
            id_categoria: id_categoria,
        };
        console.log("-------- ATUALIZA PRODUTO ---------");
        res.status(200).send(response);
    } catch (error) {
        return res
            .status(500)
            .send({ error: error, mensagem: "Erro ao atualizar!" });
    }
};

//------------- DELETAR UM PRODUTO PELO id --------------------
exports.deletarProduto = async(req, res) => {
    const id_produto = req.body.id_produto;
    try {
        await pg.execute("DELETE FROM produtos WHERE id_produto=$1", [id_produto]);
        const response = {
            mensagem: `Produto ${id_produto} excluido com sucesso!`,
        };
        console.log("------- DEL PRODUTO PELO id -----------");
        res.status(202).send(response);
    } catch (error) {
        return res
            .status(500)
            .send({ error: error, mensagem: "Não foi possivel deletar!" });
    }
};