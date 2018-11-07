var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs');
var db = mongojs('customerapp', ['users']);
var ObjectId = mongojs.ObjectId;

var app = express();

//View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Set Static Path
app.use(express.static(path.join(__dirname, 'public'))); // Static resources

//Global Vars
app.use(function(req,res,next){
    res.locals.errors = null;
    next();
});

//Express Validator Middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root = namespace.shift()
        , formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));
//Route Handler
app.get('/', function(req,res){
    db.users.find(function (err, docs) {
        // docs is an array of all the documents in mycollection
        //console.log(docs);
        res.render('index', {
            title: 'Customers',
            users: docs
        });
    })

});

// add new user to mongoDB
app.post('/users/add', function(req,res){
    req.checkBody('first_name', 'First Name is Required').notEmpty();
    req.checkBody('last_name', 'Last Name is Required').notEmpty();
    req.checkBody('email', 'Email is Required').notEmpty();

    var errors = req.validationErrors();

    if(errors){
        db.users.find(function (err, docs) {
            // docs is an array of all the documents in mycollection
            //console.log(docs);
            res.render('index', {
                title: 'Customers',
                users: docs,
                errors: errors
            });
        })
    } else {
        var newUser = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
        }
        //console.log('SUCCESS');
        db.users.insert(newUser, function(err,result){
            if(err){
                console.log(err);
            }
            res.redirect('/');
        });
    }
    console.log(newUser);
});
// delete user from mongoDB
app.delete('/users/delete/:id', function(req,res){
    db.users.remove({_id: ObjectId(req.params.id)},function(err, result){
        if(err) {
            console.log(err);
        }
        res.redirect('/');
    });
});
// retieve single user from mongoDB
app.get('/users/get/:id', function(req,res){
    db.users.find({_id: ObjectId(req.params.id)},function(err, data){
        if(err) {
            console.log(err);
        }
        res.send(data);
    });
});

// update user in mongoDB
app.put('/users/update', function(req,res){
    req.checkBody('first_name', 'First Name is Required').notEmpty();
    req.checkBody('last_name', 'Last Name is Required').notEmpty();
    req.checkBody('email', 'Email is Required').notEmpty();
    
    var errors = req.validationErrors();

    if(errors){
        db.users.find(function (err, docs) {
            // docs is an array of all the documents in mycollection
            //console.log(docs);
            res.render('index', {
                title: 'Customers',
                users: docs,
                errors: errors + err
            });
        })
    } else {
        var updateUser = {
            first_name: req.params.first_name,
            last_name: req.params.last_name,
            email: req.params.email
        }
        db.users.find({_id: ObjectId(req.params.id)},function(err, data){
            if(err) {
                console.log("_ID not found: "+err);
            } else {
                console.log('User Found');
                // db.users.findAndModify(
                //     {_id: ObjectId(req.params.id)},
                //     {$set:updateUser},
                //     {new: true},
                //     function(err,data){
                //         if(err) {
                //             console.log(err);
                //         } else {
                //             console.log(data);
                //         }
                //     }
                // );     
            }
            //res.redirect('/'); 
            //res.send(data);
        });
    }
})
// app.post('/users/update/', function(req,res){
//     console.log('update!');
//     // db.users.findAndModify({
//     //   query: {_id: ObjectId(req.params.id)},
//     //   update: {$set: {
//     //     first_name: req.params.first_name,
//     //     last_name: req.params.last_name,
//     //     email: req.params.email
//     //   }} 
//     // }, function(err,doc,lastErrorObject) {
//     //     if(err) {
//     //         console.log(err);
//     //     }
//     //     res.redirect('/');
//     // })
// });

app.listen(3000, function(){
    console.log('Server Started on Port: 3000...');
});

