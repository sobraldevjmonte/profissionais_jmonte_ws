const multer = require("multer");

module.exports = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
			cb(null, "../../durafix/profissionais-durafix-web-adm/static/img_produtos");
            //cb(null, "../../api_profissionais/web/static/img_produtos");
        },
        filename: (req, file, cb) => {
            // cb(null, file.originalname);
            cb(null, Date.now().toString() + "_" + file.originalname);
        },
    }),
});