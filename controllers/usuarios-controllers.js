const pg = require("../conexao");
// const bcrypt = require("bcrypt");

//------------- LISTA TODOS USUARIOS -------------
exports.getUsuarios = async(req, res) => {
	let sql = "SELECT * FROM usuarios";
    try {
        const result = await pg.execute(sql)

        const response = {
            quantidade: result.rows.length,
            usuarios: result.rows,
        }; 
        console.log("----- LISTA USUARIOS -------");
        res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({ error: error, mensagem: "Erro ao procurar" });
    }
};

//----------- DELETAR USUARIO PELO id ---------
exports.deletarUsuario = async(req, res) => {
    const id = req.params.id;
	
    try {
        await pg.execute("DELETE FROM usuarios WHERE id_usuario=$1", [id]);

        const response = {
            mensagem: `Usuario ${id} excluído com sucesso!`,
        };
        console.log("--- DEL USUARIO PELO id ----");
        res.status(202).send(response);
    } catch (error) {
        return res.status(500).send({
            error: error,
            mensagem: "Erro ao deletar",
        });
    }
};

//---------- RET USUARIO PELO id --------
exports.getUsuarioId = async(req, res) => {
    const id = req.params.id;
    try {
        const result = await pg.execute(
            "SELECT * FROM usuarios WHERE id_usuario = $1", [id]
        );

        const response = {
            quantidade: result.rows.length,
            usuario: result.rows,
        };
        console.log("---- RET USUARIO PELO id ----");
        res.send(200).send(response);
    } catch (error) {
        return res.status(500).send({
            error: error,
            mensagem: "Usuario nao encontrado!",
        });
    }
};

//--------- RET USUARIO PELO NOME -------
exports.getUsuarioNome = async(req, res) => {
    const nome = req.params.nome;
    console.log(nome)
    try {
        const sql =  `SELECT * FROM usuarios WHERE nome ILIKE '%${nome}%'`
        const result = await pg.execute(sql);         
       

        const linhas = result.rows.length;
        if (linhas > 0) {
            const response = {
                quantidade: result.rows.length,
                usuarios: result.rows,
            };
            console.log("------ RET USUARIO PELO NOME ------");
            res.status(200).send(response);
        } else {
            return res.status(500).send({
                quantidade: linhas,
                mensagem: "Usuario(s) não encontrado(s)!" + sql,
            });
        }
    } catch (error) {
        return res.status(500).send({
            error: error,
            mensagem: "Usuario(s) não encontrado(s)!" + sql,
        });
    }
};

//------------- ATUALIZA USUARIO ------------
exports.atualizarUsuario = async(req, res, next) => {
    const id = req.params.id;
    const { usuario, senha } = req.body;
    try {
        await pg.execute(
            `UPDATE usuarios SET usuario = $1, senha = $2 WHERE id_usuario=$3`, [usuario, senha, id]
        );

        const response = {
            mensagem: "Usuario atualizado com sucesso!",
            id_usuario: id,
        };
        console.log("---- RET USUARIO PELO NOME ----");
        res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({
            error: error,
            mensagem: "Erro na atualização!",
        });
    }
};

// --------------- RESET DE SENHA --------
exports.resetSenha = async(req, res) => {
    const { usuario, senha } = req.body;
    let ativo = "S";
    try {
        const results = await pg.execute(
            "SELECT * FROM usuarios WHERE usuario=$1", [usuario]
        );
        const linhas = results.rows.length;
        if (linhas > 0) {
            const results2 = await pg.execute(
                "SELECT * FROM usuarios WHERE usuario=$1 AND ativo = $2", [usuario, ativo]
            );
            const linhas2 = results2.rows.length;
            if (linhas2 > 0) {
                await pg.execute("UPDATE usuarios SET senha = $1 WHERE usuario = $2", [
                    senha,
                    usuario,
                ]);

                const response = {
                    msg: "Senha atualizada com sucesso!",
                    usuarioCriado: {
                        nome_usuario: usuario,
                    },
                };
                console.log("-------- RESET DE SENHA --------");
                res.status(200).send(response);
            } else {
                console.log("-------- RESET DE SENHA --------");
                res.status(201).send({
                    msg: "Usuario inativo ou bloqueado!",
                });
            }
        } else {
            console.log("-------- RESET DE SENHA --------");

            res.status(204).send({
                msg: "Usuario não existe! Entre na opção PRIMEIRO ACESSO",
            });
        }
    } catch (error) {
        return res.status(500).send({
            error: error,
            msg: "Não foi possível atualizar!",
        });
    }
};

