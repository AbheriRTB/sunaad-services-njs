var pg = require('pg');
var myutil = require('./myutil');
var self;

module.exports = class volunteer{
	constructor(){
		self=this;
	}

	putvolunteer(callback,input_data){
	 var sql = "INSERT INTO hssf_volunteer (user_id, requirement_id) values('" + input_data.user_id + "','" + input_data.requirement_id + "') RETURNING *" ;
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
				var res = self.getvolunteerListJSON(result);
				process.stdout.write("returning:\n"+res + "\n");

	  			callback(res);
			}
	    });
	  });
	}



	getvolunteerListJSON(result){

		process.stdout.write("Inside getVenueListJSON");
		var ut = new myutil();
		var alist="";

		alist += "[";

		for(var i=0; i<result.rows.length; ++i){
			var r=result.rows[i];

			alist += "{\n";

			//Actual program object fields
			alist += ut.addFieldToJSON("volunteer_id", r.id);
			alist += ut.addFieldToJSON("user_id", r.name);
			alist += ut.addFieldToJSON("requirement_id", r.phone)

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

	getvolunteer(callback, reg_id){
	  var retval = pg.connect(process.env.DATABASE_URL, function(err, client, done) {
	    var sql = "SELECT hu.name as user_name, hu.id as user_id FROM hssf_user hu left outer join hssf_volunteer hv on hv.user_id = hu.id where hv.user_id ='" + reg_id+"'";
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
				var res = self.getvolunteerList(result);
				process.stdout.write("returning:\n"+res);

	  			callback(res);
			}
	    });
	  });
	}



	getvolunteerList(result){

		process.stdout.write("Inside getUserListJSON");
		var ut = new myutil();
		var alist="";

		alist += "[";

		for(var i=0; i<result.rows.length; ++i){
			var r=result.rows[i];

			alist += "{\n";

			//Actual program object fields
			alist += ut.addFieldToJSON("user_id", user_id);
			alist += ut.addFieldToJSON("user_name", r.user_name, true)

			alist += "\n}"
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
