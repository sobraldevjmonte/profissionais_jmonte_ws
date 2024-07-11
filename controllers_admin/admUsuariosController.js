const pg = require("../conexao");

//--------------- ATIVAR/INAT USUARIO ----------------
exports.ativarInativarUsuario = async(req, res) => {
    let id_usuario = req.params.id_usuario;
    const { ativo } = req.body;

    try {
        await pg.execute("UPDATE usuarios set ativo = $1 WHERE id_usuario = $2", [
            ativo,
            id_usuario,
        ]);

        const response = {
            mensagem: "Usuário atualizado com sucesso!",
            usuario: {
                id_usuario: id_usuario,
                ativo: ativo,
            },
        };
        console.log("-------- ATIVAR/INAT USUARIO --------");
        res.status(200).send(response);
    } catch (error) {
        return res.status(500);
    }
};

//------------ SALVAR USUARIO -----------------
exports.salvarUsuario = async(req, res) => {
    let ativo = "S";
    const { id_loja_usuario, nome, tipo, telefone1, telefone2, usuario, senha } =
    req.body;
    try {
        const rsPesquisaUsuario = await pg.execute(
            "SELECT id_usuario FROM usuarios WHERE usuario = $1", [usuario]
        );
        const linhas = rsPesquisaUsuario.rows.length;
        if (linhas) {
            console.log("--------- SALVAR USUARIO --------");
            res.status(204).send({
                msg: "Usuario já cadastrado!",
            });
        } else {
            const resultInsert = await pg.execute(
                "INSERT INTO usuarios (nome, usuario, senha, tipo, id_loja_usuario, telefone1, telefone2, ativo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *", [
                    nome,
                    usuario,
                    senha,
                    tipo,
                    id_loja_usuario,
                    telefone1,
                    telefone2,
                    ativo,
                ]
            );

            const response = {
                mensagem: "Usuário cadastrado com sucesso!",
                usuario: {
                    id_usuario: resultInsert.rows[0].id_usuario,
                    nome: nome,
                },
            };
            res.status(201).send(response);
        }
    } catch (error) {
        return res
            .status(500)
            .send({ error: error, mensagem: "Não foi possivel salvar!" });
    }
};

//------------ RET TODOS USUARIOs ------------
exports.getUsuariosCompleto = async(req, res) => {
	console.log(process.env.POSTGRES_HOS)
    console.log(process.env.POSTGRES_USER)
    console.log(process.env.POSTGRES_PASSWORD)
    console.log(process.env.POSTGRES_DATABASE)
    console.log(process.env.POSTGRES_PORT)
    try {
        let result = await pg.execute(
            "SELECT * FROM usuarios ORDER BY usuarios.id_usuario"
        );
		let reg = result.rows.length;
		console.log(reg)

        const response = {
            quantidade: result.rows.length,
            usuarios: result.rows,
        };
        console.log("----- RET TODOS USUARIOs -----");
        res.status(200).send(response);
    } catch (error) {
        return res
            .status(500)
            .send({ error: error, mensagem: "Erro ao procurar!" });
    }
};