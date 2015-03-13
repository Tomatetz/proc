var express = require('express');
var servr = express();

var o = require('../server/forms.json');
var d = require('../server/form.json');

var fs = require('fs');servr.disable('etag');
servr.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    /*res.setHeader('Last-Modified', (new Date()).toUTCString());
    res.setHeader('Cache-Control', 'public, max-age=31557600');*/
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
    console.log(res);
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