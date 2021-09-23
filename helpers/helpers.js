require("dotenv").config();
const { join } = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null,  process.env.APP_PATH + '/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const stringifyObj = (obj) => {
  return JSON.stringify(obj).replace(/\\n/g, "\\n")
      .replace(/\\&/g, "\\&")
      .replace(/\\r/g, "\\r")
      .replace(/\\t/g, "\\t")
      .replace(/\\b/g, "\\b")
      .replace(/\\f/g, "\\f");
}

exports.stringifyObj = stringifyObj
exports.upload = upload;


