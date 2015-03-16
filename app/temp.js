var express = require('express');
var servr = express();

var o = require('../server/forms.json');
var d = require('../server/form.json');

var fs = require('fs');servr.disable('etag');
/*servr.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Last-Modified', (new Date()).toUTCString());
     res.setHeader('Cache-Control', 'public, max-age=31557600');
});*/

servr.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});



servr.get('/user/:id', function(req, res, next){
    next();
    res.json(d);
});
servr.get('/form/:id', function(req, res){
    res.json(d);
});

servr.post('/form/:id', function(req, res, next){
    next();
    console.log(req.body);
    /*fs.writeFile("server/forms.json", req.body, function(err) {
        if(err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });
*/
    var email = req.param('email', null);  // second parameter is default
});

module.exports = servr;