var databaseURL = "mydb";
var collections = ["test", "testdata"];
var db = require('mongojs').connect(databaseURL, collections);

/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

app.use(express.cookieParser('mumble'));
app.use(express.cookieSession({key: 'tracking'}));
app.use(express.directory(__dirname + '/public'));

app.use(function(req, res, next) {
    throw new Error(req.url + ' not found');
});
app.use(function(err, req, res, next) {
    console.log(err);
    res.send(err.message);
});

app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler({dumpExceptions:true, showStack:true}));
}

//app.get('/', routes.index);

// for GET requests
app.get('/', function(req, res) {
    //res.send('Username: ' + req.query['username']);
    res.send('You sent: ' + req.query);
    //console.log(req.query);

    //store query right into Mongo...
    db.test.save( req.query, function(err, saved) {
	if(err || !saved)
	    console.log("error!");
	else
	    console.log("saved input");
    });
});


// for POST requests
app.post('/', function(req, res) {
    res.send('You sent via POST'+ req.body);
    console.log(req.body);
    
    //store query right into Mongo...
    
      db.test.save( req.body, function(err, saved) {
	if(err || !saved)
	    console.log("error!");
	else
	    console.log("saved input");
    });

});


app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
