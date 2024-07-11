const pg = require("../conexao");
const {
  dataHoje,
  formatToBRL,
  parseDate,
  getDaysDifference,
} = require("../uteis/utils");

//------ retorna todos os brindes -------------
exports.listaTodosBrindes = async (req, res) => {
  let sqlListaBrindes = "SELECT * FROM brindes ORDER BY id_brinde";
  console.log("---------- LISTA TODOS OS BRINDES ----------------");

  try {
    const result = await pg.execute(sqlListaBrindes);
    const response = {
      quantidade: result.rows.length,
      brindes: result.rows,
    };

    res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({ error: error, mensagem: "Erro ao procurar" });
  }
};
exports.inativarBrinde = async (req, res) => {
  console.log("+++++++++ INATIVA/ATIVAR BRINDE ++++++++++++++");
  let id_brinde = req.params.id_brinde;
  let ativo = "S";
  let sqlAtivo = "SELECT ativo FROM brindes WHERE id_brinde = $1";

  try {
    let rs = await pg.execute(sqlAtivo, [id_brinde]);
    if (rs.rows[0].ativo == "S") {
      ativo = "N";
    }
    await pg.execute("UPDATE brindes SET ativo = $1 WHERE id_brinde = $2", [
      ativo,
      id_brinde,
    ]);
    const response = {
      mensagem: "Brinde ativado/inativado com sucesso!",
      brinde: {
        id_brinde,
      },
    };
    res.status(204).send(response);
  } catch (e) {
    return res.status(500);
  }
};

//------ salvar brinde -------------
exports.salvarBrinde = async (req, res) => {
  const ativo = "S";
  const { descricao, pontos, valor, quantidade, link } = req.body;
  const resultInsert = await pg.execute(
    "INSERT INTO brindes (descricao, pontos, valor, quantidade, imagem, ativo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [descricao.toUpperCase(), pontos, valor, quantidade, link, ativo]
  );

  const response = {
    mensagem: "Brinde cadastrado com sucesso!",
    brinde: {
      id_brinde: resultInsert.rows[0].id_brinde,
      descricao: descricao,
    },
  };
  res.status(201).send(response);
};

//------ salvar brinde -------------
exports.atualizarBrinde = async (req, res) => {
  console.log("+++++++++ ATUALIZAR BRINDE ++++++++++++++");
  let id_brinde = req.params.id_brinde;
  const { descricao, pontos, valor, quantidade, link } = req.body;
  console.log(req.body);
  try {
    const resultInsert = await pg.execute(
      "UPDATE brindes SET descricao = $1, pontos = $2, valor = $3, quantidade = $4, imagem = $5 WHERE id_brinde = $6",
      [descricao, pontos, valor, quantidade, link, id_brinde]
    );

    console.log("dfdsfds");
    const response = {
      mensagem: "Brinde atualizado com sucesso!",
      brinde: {
        descricao: descricao,
      },
    };
    res.status(204).send(response);
  } catch (e) {
    return res.status(500);
  }
};

//-------------- SALVAR IMAGEM PRODs --------------
exports.salvarImagem = async (req, res) => {
  let id_brinde = req.params.id_brinde;
  let link_anexo = req.file.filename;
  try {
    await pg.execute("UPDATE brindes set imagem = $1 WHERE id_brinde = $2", [
      link_anexo,
      id_brinde,
    ]);

    const response = {
      mensagem: "Imagem do brinde atualizado!",
    };
    console.log("--------- SALVAR IMAGEM BRINDE -------");
    res.status(201).send(response);
  } catch (error) {
    return res
      .status(500)
      .send({ error: error, mensagem: "Não foi possivel atualizar!" });
  }
};

