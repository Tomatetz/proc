var express = require('express');
var servr = express();

var fs = require('fs');
var o = require('../server/forms.json');
var d = require('../server/form.json');

servr.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Last-Modified', (new Date()).toUTCString());
    res.setHeader('Cache-Control', 'public, max-age=31557600');
    next();
});

servr.get('/user/:id', function(req, res, next){
    next();
    res.json(d);
});
servr.get('/form/:id', function(req, res, next){
    next();
    res.json(d);
});
module.exports = servr;