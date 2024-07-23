const multer = require("multer");

module.exports = multer({
    
    storage: multer.diskStorage({
        
        destination: (req, file, cb) => {
            cb(null, "../../profissionais_jmonte/profissionais_jmonte_web/static/anexos");
			cb(null, "../../../../../../projetos_react/jporta2024git/jportal-web/public/anexos");

        },
        filename: (req, file, cb) => {
            cb(null, file.originalname);
            // cb(null, Date.now().toString() + "_" + file.originalname);
        },
    }),
   
});