var cool = require('cool-ascii-faces');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var test = require('./test');
var prglist = require('./servicehelper/prglist');
var artistelist = require('./servicehelper/artistelist');
var organizer = require('./servicehelper/organizer');
var venue = require('./servicehelper/venue');
var settings = require('./servicehelper/settings');

var hssf_ngo = require('./servicehelper/hssf_ngo');
var hssf_user = require('./servicehelper/hssf_user');
var hssf_requirements = require('./servicehelper/hssf_requirements');
var hssf_category = require('./servicehelper/hssf_category');
var hssf_post = require('./servicehelper/hssf_post');
var hssf_volunteer = require('./servicehelper/volunteer');
var layam_user = require('./servicehelper/layam_user');

var layamsubscription = require('./layamservices/subscription');



var pg=require('pg');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

//service 'programs' which lists the programs in JSON format
app.get('/getProgramsOld', function (request, response) {
  process.stdout.write("Inside getPrograms");
  var pl = new prglist();
  pl.getProgramListOld(function(ret){
  		var retval = "" + ret;
  		process.stdout.write("******" + retval);

  		response.writeHead(200, {'Content-Type':'application/json'});
  		response.write(retval);
  		response.end();
  });
});

//service 'programs' which lists the programs in JSON format
app.get('/getPrograms', function (request, response) {
  process.stdout.write("Inside getPrograms");
  var debug = request.query.DEBUG;;
  if(debug != undefined){
  	  debug=true;
  }else{
     debug=false;
  }

  process.stdout.write("*** debug=" + debug);
  var pl = new prglist();
  pl.getProgramList(function(ret){
  		var retval = "" + ret;
  		process.stdout.write("******" + retval);

  		response.writeHead(200, {'Content-Type':'application/json'});
  		response.write(retval);
  		response.end();
  }, debug);
});


//service 'artiste' which lists the artistes in JSON format
app.get('/getArtiste', function (request, response) {
  process.stdout.write("Inside getArtiste");

  var debug = request.query.DEBUG;;
  if(debug != undefined){
  	  debug=true;
  }else{
     debug=false;
  }

  var al = new artistelist();
  al.getArtisteList(function(ret){
  		var retval = "" + ret;
  		process.stdout.write("******" + retval);


  		response.writeHead(200, {'Content-Type':'application/json'});
  		response.write(retval);
  		response.end();
  }, debug);
});

//service 'organizer' which lists the organizer in JSON format
app.get('/getOrganizer', function (request, response) {
  process.stdout.write("Inside getOrganizer");

  var debug = request.query.DEBUG;;
  if(debug != undefined){
  	  debug=true;
  }else{
     debug=false;
  }

  var org = new organizer();
  org.getOrganizerList(function(ret){
  		var retval = "" + ret;
  		process.stdout.write("******" + retval);


  		response.writeHead(200, {'Content-Type':'application/json'});
  		response.write(retval);
  		response.end();
  }, debug);
});

//service 'venue' which lists the venue in JSON format
app.get('/getVenue', function (request, response) {
  process.stdout.write("Inside getVenue");

  var debug = request.query.DEBUG;;
  if(debug != undefined){
  	  debug=true;
  }else{
     debug=false;
  }
  var org = new venue();
  org.getVenueList(function(ret){
  		var retval = "" + ret;
  		process.stdout.write("******" + retval);


  		response.writeHead(200, {'Content-Type':'application/json'});
  		response.write(retval);
  		response.end();
  }, debug);
});

app.get('/getIsArtisteModified', function (request, response) {
  process.stdout.write("Inside getIsArtisteModified");
  var timestamp = request.query.timestamp;;
  var set = new settings();
  set.getIsModified(function(ret){
  		var retval = "" + ret;
  		process.stdout.write("******" + retval);

  		response.writeHead(200, {'Content-Type':'application/json'});
  		response.write(retval);
  		response.end();
  }, "artiste_last_modified", timestamp);
});

app.get('/getIsOrganizerModified', function (request, response) {
  process.stdout.write("Inside getIsOrganizerModified");
  var timestamp = request.query.timestamp;;
  var set = new settings();
  set.getIsModified(function(ret){
  		var retval = "" + ret;
  		process.stdout.write("******" + retval);

  		response.writeHead(200, {'Content-Type':'application/json'});
  		response.write(retval);
  		response.end();
  }, "organizer_last_modified", timestamp);
});

app.get('/getIsVenueModified', function (request, response) {
  process.stdout.write("Inside getIsVenueModified");
  var timestamp = request.query.timestamp;;
  var set = new settings();
  set.getIsModified(function(ret){
  		var retval = "" + ret;
  		process.stdout.write("******" + retval);

  		response.writeHead(200, {'Content-Type':'application/json'});
  		response.write(retval);
  		response.end();
  }, "venue_last_modified", timestamp);
});

