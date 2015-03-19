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
var bodyParser = require('body-parser');
servr.use( bodyParser.json() );       // to support JSON-encoded bodies

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
    res.json(o);
});

servr.post('/form/:id', function(req, res){

    var z = require('../server/forms.json');
    var temp = z;

    var isNew = true;
    if(req.body.action && req.body.action == 'delete'){
        temp.forms.each( function(form, i){
            if(form.name == req.body.name){
                temp.forms.splice(i, 1);
            }
        });
    } else {
        temp.forms.each( function(form){
            if(form.name == req.body.name){
                form.form = req.body.form
                isNew = false
            }
            //console.log(form.name, req.body.name);
        });
        if(isNew){
            temp.forms.push({
                name: req.body.name,
                form: req.body.form
            });
        }
    }

    res.json(req.body);
    fs.writeFile("server/forms.json", JSON.stringify(temp), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
});


servr.post('/saveData', function(req, res){
    console.log(req.body);
    res.json(req.headers);

});

module.exports = servr;