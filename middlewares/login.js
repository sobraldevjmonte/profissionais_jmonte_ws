const jwt = require('jsonwebtoken');
exports.obrigatorio = (req, res, next)=>{
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decode = jwt.verify(token, process.env.JWT_KEY);
        req.usuarioToken = decode;
        next();
    }catch(e){
        return res.status(401).send({mensagem: 'Falha na autenticação!'})
    }
}

exports.opcional = (req, res, next)=>{
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decode = jwt.verify(token, process.env.JWT_KEY);
        req.usuarioToken = decode;
        next();
    }catch(e){
        next();
    }
}