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
var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost/test');

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function callback () {
    console.log("Connected!")
});
var UserSchema = new mongoose.Schema( {
    name: { type: String, index: true },
    creation_date: { type: Date },
    form: [{
        "fieldType":{ type: String },
        "fieldName":{ type: String },
        "fieldSize":{ type: String },
        "fieldOptions":[]
    }]
} );
var DataSchema = new mongoose.Schema( {
    name: { type: String, index: true },
    timestamp: {  type: String },
    data: [{
        name: { type: String },
        value: { type: String }
    }]
} );



UserSchema.methods.speak = function () {

}

var Forms = db.model("Forms",UserSchema);
var FieldsData = db.model("FieldsData",DataSchema);

//FieldsData.remove({}).exec();

//Forms.remove({name: 'Alice'}).exec();

Forms.find(/*{name: 'Alice'},*/ function (err, users) {
});

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
    Forms.find( function (err, users) {
        res.json({'forms':users})
    })
    //res.json(o);
});

servr.post('/form/:id', function(req, res){
    var z = require('../server/forms.json');
    var temp = z;

    var isNew = true;


    var newForm = new Forms(req.body);

    if(req.body.action && req.body.action == 'delete'){

        temp.forms.each( function(form, i){
            if(form.name == req.body.name){
                temp.forms.splice(i, 1);
            }
        });
        Forms.remove({name: req.body.name}).exec();

        Forms.find(function (err, users) {
            console.log(users)
        })
    } else {
        temp.forms.each( function(form){
            if(form.name == req.body.name){
                form.form = req.body.form
                isNew = false
                Forms.remove({name: req.body.name}).exec();
            }
            //console.log(form.name, req.body.name);
        });
        if(isNew){
            temp.forms.push({
                name: req.body.name,
                form: req.body.form
            });
        }

        newForm.save(function (err, newUser) {
            if (err){
                console.log("Something goes wrong with user " + newUser.name);
            }else{
                Forms.find(function (err, users) {
                    console.log(users)
                })
            }
        });
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

    var newData = new FieldsData(req.body);
    newData.save(function (err, newBlank) {
        if (err){
            console.log("Something goes wrong with user " + newBlank.name);
        }else{
            FieldsData.find(function (err, users) {
                console.log(users)
            })
        }
    });
    res.json(req.headers);

});

module.exports = servr;