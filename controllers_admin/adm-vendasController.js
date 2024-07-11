const pg = require("../conexao");

//------------- RET ANEXOS PED PELO id ------------
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
    console.log("----- RET ANEXOS PED PELO id ----");
    res.status(200).send(response);
  } catch (error) {
    return res
      .status(500)
      .send({ error: error, mensagem: "Erro ao procurar anexos" });
  }
};

//--------------- ATUAL MOTIVO REJEICAO PELO id --------------
exports.atualizarMotivoRejeicaoPedido = async (req, res) => {
  const { id_venda, motivo_rejeicao } = req.body;

  try {
    const result = await pg.execute(
      "UPDATE vendas SET motivo_rejeicao = $2 WHERE id_vendas = $1 RETURNING *",
      [id_venda, motivo_rejeicao]
    );

    response = {
      msg: "Pedido atualizado com sucesso",
    };
    console.log("------ ATUAL MOTIVO REJEICAO PELO id -----");
    res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({
      error: error,
      mensagem: "Erro ao tentar atualizar o pedido",
    });
  }
};
//--------------- PREMIAR PEDIDO PELO id --------------
exports.premiarPedido = async (req, res) => {
  const { id_venda, premiado } = req.body;
  console.log("------ PREMIAR PELO id -----");
  console.log(req.body);
  console.log("------ PREMIAR PELO id -----");

  sqlConsultaBrinde = "";

  try {
    await pg.execute("UPDATE vendas SET premiado = $2 WHERE id_vendas = $1", [
      id_venda,
      premiado,
    ]);

    response = {
      msg: "Pedido atualizado com sucesso",
    };

    res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({
      error: error,
      mensagem: "Erro ao tentar atualizar o pedido",
    });
  }
};

//-------------- ATUAL STATUS PEDIDO --------------
exports.atualizarStatusPedido = async (req, res) => {
  console.log("------------------- ATUAL STATUS PEDIDO --------------------");
  console.log("idvenda: " + id_venda);
  console.log("id_usuario: " + id_usuario);
  console.log("status: " + status);
  try {
    const result = await pg.execute(
      "UPDATE vendas SET status = $2 WHERE id_vendas = $1 RETURNING *",
      [id_venda, status]
    );

    const q = result.rows.length;
    const status_r = result.rows[0].status;
    let rejeicos_r = result.rows[0].rejeicoes;
    var response;
    response = {
      msg: "Pedido atualizado com sucesso",
      rejeicoes: rejeicos_r,
    };
    if (q > 0) {
      if (status_r === "R") {
        rejeicos_r++;
        await pg.execute(
          "UPDATE vendas SET rejeicoes = $2 WHERE id_vendas = $1",
          [id_venda, rejeicos_r]
        );
      }

      response = {
        msg: "Pedido atualizado com sucesso",
        rejeicoes: rejeicos_r,
      };
      res.status(200).send(response);
    } else {
      response = {
        msg: "Não foi possível atualizar!",
        rejeicoes: rejeicos_r,
      };
      
      res.status(200).send(response);
    }
  } catch (error) {
    return res
      .status(500)
      .send({ error: error, mensagem: "Erro ao tentar atualizar o pedido" });
  }
};

//----------- LISTA PEDIDOS idloja, status -------------
exports.listaPedidosPorStatus = async (req, res) => {
  let id_loja = req.params.id_loja;
  let status = req.params.status;

  try {
    const result = await pg.execute(
      "SELECT v.id_vendas,v.data_venda, v.data_lancamento,  v.numero_venda, v.total_pontos, v.status, c.nome_cliente, u.nome, v.rejeicoes, v.motivo_rejeicao " +
        "FROM vendas v, clientes c, usuarios u " +
        "WHERE v.id_cliente = c.id_cliente " +
        "AND v.id_usuario = u.id_usuario " +
        "AND v.status = $2" +
        "AND c.id_loja = $1 ORDER BY v.data_venda asc",
      [id_loja, status]
    );

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
  console.log("------- LISTA PEDIDOS idloja, status -----");
  res.status(200).send(response);
};

//------------- LISTA PEDIDOS idloja ------------------
exports.listaTodosPedidos = async (req, res) => {
  let id_loja = req.params.id_loja;
  let sql =
    "SELECT v.id_vendas, v.data_lancamento, v.data_venda, v.numero_venda, v.total_pontos, v.status, c.nome_cliente, u.nome, v.rejeicoes, v.motivo_rejeicao, v.premiado, u.id_usuario " +
    "FROM vendas v, clientes c, usuarios u " +
    "WHERE v.id_cliente = c.id_cliente " +
    "AND v.id_usuario = u.id_usuario " +
    "AND c.id_loja = $1 ORDER BY v.data_lancamento desc, v.numero_venda desc";
    console.log(id_loja)
    console.log(sql)
  try {
    const result = await pg.execute(sql, [id_loja]);

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
  console.log("------ LISTA PEDIDOS idloja ---------");
  res.status(200).send(response);
};
