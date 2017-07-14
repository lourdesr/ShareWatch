var nodemailer = require('nodemailer');
var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var request = require('request');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var StockAPI = "http://finance.google.com/finance/info?client=ig&q=ETR:sap";


request(StockAPI, function (error, response, stockBody) {
      if (!error && response.statusCode == 200) {
        console.log(stockBody);
        var data = stockBody.split('\n');
        var lineOfConcern = data[6].split(":");
        var shareValue = lineOfConcern[1].replace(/["]/g, "");
        var text = "SAP Share Price : EUR" + shareValue;
        if (shareValue > 95) {
          var transporter = nodemailer.createTransport({
              service: 'Gmail',
              auth: {
                  user: 'youremail@gmail.com', // Your email id
                  pass: 'yourpassword' // Your password
              }
          });
          var mailOptions = {
              from: 'youremail@gmail.com',
              to: 'youremail@gmail.com',
              subject: 'SAP Share Price',
              text: text
          };

          transporter.sendMail(mailOptions, function(error, info){
              if(error){
                  console.log(error);

              }else{
                  console.log('Message sent: ' + info.response);

              };
          });
        }
      }
});
