require("dotenv").config();
const Express = require("express");
const server = Express.Router();
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { stringifyObj } = require("../helpers/helpers");
const client = require("../redis-client")

server.post("/login", async (req, res) => {

  try {

    console.log("/login")
    // const token = await client.get('API_TOKEN')

    // let user = {
    //   username: req.body.username,
    //   password: req.body.password
    // }

    // const config = {
    //   method: 'post',
    //   url: ``,
    //   headers: {
    //     'Authorization': `Bearer ${token}`,
    //     'Content-Type': 'application/json',
    //     'Content-Length': 0,
    //   },
    //   data: {
    //     "fieldData": {
    //       "call": "authenticateUser",
    //       "payload": stringifyObj(user)
    //     },
    //     "script": "post"
    //   }
    // };

      // const axiosResp = await axios(config).catch(err => err);
      // let { data } = axiosResp;
      //
      // console.log(JSON.parse(data.response.scriptResult))

    let user = {
      username: req.body.username,
      password: req.body.password
    }

     let error = false

      if( user.username !== 'test' || user.password !== 'test123'  ){
        error = true
      }

      if(error){
        res.status(500);
        res.send(err.message);
      }

      const jwtToken = jwt.sign({privileges: 'admin', username: 'test'}, process.env.TOKEN);
      return res.send({ privileges: 'admin', username: 'test', user: 'authenticated', token: jwtToken });

  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
});

server.post("/authenticateUser", async (req, res) => {
  try {
    let token = null;

    console.log("/authenticateUser")
    if (req && req.headers.cookie) {
      token = req.headers.cookie.replace(
          /(?:(?:^|.*;\s*)VERITYTOKEN\s*\=\s*([^;]*).*$)|^.*$/,
          "$1"
      );
    }

    if (!token) {
      return res.send({ user: "no-authenticated"});
    }

    try {
      
      const data = jwt.verify(token, process.env.TOKEN);
      console.log(data)
      const {username: username, privileges: privileges} = data

      if(username && privileges) return res.send({ user: "authenticated", username: username, privileges: privileges });

      console.log('end')
      return res.send({ user: "no-authenticated"});

    } catch (err) {
      return res.send({ user: "no-authenticated"});
    }
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
});

module.exports = server;
