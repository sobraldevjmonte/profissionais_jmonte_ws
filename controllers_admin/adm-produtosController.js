const pg = require("../conexao");

//------------ RET TODOS PRODs --------------
exports.getProdutosCompleto = async (req, res) => {
  console.log("-- RET TODOS PRODs ----");
  let sql =
    "SELECT p.id_produto, p.descricao, c.descricao_categoria, " +
    "c.id_categoria, p.codigo, p.imagem, p.ativo, TO_CHAR(P.DATA_CADASTRO, 'DD/MM/YYYY') as data_cadastro, count(pt.id_tamanho) qtd_tamanhos, " +
    "pt.pontos, t.id_tamanho, t.descricao as descricao_tamanho, pt.id_produtos_tamanhos " +
    "FROM produtos p " +
    "left join produtos_categorias c on p.id_categoria = c.id_categoria " +
    "left join produtos_tamanhos pt on p.id_produto = pt.id_produto " +
    "left join tamanhos t on pt.id_tamanho = t.id_tamanho " +
    "GROUP BY p.id_produto, c.descricao_categoria, pt.pontos, t.descricao, pt.id_produtos_tamanhos, t.id_tamanho, c.id_categoria, p.ativo, p.data_cadastro " +
    "ORDER BY p.id_produto desc";
    console.log(sql);
  try {
    const result = await pg.execute(sql);

    const response = {
      quantidade: result.rows.length,
      produtos: result.rows,
    };
    
    res.status(200).send(response);
  } catch (error) {
    return res
      .status(500)
      .send({ error: error, mensagem: "Erro ao procurar!" });
  }
};

//--------- ATIVAR/INATIVAR PRODs ---------
exports.ativarInativarProduto = async (req, res) => {
  let id_produto = req.params.id_produto;
  const { ativo } = req.body;
  try {
    await pg.execute("UPDATE produtos set ativo = $1 WHERE id_produto = $2", [
      ativo,
      id_produto,
    ]);

    console.log("------ ATIVAR/INATIVAR PRODs -----");
    const response = {
      mensagem: "Produto inativado/ativado com sucesso!",
      produto: {
        id_produto: id_produto,
        ativo: ativo,
      },
    };
    res.status(201).send(response);
  } catch (error) {
    return res
      .status(500)
      .send({ error: error, mensagem: "Não foi possivel atualizar!" });
  }
};

//------------ ATUALIZ PRODs ------------------
exports.atualizarProduto = async (req, res) => {
  console.log(req.body);
  let id_produto = req.params.id_produto;
  const {
    descricao_produto,
    codigo_produto,
    link_imagem,
    id_categoria,
    id_tamanho,
    id_produtos_tamanhos,
    pontos_produto,
  } = req.body;

  try {
    await pg.execute(
      "UPDATE produtos set descricao = $1, imagem = $2, id_categoria = $3 WHERE id_produto = $4",
      [descricao_produto, link_imagem, id_categoria, id_produto]
    );
    if (id_produtos_tamanhos === null) {
      console.error("********** entrou no nulo linha 77 ********************");
      await pg.execute(
        "INSERT INTO produtos_tamanhos (id_tamanho, pontos, id_produto) VALUES ($1, $2, $3)",
        [id_tamanho, pontos_produto, id_produto]
      );
    } else {
      console.error("**************** linha 83 *********************");
      await pg.execute(
        "UPDATE produtos_tamanhos set id_tamanho = $1, pontos = $2 WHERE id_produtos_tamanhos = $3",
        [id_tamanho, pontos_produto, id_produtos_tamanhos]
      );
    }

    const response = {
      mensagem: " Produto atualizado com sucesso!",
      categoria: {
        id_produto: id_produto,
        descricao: descricao_produto,
        pontos: pontos_produto,
        id_categoria: id_categoria,
      },
    };
    console.log("----- ATUALIZ PRODs --------");
    res.status(201).send(response);
  } catch (error) {
    return res
      .status(500)
      .send({ error: error, mensagem: "Não foi possivel salvar!" });
  }
};

//----------- SALVAR PRODs ----------
exports.salvarProduto = async (req, res) => {
  console.log(req.body);
  let ativo = "S";
  //*******************data de hj ***************/
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0'); // Os meses são indexados de 0 a 11
  const dia = String(hoje.getDate()).padStart(2, '0');
  
  const dataFormatada = `${ano}-${mes}-${dia}`;
  //*******************data de hj ***************/
  console.log('--------------- datacadastro: ' + dataFormatada)
  const {
    descricao_produto,
    codigo_produto,
    link_imagem,
    id_categoria,
    id_tamanho,
    pontos_produto,
  } = req.body;
  try {
    const resultProduto = await pg.execute(
      "INSERT INTO produtos(descricao, codigo, imagem, ativo, id_categoria, data_cadastro) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [descricao_produto, codigo_produto, link_imagem, ativo, id_categoria, dataFormatada]
    );
    let id_novo_produto = resultProduto.rows[0].id_produto;
    try {
      await pg.execute(
        "INSERT INTO produtos_tamanhos(id_produto, id_tamanho, pontos) VALUES ($1, $2, $3)",
        [id_novo_produto, id_tamanho, pontos_produto]
      );
    } catch (error) {
      return res
        .status(500)
        .send({ error: error, mensagem: "Não foi possivel salvar!" });
    }

    const response = {
      mensagem: "Produto cadastrado com sucesso!",
      produto: {
        id_produto: resultProduto.rows[0].id_produto,
        descricao: descricao_produto,
        pontos: pontos_produto,
        id_categoria: id_categoria,
      },
    };
    console.log("------ SALVAR PRODs ------");
    res.status(201).send(response);
  } catch (error) {
    return res
      .status(500)
      .send({ error: error, mensagem: "Não foi possivel salvar!" });
  }
};

//-------------- SALVAR IMAGEM PRODs --------------
exports.salvarImagem = async (req, res) => {
  let id_produto = req.params.id_produto;
  let link_anexo = req.file.filename;
  try {
    await pg.execute("UPDATE produtos set imagem = $1 WHERE id_produto = $2", [
      link_anexo,
      id_produto,
    ]);

    const response = {
      mensagem: "Imagem do produto atualizado!",
    };
    console.log("--------- SALVAR IMAGEM PRODs -------");
    res.status(201).send(response);
  } catch (error) {
    return res
      .status(500)
      .send({ error: error, mensagem: "Não foi possivel atualizar!" });
  }
};