//------------- SALVA USUARIO ---------------
exports.salvarUsuario = async(req, res) => {
    const { nome, usuario, senha, nivel, loja, telefone1, telefone2 } = req.body;
    const ativo = "N";

    console.log(req.body)

    try {
        const results = await pg.execute(
            "SELECT * FROM usuarios WHERE usuario=$1", [usuario]
        );
        const linhas = results.rows.length;

        if (linhas > 0) {
            console.log("------- SALVA USUARIO ---------");

            res.status(204).send({
                msg: "Usuario já cadastrado!",
            });
        } else {
            const resultInsert = await pg.execute(
                "INSERT INTO usuarios (nome, usuario, senha, tipo, id_loja_usuario, telefone1, telefone2, ativo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *", [nome, usuario, senha, nivel, loja, telefone1, telefone2, ativo]
            );

            const response = {
                msg: "Usuario criado com sucesso",
                usuarioCriado: {
                    id_usuario: resultInsert.rows[0].id_usuario,
                    nome_usuario: usuario,
                    loja: loja,
                    nivel_usuario: nivel,
                    ativo: ativo,
                },
            };
            console.log("------- SALVA USUARIO ---------");
            res.status(201).send(response);
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({
            error: error,
            msg: "Não foi possível salvar!",
        });
    }
};
/* exports.salvarUsuario = async(req, res) => {
    const { usuario, senha, nivel, loja } = req.body;
    try {
        const results = await pg.execute(
            "SELECT * FROM usuarios WHERE usuario=$1", [usuario]
        );
        const linhas = results.rows.length;

        if (linhas > 0) {
            res.status(409).send({
                mensagem: "Usuario já cadastrado!",
            });
        } else {
            bcrypt.hash(senha, 10, async(errBcrypt, hash) => {
                if (errBcrypt) {
                    return res.status(500).send({ error: errBcrypt });
                }
                const resultInsert = await pg.execute(
                    "INSERT INTO usuarios (usuario, senha, nivel, loja, id_usuario_alt) VALUES ($1, $2, $3, $4, $5) RETURNING *", [usuario, hash, nivel, loja, req.usuarioToken.id_usuario]
                );
                const response = {
                    mensagem: "Usuario criado com sucesso",
                    usuarioCriado: {
                        id_criado: resultInsert.rows[0].id,
                        usuario: usuario,
                        senha: senha,
                        loja: loja,
                        nivel: nivel,
                    },
                };
                res.status(201).send(response);
            });
        }
    } catch (error) {
        return res.status(500).send({
            error: error,
            mensagem: "Não foi possível salvar!",
        });
    }
}; */

//-------------------- LOGIN ---------------------
exports.login = async(req, res) => {
    console.log('************** ROTA LOGIN 12/01/2024 ****************')
    const { usuario, senha } = req.body;
    let ativo = "S";
    try {
        console.log;
		let sql = "SELECT * FROM usuarios WHERE usuario=$1 AND senha=$2 AND ativo = $3";
		console.log(req.body)
		console.log(sql)
        let results = await pg.execute(sql, [usuario, senha, ativo]
        );

        let linhas = results.rows.length;
		console.log('linhas : ' + linhas)
        if (linhas > 0) {
			console.log('++++++++++++++++ if ++++++++++++++++++++')
            const response = {
                id_usuario: results.rows[0].id_usuario,
                nome_usuario: results.rows[0].nome,
                nivel_usuario: results.rows[0].tipo,
                ativo_usuario: results.rows[0].ativo,
                mensagem: "Autenticado com sucesso",
            };
            console.log("------ LOGIN ------");
            res.status(200).send(response);
        } else {
            console.log("------ LOGIN ------");
            return res.status(401).send({
                mensagem: "Erro de autenticação!Usuário ou pode esta bloqueado!",
            });
        }
    } catch (error) {
        return res.status(500).send({
            error: error,
            mensagem: "Erro na busca!",
        });
    }
};