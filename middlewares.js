require("dotenv").config();
const cors = require("cors");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  let token = null;

  if (req && req.headers.cookie) {
    token = req.headers.cookie.replace(
      /(?:(?:^|.*;\s*)IYCtoken\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
  }

  if (!token) {
    return res
      .status(401)
      .send({ error: "Not authorized to access this resource" });
  }

  try {
    const data = jwt.verify(token, process.env.TOKEN);

    console.log('Authenticate User middleware')
    console.log(data);
    if(data.userid && data.privileges){
      next();
    }
    
  } catch (err) {
    return res
      .status(401)
      .send({ error: "Not authorized to access this resource" });
  }
};

module.exports = {
  cors: cors({ credentials: true, origin: process.env.FRONT_URL}),
  auth: auth,
};
