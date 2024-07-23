const pg = require("../conexao");

//------ retorna todos as cores -------------
exports.getLojas = async(req, res) => {
  try {
      const result = await pg.execute("SELECT * FROM lojas");
      const response = {
          quantidade: result.rows.length,
          lojas: result.rows,
      };
      console.log("------- RETORNA CORES----------");
      res.status(200).send(response);
  } catch (error) {
      return res.status(500).send({ error: error, mensagem: "Erro ao procurar" });
  }
};

//------- FINALIZAR PEDIDO ----------
exports.finalizarPedidoParceiroJMonte = async (req, res) => {
  const dados = req.body;
  let numeronp = dados.numeronp;
  let lojaselecionada = dados.lojaselecionada;
  let id_usuario = dados.id_usuario;
  let comprovante_nome = dados.imagem;

  console.log(dados);

  //------------------- data de hoje ----------------
  var currentTime = new Date();
  var dd = String(currentTime.getDate()).padStart(2, "0");
  var mm = String(currentTime.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = currentTime.getFullYear();

  currentTime = yyyy + "-" + mm + "-" + dd; // padrao banco
  let currentTimeF = dd + "/" + mm + "/" + yyyy; // padrao br
  //------------------- data de hoje ----------------

  let status = "P";
  let aberto = "S";
  let data_venda = currentTime;
  let data_lancamento = currentTime;

  let result = await pg.execute(
    "INSERT INTO vendas (id_usuario, numero_venda, data_venda, data_lancamento,  status, aberto ,total_pontos, id_loja, imagem) VALUES ($1, $2 ,$3, $4 , $5, $6, $7, $8, $9) RETURNING *",
    [
      +id_usuario,
      +numeronp,
      `${data_venda}`,
      `${data_lancamento}`,
      status,
      `${aberto}`,
      0,
      lojaselecionada,
      comprovante_nome
    ]
  );
  console.log("************ linha 40 **********************");
  const response = {
    mensagem: "Pedido lançado com sucesso(PENDENTE)",
    id_venda: result.rows[0].id_vendas,
  };
  res.status(201).send(response);
};
//------- FINALIZAR PEDIDO ----------
exports.finalizarPedido = async (req, res) => {
  const { id_venda } = req.body;
  let status_venda = "P";
  let aberto = "N";

  try {
    await pg.execute(
      "UPDATE vendas SET aberto = $1, status = $2 WHERE id_vendas = $3",
      [aberto, status_venda, id_venda]
    );

    const response = {
      mensagem: "Venda finalizada com sucesso(PENDENTE)",
    };
    console.log("--- FINALIZAR PEDIDO ---");
    res.status(201).send(response);
  } catch (error) {
    return res.status(500).send({ error: error, mensagem: "Erro ao salvar!" });
  }
};

exports.listarPedidoUsuario = async (req, res) => {
  let id_usuario = req.params.id_usuario;
console.log(id_usuario);
  let sqlListaPedidosUsuario =
    "SELECT v.id_vendas,v.data_venda, v.numero_venda, v.total_pontos, v.status, l.descricao_loja " +
    "FROM vendas v, lojas l WHERE v.id_loja = l.id_loja_venda " +
    "AND v.id_usuario = $1 ORDER BY v.id_vendas desc";
    console.log(sqlListaPedidosUsuario);
  try {
    const result = await pg.execute(sqlListaPedidosUsuario, [id_usuario]);

    var response = {
      quantidade: result.rows.length,
      pedidos: result.rows,
    };
  } catch (error) {
    var response = {
      pedidos: [],
      quantidade: 0,
    };
  }
  console.log("--- RET LISTA PEDIDOS USUARIOS ---");

  res.status(200).send(response);
};

//-------- SEL CLIENTE DO PEDIDO -----------
exports.selecionarClienteParaPedido = async (req, res) => {
  const { id_venda, id_cliente } = req.body;
  try {
    await pg.execute("UPDATE vendas SET id_cliente = $1 WHERE id_vendas = $2", [
      id_cliente,
      id_venda,
    ]);

    const response = {
      mensagem: "Cliente salvo com sucesso",
    };
    console.log("--- SEL CLIENTE DO PEDIDO ---");
    res.status(201).send(response);
  } catch (error) {
    return res.status(500).send({ error: error, mensagem: "Erro ao salvar!" });
  }
};

//--------atualizar vendedor e data do pedido pelo profissional ---------
exports.upVendedorData = async (req, res) => {
  let { id_venda, vendedor_venda, data_venda } = req.body;
  if (data_venda === "" || data_venda === null) {
    data_venda = Date.now();
  }
  try {
    const result = await pg.execute(
      "UPDATE vendas SET vendedor = $1, data_venda = $2 WHERE id_vendas = $3",
      [vendedor_venda, data_venda, id_venda]
    );

    let quantidade = result.rowCount;
    if (quantidade > 0) {
      var response = {
        status: 200,
      };
      console.log("--ATUL VENDEDOR E DATA DO PEDIDO ---");
      res.status(200).send(response);
    } else {
      var response = {
        status: 500,
      };
      console.log("--ATUL VENDEDOR E DATA DO PEDIDO ---");
      res.status(500).send(response);
    }
  } catch (error) {
    res.status(500);
  }
};
//------ RET CLIENTE DA VENDO id -------------
exports.getClienteDaVendas = async (req, res) => {
  let id_venda = req.params.id_venda;

  try {
    const result = await pg.execute(
      "SELECT nome_cliente FROM vendas v, clientes c WHERE v.id_cliente = c.id_cliente AND v.id_vendas = $1",
      [id_venda]
    );

    var response = {
      nome_cliente: result.rows[0].nome_cliente,
    };
  } catch (error) {
    var response = {
      nome_cliente: null,
    };
  }
  console.log("---- RET CLIENTE DA VENDO id -------");
  res.status(200).send(response);
};

//----------- DELETA COMRPOVANTE ----------
exports.deletarComprovante = async (req, res) => {
  let id_anexo = req.params.id_anexo;

  await pg.execute("DELETE FROM anexosvendas WHERE id_anexo = $1", [id_anexo]);

  var response = {
    msg: "Arquivo deletado",
  };
  console.log("---- DELETA COMRPOVANTE ------");
  res.status(200).send(response);
};

exports.deletarVenda = async (req, res) => {
  let id_venda = req.params.id_venda;

  await pg.execute("DELETE FROM itemsvendas WHERE id_vendas = $1", [id_venda]);
  await pg.execute("DELETE FROM anexosvendas WHERE id_vendas = $1", [id_venda]);
  await pg.execute("DELETE FROM vendas WHERE id_vendas = $1", [id_venda]);

  var response = {
    msg: "Venda Excluida.",
  };
  console.log("---- DELETA VENDA ------");
  res.status(200).send(response);
};

//------------ SALVA ANEXO -------------
exports.salvarAnexosVendas = async (req, res) => {
  let id_venda = req.params.id_venda;
  let link_anexo = req.file.filename;

  console.log(id_venda);
  console.log(link_anexo);
  const result = await pg.execute(
    "INSERT INTO anexosvendas (id_vendas, link_anexo) VALUES ($1, $2) RETURNING *",
    [id_venda, link_anexo]
  );

  console.log(result);
  console.log("********** salvarAnexosVendas linha 208 *******");
  let id_venda_gerada = result.rows[0].id_vendas;

  var response = {
    id_anexo: id_venda_gerada,
    link_anexo: link_anexo,
  };
  console.log("---- SALVA ANEXO -----");
  res.status(200).send(response);
};

//--------- RET ANEXOS DA VENDA id ------------
exports.getAnexosVendas = async (req, res) => {
  let id_venda = req.params.id_venda;
  try {
    const result = await pg.execute(
      "SELECT * FROM anexosvendas WHERE id_vendas = $1",
      [id_venda]
    );

    const q = result.rows.length;
    var response;
    if (q > 0) {
      response = {
        quantidade: result.rows.length,
        anexos: result.rows,
      };
    } else {
      response = {
        quantidade: 0,
        anexos: [],
      };
    }
    console.log("---- RET ANEXOS DA VENDA id ----");
    res.status(200).send(response);
  } catch (error) {
    return res
      .status(500)
      .send({ error: error, mensagem: "Erro ao procurar anexos" });
  }
};

//------ RET TODAS VENDAS USUARIO id ----------
exports.getVendasDoUsuario = async (req, res) => {
  let id_usuario = req.params.id_usuario;
  try {
    const result = await pg.execute(
      "SELECT * FROM vendas WHERE id_usuario = $1",
      [id_usuario]
    );

    const q = result.rows.length;
    var response;
    if (q > 1) {
      response = {
        quantidade: result.rows.length,
        vendas: result.rows,
      };
    } else {
      response = {
        quantidade: result.rows.length,
        vendas: {
          id_venda: result.rows[0].id_venda,
          numero_venda: result.rows[0].numero_venda,
          total_venda: parseFloat(result.rows[0].valor),
          status_venda: result.rows[0].status,
          total_pontos: result.rows[0].total_pontos,
          data_venda: result.rows[0].data_venda,
        },
      };
    }
    console.log("--- RET TODAS VENDAS USUARIO id ----");
    res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({ error: error, mensagem: "Erro ao procurar" });
  }
};

//-------------- RET PRODUTOS DA VENDA id -----------
exports.getProdutosLancadosNasVendas = async (req, res) => {
  let id_venda = req.params.id_venda;
  let id_produto = req.params.id_produto;
  let id_tamanho = req.params.id_tamanho;

  try {
    // ------------------------- CONTAGEM PONTOS PENDENTES(INICIO) -----------------------------
    const resultPontosPendentes = await pg.execute(
      "select iv.quant_item, iv.pontos " +
        "from itemsvendas iv " +
        "WHERE iv.id_vendas = $1" +
        "AND iv.id_produto = $2" +
        "AND iv.id_tamanho = $3",
      [id_venda, id_produto, id_tamanho]
    );

    const response = {
      quantidadesLancadas: resultPontosPendentes.rows,
    };
    console.log("------ RET PRODUTOS DA VENDA id -----");
    res.status(200).send(response);
  } catch (error) {
    return res
      .status(500)
      .send({ error: error, mensagem: "Erro ao procurar!" });
  }
};

//--------------- RET PONTOS DA VENDA -----------
exports.getPontosVendas = async (req, res) => {
  console.log('*************** getPontosVendas ********************')
  const id_usuario = req.params.id_usuario;

  try {
    // ------------------------- CONTAGEM PONTOS PENDENTES(INICIO) ----------------------------------------------
    let sqlPontosPendentes =
      "SELECT SUM(total_pontos) AS total_pontos_pendentes " +
      "FROM vendas WHERE vendas.status = $1 " +
      "AND vendas.id_usuario = $2";
    console.log(sqlPontosPendentes);
    const resultPontosPendentes = await pg.execute(sqlPontosPendentes, [
      "P",
      id_usuario,
    ]);

    let pontosPendentes = resultPontosPendentes.rows[0].total_pontos_pendentes;
    if (pontosPendentes == null) {
      pontosPendentes = 0.0;
    } else {
      pontosPendentes = pontosPendentes;
    }
    // ------------------------- CONTAGEM PONTOS PENDENTES(FINAL) ----------------------------------------------
    // ------------------------- CONTAGEM PONTOS APROVADOS(INICIO) ----------------------------------------------
    let sqlPontosAprovados =
      "SELECT SUM(total_pontos) AS total_pontos_aprovados " +
      "FROM vendas WHERE vendas.status = $1" +
      "AND vendas.id_usuario = $2";
    const resultPontosAprovados = await pg.execute(sqlPontosAprovados, [
      "A",
      id_usuario,
    ]);

    let pontosAprovados = resultPontosAprovados.rows[0].total_pontos_aprovados;
    if (pontosAprovados == null) {
      pontosAprovados = 0.0;
    } else {
      pontosAprovados = +pontosAprovados;
    }
    // ------------------------- CONTAGEM PONTOS APROVADOS(FINAL) ----------------------------------------------
    // ------------------------- CONTAGEM PONTOS REJEITADOS(INICIO) ----------------------------------------------
    let sqlPontosRejeitados =
      "SELECT SUM(total_pontos) AS total_pontos_rejeitados " +
      "FROM vendas WHERE vendas.status = $1" +
      "AND vendas.id_usuario = $2";
    const resultPontosRejeitados = await pg.execute(sqlPontosRejeitados, [
      "R",
      id_usuario,
    ]);
    let pontosRejeitados =
      resultPontosRejeitados.rows[0].total_pontos_rejeitados;
    if (pontosRejeitados == null) {
      pontosRejeitados = 0.0;
    } else {
      pontosRejeitados = pontosRejeitados;
    }
    // ------------------------- CONTAGEM PONTOS REJEITADOS(FINAL) ----------------------------------------------
    // ------------------------- CONTAGEM PONTOS SALDO(QDO SOLICITADO BRINDE) ----------------------------------------------
    //----------------- GET saldo geral --------------------
    let sqlPontosSaldo =
      "SELECT u.pontos_saldo FROM usuarios u where u.id_usuario = $1";
    console.log(sqlPontosSaldo);
    let resSqlPontosSaldo = await pg.execute(sqlPontosSaldo, [id_usuario]);

    let pontosSaldoUsuario = resSqlPontosSaldo.rows[0].pontos_saldo;
    if (pontosSaldoUsuario == null) {
      pontosSaldoUsuario = 0.0;
    } else {
      pontosSaldoUsuario = +pontosSaldoUsuario;
    }
    // ------------------------- CONTAGEM PONTOS SALDO(QDO SOLICITADO BRINDE) ----------------------------------------------
    const response = {
      pontos: {
        pontosPendentes: pontosPendentes,
        pontosAprovados: pontosAprovados,
        pontosRejeitados: pontosRejeitados,
        pontosSaldoUsuario: pontosSaldoUsuario,
      },
    };
    console.log(response);
    console.log("------ RET PONTOS DA VENDA -----");
    res.status(200).send(response);
  } catch (error) {
    return res
      .status(500)
      .send({ error: error, mensagem: "Erro ao procurar!" });
  }
};

//----------- RET VENDA ATUAL ------------
exports.getVendaAtual = async (req, res) => {
  const id_usuario = req.params.id_usuario;
  let venda_aberta = "S";
  try {
    const result = await pg.execute(
      "SELECT MAX(vendas.id_vendas) AS id_venda, vendas.status, vendas.total_pontos, numero_venda " +
        "FROM vendas , usuarios  " +
        "WHERE vendas.id_usuario = usuarios.id_usuario " +
        "AND usuarios.id_usuario = $1 " +
        "AND vendas.aberto = $2" +
        "GROUP BY vendas.status, vendas.total_pontos, numero_venda",
      [id_usuario, venda_aberta]
    );
    let id = 0;
    let status = "";
    let pontos = 0;
    let rs = result.rows.length;
    let quantidade = 0;
    if (rs > 0) {
      id = result.rows[0].id_venda;
      numero_venda = result.rows[0].numero_venda;
      status = result.rows[0].status;
      pontos = result.rows[0].total_pontos;
      quantidade = 1;
    } else {
      console.log("linha 344");
      const resultB = await pg.execute(
        "SELECT MAX(vendas.id_vendas) AS id_venda, vendas.status, vendas.total_pontos, numero_venda " +
          "FROM vendas , usuarios  " +
          "WHERE vendas.id_usuario = usuarios.id_usuario " +
          "AND usuarios.id_usuario = $1 " +
          "GROUP BY vendas.id_vendas, vendas.status, vendas.total_pontos, numero_venda " +
          "ORDER BY vendas.id_vendas DESC LIMIT 1",
        [id_usuario]
      );
      id = resultB.rows[0].id_venda;
      numero_venda = resultB.rows[0].numero_venda;
      status = resultB.rows[0].status;
      pontos = resultB.rows[0].total_pontos;
      quantidade = 0;
    }
    const response = {
      venda: {
        id_venda: id,
        numero_venda: numero_venda,
        linhas: quantidade,
        status: status,
        pontos: pontos,
      },
    };
    console.log("----- RET VENDA ATUAL ----");
    res.status(200).send(response);
  } catch (error) {
    return res
      .status(500)
      .send({ error: error, mensagem: "Erro ao procurar!" });
  }
};

//----------- SALVAR ITEM -------------
exports.salvarItem = async (req, res) => {
  const data = req.body;
  const id_usuario = data.id_usuario;
  const id_venda = data.id_venda;
  const id_produto = data.id_produto;
  const id_tamanho = data.id_tamanho;
  const quantidade_venda = data.quantidade_venda;
  const venda_existe = data.venda_existe;
  const pontos_item = data.pontos_item;

  //------------------- data de hoje ----------------
  var currentTime = new Date();
  var dd = String(currentTime.getDate()).padStart(2, "0");
  var mm = String(currentTime.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = currentTime.getFullYear();

  currentTime = yyyy + "-" + mm + "-" + dd; // padrao banco
  const currentTimeF = dd + "/" + mm + "/" + yyyy; // padrao br
  //------------------- data de hoje ----------------

  const status = 0;
  const aberto = "S";
  const data_venda = currentTime;
  const data_lancamento = currentTime;
  try {
    // ------------------- nova venda ------------------------
    if (venda_existe === false) {
      console.error("linha 406 vendas-controller salvar item");
      const resultA = await pg.execute(
        "SELECT MAX(numero_venda) AS max FROM vendas WHERE id_usuario = $1",
        [id_usuario]
      );
      let max_numero_venda = 0;
      max_numero_venda = resultA.rows[0].max;
      if (max_numero_venda > 0) {
        max_numero_venda = max_numero_venda + 1;
      } else {
        max_numero_venda = 1;
      }
      console.log(req.body);
      console.log("**********************************************");
      console.log(id_usuario);
      console.log(max_numero_venda);
      console.log(data_venda);
      console.log(data_lancamento);
      console.log(status);
      console.log(aberto);
      console.log(pontos_item);
      let result = await pg.execute(
        "INSERT INTO vendas (id_usuario, numero_venda, data_venda, data_lancamento,  status, aberto ,total_pontos) VALUES ($1, $2 ,$3, $4 , $5, $6, $7) RETURNING *",
        [
          id_usuario,
          max_numero_venda,
          `${data_venda}`,
          `${data_lancamento}`,
          status,
          `${aberto}`,
          pontos_item,
        ]
      );
      console.log(result);
      let id_venda_gerada = result.rows[0].id_vendas;
      const resultSeqLancamento = await pg.execute(
        "SELECT MAX(sequencia) AS max FROM itemsvendas WHERE id_vendas = $1",
        [id_venda_gerada]
      );
      let sequencia = 0;
      sequencia = resultSeqLancamento.rows[0].max;
      if (sequencia != null) {
        sequencia = sequencia + 1;
      } else {
        sequencia = 1;
      }
      if (id_venda_gerada) {
        await pg.execute(
          "INSERT INTO itemsvendas (id_produto, id_tamanho,  id_vendas, sequencia, data_lancamento,  quant_item, pontos) VALUES ($1, $2 ,$3, $4 , $5, $6, $7)",
          [
            id_produto,
            id_tamanho,
            id_venda_gerada,
            sequencia,
            `${data_lancamento}`,
            quantidade_venda,
            pontos_item,
          ]
        );
      }

      const response = {
        mensagem: "Venda criada com sucesso",
        vendaCriada: {
          id_venda_gerada: id_venda_gerada,
          total_pontos: pontos_item,
          data_venda: currentTimeF,
        },
      };
      console.log("----- SALVAR ITEM ------");
      res.status(200).send(response);
    } else {
      console.error("linha 478 vendas-controller salvar item");
      //------------------------  total items da venda ----------------------------
      // ------------------------ pegando seq lancamento items na venda ------------------------
      const consultaItemNaVenda = await pg.execute(
        "SELECT COUNT(id_itemvenda) AS ttl_vendas, SUM(quant_item) AS quant_item, SUM(pontos) AS pontos FROM itemsvendas WHERE id_produto = $1 AND id_tamanho = $2 AND id_vendas = $3",
        [id_produto, id_tamanho, id_venda]
      );
      let quantMsmItemNaVenda = consultaItemNaVenda.rows[0].ttl_vendas;
      if (quantMsmItemNaVenda > 0) {
        console.log(
          "+++++++++++++++++ linha 487  vendas-controller ++++++++++++++++++++"
        );
        // ------------------ produto ja existe, vai sobreescrever valores -----------------------------
        let resultSeqLancamento = await pg.execute(
          "SELECT sequencia FROM itemsvendas WHERE id_produto = $1 AND id_tamanho = $2 AND id_vendas = $3",
          [id_produto, id_tamanho, id_venda]
        );
        let sequenciaAtual = resultSeqLancamento.rows[0].sequencia;

        await pg.execute(
          "UPDATE itemsvendas SET quant_item = $1 , pontos = $2 WHERE sequencia = $3 AND id_produto = $4 AND id_vendas = $5",
          [quantidade_venda, pontos_item, sequenciaAtual, id_produto, id_venda]
        );
        // ----------------- atualizar total da venda ----------------------------------
        // ----------------- atualizar total da venda ----------------------------------
        const resultTotalItems = await pg.execute(
          "SELECT  SUM(pontos) AS total_pontos FROM itemsvendas WHERE id_vendas = $1 ",
          [id_venda]
        );
        const total_pontos = resultTotalItems.rows[0].total_pontos;
        await pg.execute(
          "UPDATE vendas SET total_pontos = $1 WHERE id_vendas = $2 ",
          [total_pontos, id_venda]
        );
        // ----------------- atualizar total da venda ----------------------------------
        // ----------------- atualizar total da venda ----------------------------------
      } else {
        console.log(
          "+++++++++++++++++ linha 513 vendas-controller ++++++++++++++++++++"
        );
        const resultSeqLancamento = await pg.execute(
          "SELECT MAX(sequencia) AS max FROM itemsvendas WHERE id_vendas = $1 ",
          [id_venda]
        );
        let sequencia = resultSeqLancamento.rows[0].max;
        sequencia++;
        console.log(
          "***************** linha 520 *********************************"
        );
        console.log(id_produto);
        console.log(id_tamanho);
        console.log(id_venda);
        console.log(sequencia);
        console.log(data_lancamento);
        console.log(quantidade_venda);
        console.log(pontos_item);
        let rsInsert = await pg.execute(
          "INSERT INTO itemsvendas (id_produto, id_tamanho, id_vendas, sequencia, data_lancamento,  quant_item,  pontos) VALUES ($1, $2 ,$3, $4 , $5, $6, $7)",
          [
            id_produto,
            id_tamanho,
            id_venda,
            sequencia,
            `${data_lancamento}`,
            quantidade_venda,
            pontos_item,
          ]
        );
        console.log(
          "++++++++++++++++++++++++++++++ 533 +++++++++++++++++++++++++++++"
        );
        console.log(rsInsert);
        //}
        const resultTotalItems = await pg.execute(
          "SELECT SUM(pontos) AS total_pontos FROM itemsvendas WHERE id_vendas = $1 ",
          [id_venda]
        );
        const total_pontos = resultTotalItems.rows[0].total_pontos;
        //------------------------ atualizando total venda ----------------------------
        await pg.execute(
          "UPDATE vendas SET total_pontos = $1 WHERE id_vendas = $2 ",
          [total_pontos, id_venda]
        );
      }

      const response = {
        mensagem: "Venda atualizada com sucesso",
        vendaCriada: {
          id_venda_gerada: id_venda,
          total_pontos: pontos_item,
          data_venda: currentTimeF,
        },
      };
      console.log("----- SALVAR ITEM ------");
      res.status(201).send(response);
    }
  } catch (error) {
    return res
      .status(500)
      .send({ error: error, mensagem: "Erro ao inserir produto na venda!" });
  }
};
