require("dotenv").config();
const express = require("express");
const compression = require("compression");
const bodyParser = require("body-parser");
const middlewares = require("./middlewares");
const port = process.env.PORT || 3001;
const request = require("request");
const cron = require("node-cron");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const axios = require("axios");
// const csrf = require("csurf");
// const session = require('express-session');
const client = require("./redis-client");
const oneHour = 3600000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 400
});

const api = require("./routes/api");
const users = require("./routes/users");

const server = express();

server.set('trust proxy', true)

// server.use(session({
//   secret: 'keyboardcat',
//   proxy: true,
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: true }
// }))

server.use(helmet());

server.use(limiter);

server.use(cookieParser());

server.use(middlewares.cors);

server.use(compression());

server.use(bodyParser.json({ limit: "50mb" }));
server.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

server.use("/users", users);

server.use("/api", api);

server.use(express.static("public",{ maxAge: oneHour }));

server.use(express.static("uploads"));

// server.post("/setNewApiToken", async (req, res) => {
//   console.log("update Token for Api");
//   try {
//     const token = Buffer.from(`${process.env.MASTERUSERNAME}:${process.env.MASTERPASSWORD}`, 'utf8').toString('base64')
//     console.log(token)
//     const axiosResp = await axios({
//       method: 'post',
//       url: ``,
//       headers: {
//         'Content-Type': 'application/json',
//         'Content-Length': 0,
//         'Authorization': `Basic ${token}`
//       },
//     }).catch(err => err);
//     let { data } = axiosResp;
//     console.log(data.response.token)
//
//     client.set("API_TOKEN", data.response.token, function (err) {
//       if (err) console.error(err);
//     });
//
//     return res.send({'message': 'ok'})
//
//   } catch (err) {
//     throw new Error(err);
//   }
//
// });

// server.get("/getApiToken", async (req, res) => {
//   const token = await client.get('API_TOKEN')
//   res.send({'token': token})
// });


server.listen(port, (err) => {
  console.log(`> Ready on 1 http://localhost:${port}`);

});

// request.post({
//   url: `http://localhost:${port}/setNewApiToken`,
// }, function(error, response, body){
//   if (!error && response.statusCode === 200) {
//     console.log("cron run");
//   }
// });
//
// cron.schedule("*/10 * * * *", () => {
//   request.post({
//     url: `http://localhost:${port}/setNewApiToken`,
//   }, function(error, response, body){
//     if (!error && response.statusCode === 200) {
//       console.log("cron run");
//     }
//   });
// });