app.get('/getIsProgramModified', function (request, response) {
  process.stdout.write("Inside getIsProgramModified");
  var timestamp = request.query.timestamp;;
  var set = new settings();
  set.getIsModified(function(ret){
  		var retval = "" + ret;
  		process.stdout.write("******" + retval);

  		response.writeHead(200, {'Content-Type':'application/json'});
  		response.write(retval);
  		response.end();
  }, "program_last_modified", timestamp);
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//-------------------------- Layam Methods ----------------
//service '' which lists the venue in JSON format
app.get('/loginUser', function (request, response) {

  var useremail = request.query.email;
  var password = request.query.password;
  process.stdout.write("Inside loginUser");
  var layamuser = new layam_user();
  layamuser.loginUser(function(ret){
  		var retval = "" + ret;
  		process.stdout.write("******" + retval);
		if(retval == "[]\n"){
  			response.writeHead(404, {'Content-Type':'application/json'});
			response.write("User Not Found");
		}
		else{
  			response.writeHead(200, {'Content-Type':'application/json'});
  			response.write(retval);
		}
  		response.end();
  }, useremail, password);
});

app.get('/getSubscriptionTypes', function (request, response) {

  var useremail = request.query.email;
  var password = request.query.password;
  process.stdout.write("Inside getSubscriptionTypes");
  var layamuser = new layam_user();
  layamuser.getSubscriptionTypes(function(ret){
  		var retval = "" + ret;
  		process.stdout.write("******" + retval);
		if(retval == "[]\n"){
  			response.writeHead(404, {'Content-Type':'application/json'});
			response.write("No Subscription Options Available");
		}
		else{
  			response.writeHead(200, {'Content-Type':'application/json'});
  			response.write(retval);
		}
  		response.end();
  });
});


//add user post

app.post('/signupLayamUser', function (request, response) {
  var indata = request.body;
  process.stdout.write("Indata::");
  process.stdout.write("\nJSON:" + JSON.stringify(indata));

  var layamuser = new layam_user();
  layamuser.signupLayamUser(function(ret){
      var retval = "" + ret;
      process.stdout.write("******" + retval);

      response.writeHead(200, {'Content-Type':'application/json'});
      response.write(retval);
      response.end();
  }, indata);
});

//-------------------------- HSSF Methods ----------------
//service 'venue' which lists the venue in JSON format
app.post('/putNgo', function (request, response) {
  
  var indata = request.body
  process.stdout.write("Inside putNgo");
  process.stdout.write("\nJSON:" + JSON.stringify(indata));
  var ngo = indata;
  var outstr = "name" + ngo.name;
  process.stdout.write("name" + ngo.name);
  console.log(outstr)

  var org = new hssf_ngo();
  org.putNgo(function(ret){
  		var retval = "" + ret;
  		process.stdout.write("******" + retval);

  		response.writeHead(200, {'Content-Type':'application/json'});
  		response.write(retval);
  		response.end();
  }, indata);
});
app.post('/putUser', function (request, response) {
  var indata = request.body;
  console.log(indata);
  process.stdout.write("Inside putUser");
  process.stdout.write("\nJSON:" + JSON.stringify(indata));
  var user = indata;
  var outstr = "user name" + user.name;
  process.stdout.write("user name" + user.name);
  console.log(outstr)

  var org = new hssf_user();
  org.putUser(function(ret){
      var retval = "" + ret;
      process.stdout.write("******" + retval);

      response.writeHead(200, {'Content-Type':'application/json'});
      response.write(retval);
      response.end();
  }, indata);
});

//service 'ngo' which lists the venue in JSON format
app.get('/getCategory', function (request, response) {

  var catid = request.query.id;
  process.stdout.write("Inside getCategory");
  var category = new hssf_category();
  category.getCategory(function(ret){
  		var retval = "" + ret;
  		process.stdout.write("******" + retval);


  		response.writeHead(200, {'Content-Type':'application/json'});
  		response.write(retval);
  		response.end();
  }, catid);
});

//service 'ngo' which lists the venue in JSON format
app.get('/getNgo', function (request, response) {

  var regid = request.query.id;
  process.stdout.write("Inside getNgo");
  var org = new hssf_ngo();
  org.getNgo(function(ret){
  		var retval = "" + ret;
  		process.stdout.write("******" + retval);


  		response.writeHead(200, {'Content-Type':'application/json'});
  		response.write(retval);
  		response.end();
  }, regid);
});

//service 'ngo' which lists the venue in JSON format
app.get('/getNgoByRegistrationId', function (request, response) {

  var regid = request.query.registration_no;
  process.stdout.write("Inside getNgo");
  var org = new hssf_ngo();
  org.getNgoByRegistrationId(function(ret){
  		var retval = "" + ret;
  		process.stdout.write("******" + retval);


  		response.writeHead(200, {'Content-Type':'application/json'});
  		response.write(retval);
  		response.end();
  }, regid);
});

//get  user
app.get('/getUser', function (request, response) {

  var regEmail = request.query.email;
  process.stdout.write("Inside getuser");
  var org = new hssf_user();
  org.getuser(function(ret){
      var retval = "" + ret;
      process.stdout.write("******" + retval);


      response.writeHead(200, {'Content-Type':'application/json'});
      response.write(retval);
      response.end();
  }, regEmail);
});
//add user post

app.post('/addPost', function (request, response) {
  var indata = request.body;
  console.log(request.body);

  var org = new hssf_post();
  org.putPost(function(ret){
      var retval = "" + ret;
      process.stdout.write("******" + retval);

      response.writeHead(200, {'Content-Type':'application/json'});
      response.write(retval);
      response.end();
  }, indata);
});
app.get('/getPost', function (request, response) {

  var org = new hssf_post();
  org.getPost(function(ret){
      var retval = "" + ret;
      process.stdout.write("******" + retval);

      response.writeHead(200, {'Content-Type':'application/json'});
      response.write(retval);
      response.end();
  });
});
app.get('/getPostUser', function (request, response) {
  var user_id = request.query.user_id;
  var org = new hssf_post();
  org.getPostUser(function(ret){
      var retval = "" + ret;
      process.stdout.write("******" + retval);

      response.writeHead(200, {'Content-Type':'application/json'});
      response.write(retval);
      response.end();
  }, user_id);
});

//update post

app.post('/UpdatePost', function (request, response) {

  var indata = request.body;
  var org = new hssf_post();
  org.UpdatePost(function(ret){
      var retval = "" + ret;
      process.stdout.write("******" + retval);

      response.writeHead(200, {'Content-Type':'application/json'});
      response.write(retval);
      response.end();
  },indata,request);
});


//Ngo Requirements
app.post('/putNgoRequirements', function (request, response) {
  var indata = request.body;
  console.log(indata);
  process.stdout.write("Inside putNgorequirements");
  process.stdout.write("\nJSON:" + JSON.stringify(indata));
  var outstr = "ngo_id" + indata.ngo_id;
  console.log(outstr)

  var org = new hssf_requirements();
  org.putRequirements(function(ret){
      var retval = "" + ret;
      process.stdout.write("******" + retval);

      response.writeHead(200, {'Content-Type':'application/json'});
      response.write(retval);
      response.end();
  }, indata);
});


app.get('/getNgoRequirements', function (request, response) {

  var ngo_id = request.query.ngo_id;
  process.stdout.write("Inside getRequirements");
  var org = new hssf_requirements();
  org.getRequirements(function(ret){
      var retval = "" + ret;
      process.stdout.write("******" + retval);

      response.writeHead(200, {'Content-Type':'application/json'});
      response.write(retval);
      response.end();
  }, ngo_id);
});

app.get('/getNgoForCategory', function (request, response) {

  var category_id = request.query.category_id;
  process.stdout.write("Inside getRequirements");
  var org = new hssf_requirements();
  org.getNgoForCategory(function(ret){
      var retval = "" + ret;
      process.stdout.write("******" + retval);

      response.writeHead(200, {'Content-Type':'application/json'});
      response.write(retval);
      response.end();
  }, category_id);
});

//send mail
app.get('/sendMail', function (request, response) {
  var data = request.query;
  var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport('smtps://pointdroidtest@gmail.com:ad@san2015@smtp.gmail.com');

// setup e-mail data with unicode symbols
var mailOptions = {
    from: data.from, // sender address
    to: data.to, // list of receivers 
    subject: data.subject, // Subject line
    text: data.text, // plaintext body
    html: '<p>'+data.text+'</p>' // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
    response.writeHead(200, {'Content-Type':'application/json'});
      response.write("Mail send successfully");
      response.end();

});
  
});
//volunteer
app.get('/getvolunteer', function (request, response) {

  var reg_id = request.query.reg_id;
  process.stdout.write("Inside getuser");
  var org = new hssf_volunteer();
  org.getvolunteer(function(ret){
      var retval = "" + ret;
      process.stdout.write("******" + retval);


      response.writeHead(200, {'Content-Type':'application/json'});
      response.write(retval);
      response.end();
  }, reg_id);
});
//add user post

app.post('/addVolunteer', function (request, response) {
  var indata = request.body;
  console.log(indata);

  var org = new hssf_volunteer();
  org.putvolunteer(function(ret){
      var retval = "" + ret;
      process.stdout.write("******" + retval);

      response.writeHead(200, {'Content-Type':'application/json'});
      response.write(retval);
      response.end();
  }, indata);
});


//service 'subscription' which lists the subscription in JSON format
app.get('/getLayamSubscription', function (request, response) {
  process.stdout.write("Inside getLayamSubscription");

  var debug = request.query.DEBUG;;
  if(debug != undefined){
  	  debug=true;
  }else{
     debug=false;
  }
  var sub = new layamsubscription();
  sub.getLayamSubscriptionList(function(ret){
  		var retval = "" + ret;
  		process.stdout.write("******" + retval);


  		response.writeHead(200, {'Content-Type':'application/json'});
  		response.write(retval);
  		response.end();
  }, debug);
});


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
