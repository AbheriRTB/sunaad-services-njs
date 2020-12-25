var pg = require('pg');
var myutil = require('./myutil');
var self;

module.exports = class user{
	constructor(){
		self=this;
	}

	putUser(callback,input_data){
	 var sql = "INSERT INTO hssf_user (name, phone, email, address) values('" + input_data.name + "','" + input_data.contact_no + "','" + input_data.email +"','" + input_data.address + "') RETURNING *" ;
	  process.stdout.write(sql);
	  console.log(sql);
	  var retval = pg.connect(process.env.DATABASE_URL, function(err, client, done) {
	    return client.query(sql, function(err, result) {
	      done();
	      if (err) { 
				console.error(err); response.send("Error " + err); 
			}
	      else{ 
				process.stdout.write("Inside getUser");
				var res = self.getUserListJSON(result);
				process.stdout.write("returning:\n"+res + "\n");

	  			callback(res);
			}
	    });
	  });
	}



	getUserListJSON(result){

		process.stdout.write("Inside getVenueListJSON");
		var ut = new myutil();
		var alist="";

		alist += "[";

		for(var i=0; i<result.rows.length; ++i){
			var r=result.rows[i];

			alist += "{\n";

			//Actual program object fields
			alist += ut.addFieldToJSON("user_id", r.id);
			alist += ut.addFieldToJSON("user_name", r.name);
			alist += ut.addFieldToJSON("phone", r.phone);
			alist += ut.addFieldToJSON("email", r.email);
			alist += ut.addFieldToJSON("address", r.ddress,true)

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

	getuser(callback, regEmail){
	  var retval = pg.connect(process.env.DATABASE_URL, function(err, client, done) {
	    var sql = "SELECT * FROM hssf_user where email='" + regEmail+"'";
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
				var res = self.getUserListJSON(result);
				process.stdout.write("returning:\n"+res);

	  			callback(res);
			}
	    });
	  });
	}



	getUserListJSON(result){

		process.stdout.write("Inside getUserListJSON");
		var ut = new myutil();
		var alist="";

		alist += "[";

		for(var i=0; i<result.rows.length; ++i){
			var r=result.rows[i];

			alist += "{\n";

			//Actual program object fields
			alist += ut.addFieldToJSON("id", r.id);
			alist += ut.addFieldToJSON("name", r.name);
			alist += ut.addFieldToJSON("contact_no", r.phone);
			alist += ut.addFieldToJSON("email", r.email);
			alist += ut.addFieldToJSON("address", r.address, true)

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
