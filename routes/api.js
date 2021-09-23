require("dotenv").config();
const Express = require("express");
const server = Express.Router();
const axios = require("axios");
const middlewares = require("../middlewares");
const client = require("../redis-client")
const { stringifyObj } = require("../helpers/helpers");

server.post("/list-expenses-items",middlewares.auth, async (req, res) => {

  try {

    const token = await client.get('API_TOKEN')

    let payload = {
      "payrollitemid": req.body.payrollID,
      username: req.body.username
    }

    const config = {
      method: 'post',
      url: `https://${process.env.SERVER}/fmi/data/${process.env.VERSION}/databases/${process.env.DATABASE}/layouts/${process.env.LAYOUT}/records`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': 0,
      },
      data: {
        "fieldData": {
          "call": "listExpenseItems",
          "payload": stringifyObj(payload)
        },
        "script": "post"
      }
    };

    const axiosResp = await axios(config).catch(err => err);
    let { data } = axiosResp;
    let {error} = JSON.parse(data.response.scriptResult)

    if(error){
      res.status(500);
      res.send(err.message);
    }


    return res.send(JSON.parse(data.response));

  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
});


module.exports = server;
