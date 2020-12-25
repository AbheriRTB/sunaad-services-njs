var pg = require('pg');
var myutil = require('./myutil');
var self;

module.exports = class post{
	constructor(){
		self=this;
	}

	putPost(callback,input_data){
	 var sql = "INSERT INTO hssf_post ( user_id, category_id,description,is_active) values('" +input_data.user_id + "','" + input_data.category_id + "','" + input_data.description +"','1') RETURNING *" ;
	  process.stdout.write(sql);
	  var retval = pg.connect(process.env.DATABASE_URL, function(err, client, done) {
	    return client.query(sql, function(err, result) {
	      done();
	      if (err) {
				console.error(err); response.send("Error " + err); 
			}
	      else{ 
				process.stdout.write("Inside getUser");
				var res = self.getPostListJSON(result);
				process.stdout.write("returning:\n"+res + "\n");

	  			callback(res);
			}
	    });
	  });
	}



	getPostListJSON(result){

		process.stdout.write("Inside getVenueListJSON");
		var ut = new myutil();
		var alist="";

		alist += "[";

		for(var i=0; i<result.rows.length; ++i){
			var r=result.rows[i];

			alist += "{\n";

			//Actual program object fields
			alist += ut.addFieldToJSON("post_id", r.id);
			alist += ut.addFieldToJSON("user_id", r.user_id);
			alist += ut.addFieldToJSON("category_id", r.category_id);
			alist += ut.addFieldToJSON("desciption", r.description);
			alist += ut.addFieldToJSON("is_active", r.is_active,true)

			alist += "\n}";
			if(i<result.rows.length-1){
				alist += ",\n";
			}
		}
		alist += "]\n";

		process.stdout.write("PLIST:\n");
		process.stdout.write(alist);

		return alist;
	}

	getPost(callback){
	  var retval = pg.connect(process.env.DATABASE_URL, function(err, client, done) {
	    var sql = "SELECT * FROM hssf_post where is_active = true";
	    console.log(sql);
		 // if (reg_id != null && reg_id != "")
		 //    sql += ' where id=' + reg_id

	    return client.query(sql, function(err, result) {
	      done();
	      if (err) { 
				console.error(err); response.send("Error " + err); 
			}
	      else{ 
				process.stdout.write("Inside getuser");
				var res = self.getPostListJSON(result);
				process.stdout.write("returning:\n"+res);

	  			callback(res);
			}
	    });
	  });
	}

	getPostUser(callback, user_id){
	  var retval = pg.connect(process.env.DATABASE_URL, function(err, client, done) {
	    var sql = "SELECT * FROM hssf_post where user_id = "+user_id+" ";
	    console.log(sql);
		 // if (reg_id != null && reg_id != "")
		 //    sql += ' where id=' + reg_id

	    return client.query(sql, function(err, result) {
	      done();
	      if (err) { 
				console.error(err); response.send("Error " + err); 
			}
	      else{ 
				process.stdout.write("Inside getuser");
				var res = self.getPostListJSON(result);
				process.stdout.write("returning:\n"+res);

	  			callback(res);
			}
	    });
	  });
	}

	UpdatePost(callback,input_data,request){
	  var retval = pg.connect(process.env.DATABASE_URL, function(err, client, done) {
	    
	    var sql = "update hssf_post set is_active = '0' where id = "+input_data.post_id+" RETURNING *";
	    console.log(sql);
		 // if (reg_id != null && reg_id != "")
		 //    sql += ' where id=' + reg_id

	    return client.query(sql, function(err, result) {
	      done();
	      if (err) { 
				console.error(err); response.send("Error " + err); 
			}
	      else{ 
	      		console.log('here');
	      		console.log(result);

				var sql1 = "SELECT * from hssf_user where id = "+input_data.user_id;
	    		console.log(sql1);
	    		client.query(sql1, function(err, result1) {
			      done();
			      if (err) { 
						console.error(err); response.send("Error " + err); 
					}
			      else{ 
			      		var nodemailer = require('nodemailer');

						// create reusable transporter object using the default SMTP transport
						var transporter = nodemailer.createTransport('smtps://pointdroidtest@gmail.com:ad@san2015@smtp.gmail.com');

						// setup e-mail data with unicode symbols
						var mailOptions = {
						    from: 'Ngo@ngo.com', // sender address
						    to: result1.rows[0].email, // list of receivers 
						    subject:'Thank you for supporting ngo', // Subject line
						    text: 'Thank you for you support', // plaintext body
						    html: '<p>Thank you for you support </p>' // html body
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

			      }
			  });


				process.stdout.write("Inside getuser");
				var res = self.getPostListJSON(result);
				process.stdout.write("returning:\n"+res);

	  			callback(res);
			}
	    });
	  });
	}




	getPostListJSON(result){

		process.stdout.write("Inside getPostListJSON");
		var ut = new myutil();
		var alist="";

		alist += "[";

		for(var i=0; i<result.rows.length; ++i){
			var r=result.rows[i];

			alist += "{\n";

			//Actual program object fields
			alist += ut.addFieldToJSON("id", r.id);
			alist += ut.addFieldToJSON("user_id", r.user_id);
			alist += ut.addFieldToJSON("category_id", r.category_id);
			alist += ut.addFieldToJSON("description", r.description, true);

			alist += "\n}";
			if(i<result.rows.length-1){
				alist += ",\n";
			}
		}
		alist += "]\n";

		process.stdout.write("PLIST:\n");
		process.stdout.write(alist);

		return alist;
	}


};
