var nodemailer = require('nodemailer');
var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var request = require('request');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var StockAPI = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22SAP%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=";


request(StockAPI, function (error, response, stockBody) {
      if (!error && response.statusCode == 200) {
        var data = JSON.parse(stockBody);
        var usdShare = data['query']['results']['quote']['Ask'];
        var exchangeAPI = "http://api.fixer.io/latest?base=USD";
        //this is like the worst hack ever
        request(exchangeAPI, function (error, response, currencyBody) {
            if (!error && response.statusCode == 200) {
                var data = JSON.parse(currencyBody);
                var eurValue = data['rates']['EUR'];
                var value = usdShare * eurValue;
                //bad code, thanks async 
                var text = "SAP share price: "+value+" EUR";
                console.log(text);

                //had to nest
                if(value > 95){

                var transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: 'youremail@gmail.com', // Your email id
                        pass: 'yourpassword' // Your password
                    }
                });

                var mailOptions = {
                    from: 'from@gmail.com',
                    to: 'to@gmail.com',
                    subject: 'Email Example',     
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
      }
});



   
    


