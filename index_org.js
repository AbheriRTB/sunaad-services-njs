var cool = require('cool-ascii-faces');
var express = require('express');
var app = express();
var test = require('./test');
var prglist = require('./servicehelper/prglist');


var pg=require('pg');

app.get('/db', function (request, response) {
  process.stdout.write("Inside db");
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM program', function(err, result) {
      done();
      if (err) { 
			console.error(err); response.send("Error " + err); 
		}
      else{ 
			response.render('pages/program', {results: result.rows} ); 
		}
    });
  });
});

app.get('/programs1', function (request, response) {
  process.stdout.write("Inside db");
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM program', function(err, result) {
      done();
      if (err) { 
			console.error(err); response.send("Error " + err); 
		}
      else{ 
			var pl = new prglist();
		}
    });
  });
});

app.get('/programs', function (request, response) {
  process.stdout.write("Inside db");
  var pl = new prglist();
  pl.getProgramList(function(ret){
  		var retval = "" + ret;
  		process.stdout.write("******" + retval);


  		response.writeHead(200, {'Content-Type':'application/json'});
  		response.write(retval);
  		response.end();
  });
});

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index')
});

app.get('/cool', function(request, response) {
  response.send(cool());
});

app.get('/test', function(request, response) {
  var t = new test();
  response.send(t.TestSvc1());
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

app.get('/times', function(request, response) {
    var result = ''
    var times = process.env.TIMES || 5
    for (i=0; i < times; i++)
      result += i + ' ';
  response.send(result);
});