exports.lirtarPedidosBrindes = async (req, res) => {
  let sqlListaPedidosBrindes =
    "select " +
    "   b.descricao as descricao_brinde, " +
    "   b.pontos as pontos_brinde, " +
    "   b.quantidade as estoque, " +
    "   u.nome as nome_parceiro, " +
    "   u2.nome as nome_autorizador, " +
    "   u2.nome as nome_entregador, " +
    "   bp.id_premiacao , " +
    "   bp.id_parceiro , " +
    "   bp.id_premio , " +
    "   bp.id_autorizador , " +
    "   TO_CHAR(bp.data_solicitacao, 'DD/MM/YYYY') AS data_solicitacao, " +
    "   TO_CHAR(bp.data_autorizacao, 'DD/MM/YYYY') as data_autorizacao , " +
    "   bp.autorizado , " +
    "   bp.status , " +
    "   bp.entregue , " +
    "   TO_CHAR(bp.data_entrega, 'DD/MM/YYYY')as data_entrega  " +
    "from " +
    "   brindes_premiacoes bp " +
    "join brindes b on " +
    "   bp.id_premio = b.id_brinde " +
    "left join usuarios u on " +
    "   bp.id_parceiro = u.id_usuario " +
    "left join usuarios u2 on " +
    "   bp.id_autorizador = u2.id_usuario " +
    "left join usuarios u3 on " +
    "   bp.id_autorizador = u3.id_usuario " +
    "order by " +
    "   bp.id_premiacao";
  console.log(sqlListaPedidosBrindes);
  //let sqlListaPedidosBrindes = "SELECT * FROM brindes_premiacoes ORDER BY id_premiacao";
  try {
    const result = await pg.execute(sqlListaPedidosBrindes);
    const response = {
      quantidade: result.rows.length,
      pedidos: result.rows,
    };
    console.log("---------- LISTA TODOS OS PEDIDOS BRINDES ----------------");
    res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({ error: error, mensagem: "Erro ao procurar" });
  }
};
exports.rejeitaPedido = async (req, res) => {
  let id_pedido = req.params.id_pedido;
  let id_parceiro = req.params.id_parceiro;
  let sqlPedido =
    "SELECT pontos, status FROM brindes_premiacoes WHERE id_premiacao = $1";

  console.log("************* REJEITAR PEDIDO **************");

  let result = await pg.execute(sqlPedido, [id_pedido]);

  if (result.rowCount > 0) {
    let pontosDoPedido = +result.rows[0].pontos;
    let statusDoPedido = result.rows[0].status;

    if (statusDoPedido === "PENDENTE" || statusDoPedido === "APROVADO") {
      let dadosUsuario =
        "SELECT pontos_saldo FROM usuarios WHERE id_usuario = $1";
      let rsDadosUsuarios = await pg.execute(dadosUsuario, [id_parceiro]);
      let pontosAtuaisUsuario = +rsDadosUsuarios.rows[0].pontos_saldo;

      let sqlRetornaPontos =
        "UPDATE usuarios SET pontos_saldo = $1 WHERE id_usuario = $2";
      let totalPontosFinal = pontosAtuaisUsuario + pontosDoPedido;

      await pg.execute(sqlRetornaPontos, [totalPontosFinal, id_parceiro]);

      let statusFinalPedido = "REJEITADO";
      let sqlUpStatusPedido =
        "UPDATE brindes_premiacoes SET status = $1 WHERE id_premiacao = $2";
      await pg.execute(sqlUpStatusPedido, [statusFinalPedido, id_pedido]);
    }

    const response = {
      mensagem: "EXECUTADO COM SUCESSO!",
    };

    return res.status(200).send(response);
  } else {
    return res.status(404).send("Pedido não encontrado");
  }
};
(exports.aprovarPedido = async (req, res) => {
  console.log("************* APROVAR PEDIDO **************");
  let id_pedido = req.params.id_pedido;
  let id_autorizador = req.params.id_autorizador;
  let dataAutorizacao = dataHoje();

  let statusFinalPedido = "APROVADO";
  let sqlUpStatusPedido =
    "UPDATE brindes_premiacoes SET status = $1, id_autorizador = $2, data_autorizacao = $3 WHERE id_premiacao = $4";

  console.log(sqlUpStatusPedido);
  await pg.execute(sqlUpStatusPedido, [
    statusFinalPedido,
    id_autorizador,
    dataAutorizacao,
    id_pedido,
  ]);
  res.status(201).send("********* aprovar pedido ****************" + id_pedido);
}),
  (exports.entregarPedido = async (req, res) => {
    let id_pedido = req.params.id_pedido;
    let id_premio = req.params.id_premio;
    let id_entregador = req.params.id_entregador;
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++");

    let sqlDadosBrinde = "SELECT quantidade FROM brindes WHERE id_brinde = $1";
    let rsDadosBrinde = await pg.execute(sqlDadosBrinde, [id_premio]);
    let estoque = rsDadosBrinde.rows[0].quantidade;

    console.log(estoque);
    if (estoque > 0) {
      let saldoFinal = estoque - 1;
      let sqlAtualizaEstado =
        "UPDATE brindes SET quantidade = $1 WHERE id_brinde = $2";
      await pg.execute(sqlAtualizaEstado, [saldoFinal, id_premio]);

      let statusDoPedido = "ENTREGUE";
      let dataEntrega = dataHoje();
      let pedidoEntregue = true;

      let sqlAtualizaPedido =
        "UPDATE brindes_premiacoes SET status = $1, data_entrega = $2, entregue = $3, id_entregador = $4 WHERE id_premiacao = $5";
      await pg.execute(sqlAtualizaPedido, [
        statusDoPedido,
        dataEntrega,
        pedidoEntregue,
        id_entregador,
        id_pedido,
      ]);
      const response = {
        status: 200,
        msg: "Efetuado com sucesso.",
      };
      res.status(200).send(response);
    } else {
      const response = {
        status: 404,
        msg: "Saldo insuficiente em estoque.",
      };
      res.status(404).send(response);
    }
  }),
  //------------- RET LISTA PEDIDOS USUARIOS ---------
  (exports.solicitarBrinde = async (req, res) => {
    console.log("**************** SOLICITAR BRINDE ****************");
    let dataHojex = dataHoje();
    console.log(dataHojex);

    const data = req.body;
    let id_parceiro = data.id_usuario;
    let id_brinde = data.id_brinde;
    let pontos_brinde = data.pontos_do_brinde;
    let pontos_saldo = data.pontosSaldoUsuario - pontos_brinde;

    console.log(req.body)

    // let sqlConferePontos =
    //   "SELECT u.pontos_saldo FROM usuarios u where u.id_usuario = $1";
    // console.log(sqlConferePontos);

    let sqlSolicitaBrinde =
      "INSERT INTO brindes_premiacoes (id_premio, id_parceiro, data_solicitacao, autorizado, pontos, pontos_saldo, status) VALUES ($1, $2, $3, $4, $5, $6, $7) returning *";
    console.log(sqlSolicitaBrinde);

    try {
      let resSqlPontos = await pg.execute(sqlSolicitaBrinde, [
        id_brinde,
        id_parceiro,
        dataHojex,
        "false",
        pontos_brinde,
        pontos_saldo,
        "PENDENTE",
      ]);
      //console.log(resSqlPontos.rows[0]);
      const q = resSqlPontos.rows.length;

      if (q > 0) {
        let sqlAtualizaSaldoUsuario =
          "UPDATE usuarios SET pontos_saldo = $1 WHERE id_usuario = $2";
        await pg.execute(sqlAtualizaSaldoUsuario, [pontos_saldo, id_parceiro]);
        const response = {
          mensagem: "SOLICITA BRINDE",
          id_premiacao: resSqlPontos.rows[0].id_premiacao,
          saldo_pontos: pontos_saldo,
        };
        res.status(201).send(response);
      } else {
        res.status(200).send("Problema na requisição");
      }
    } catch (error) {
      return res
        .status(500)
        .send({ error: error, mensagem: "Erro ao solicitar!" });
    }
  });
