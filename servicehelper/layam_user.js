var pg = require('pg');
var myutil = require('./myutil');
var self;

module.exports = class organizer{
	constructor(){
		self=this;
	}

	signupLayamUser(callback, input_data){
	var sql = "INSERT INTO layam_user (firstname, lastname, email, password, telephone, subscription) values('" + input_data.firstname + "','" + input_data.lastname + "','" + input_data.email +"','" + input_data.password +"','" + input_data.telephone +"','" + input_data.subscription + "') RETURNING *" ;

	  process.stdout.write(sql);
	  console.log(sql);
	  var retval = pg.connect(process.env.DATABASE_URL, function(err, client, done) {
	    return client.query(sql, function(err, result) {
	      done();
	      if (err || result.length < 1) { 
				console.error(err); 
				response.send("Error " + err); 
			}
	      else{ 
				process.stdout.write("Inside getLoginUserJSON");
				var res = self.getLoginUserJSON(result);
				process.stdout.write("returning:\n"+res + "\n");

	  			callback(res);
			}
	    });
	  });
	}


	loginUser(callback, useremail, password){
	  var retval = pg.connect(process.env.DATABASE_URL, function(err, client, done) {
	    var sql = 'SELECT * FROM layam_user a FULL OUTER JOIN layam_subscription b on b.subscription_id=a.subscription';

		 if (useremail != null && useremail != "")
		    sql += " where a.email='" + useremail + "'";
		 if (password != null && password != "")
		    sql += " and a.password='" + password + "'";

		process.stdout.write("SQL:\n"+sql);

	    return client.query(sql, function(err, result) {
	      done();
	      if (err) { 
				console.error(err); response.send("Error " + err); 
			}
	      else{ 
				process.stdout.write("Inside loginUser");
				var res = self.getLoginUserJSON(result);
				process.stdout.write("returning:\n"+res);

	  			callback(res);
			}
	    });
	  });
	}


	getSubscriptionTypes(callback){
	  var retval = pg.connect(process.env.DATABASE_URL, function(err, client, done) {
	    var sql = "SELECT * FROM layam_subscription where is_active='true'";

		process.stdout.write("SQL:\n"+sql);

	    return client.query(sql, function(err, result) {
	      done();
	      if (err) { 
				console.error(err); response.send("Error " + err); 
			}
	      else{ 
				process.stdout.write("Inside loginUser");
				var res = self.getSubscriptionTypeJSON(result);
				process.stdout.write("returning:\n"+res);

	  			callback(res);
			}
	    });
	  });
	}


	getLoginUserJSON(result){

		process.stdout.write("Inside getLoginUserJSON");
		var ut = new myutil();
		var alist="";

		alist += "[";

		for(var i=0; i<result.rows.length; ++i){
			var r=result.rows[i];

			alist += "{\n";

			//Actual program object fields
			alist += ut.addFieldToJSON("id", r.id);
			alist += ut.addFieldToJSON("firstname", r.firstname);
			alist += ut.addFieldToJSON("lastname", r.lastname);
			alist += ut.addFieldToJSON("email", r.email);
			alist += ut.addFieldToJSON("telephone", r.telephone);
			alist += ut.addFieldToJSON("subscription_id", r.subscription_id);
			alist += ut.addFieldToJSON("subscription_type", r.subscription_type);
			alist += ut.addFieldToJSON("duration", r.duration);
			alist += ut.addFieldToJSON("rate", r.rate);
			alist += ut.addFieldToJSON("type_start_date", r.type_start_date, true);

			alist += "\n}";
			if(i<result.rows.length-1){
				alist += ",\n";
			}
		}
		alist += "]\n";

		process.stdout.write("LoginUser:\n");
		process.stdout.write(alist);

		return alist;
	}

	getSubscriptionTypeJSON(result){

		process.stdout.write("Inside getSubscriptionTypeJSON");
		var ut = new myutil();
		var alist="";

		alist += "[";

		for(var i=0; i<result.rows.length; ++i){
			var r=result.rows[i];

			alist += "{\n";

			//Actual program object fields
			alist += ut.addFieldToJSON("subscription_id", r.subscription_id);
			alist += ut.addFieldToJSON("subscription_type", r.subscription_type);
			alist += ut.addFieldToJSON("duration", r.duration);
			alist += ut.addFieldToJSON("rate", r.rate);
			alist += ut.addFieldToJSON("type_start_date", r.type_start_date, true);

			alist += "\n}";
			if(i<result.rows.length-1){
				alist += ",\n";
			}
		}
		alist += "]\n";

		process.stdout.write("SubscriptionTypes:\n");
		process.stdout.write(alist);

		return alist;
	}


};
