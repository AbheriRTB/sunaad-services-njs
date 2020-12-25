var pg = require('pg');
var myutil = require('./myutil');
var self;

module.exports = class organizer{
	constructor(){
		self=this;
	}

/*
	putCategory(callback, input_data){
	var sql = "INSERT INTO hssf_ngo (name, contact_no, email, registration_no, address) values('" + input_data.name + "','" + input_data.contactno + "','" + input_data.email +"','" + input_data.registration_id +"','" + input_data.address + "') RETURNING *" ;
	  process.stdout.write(sql);
	  console.log(sql);
	  var retval = pg.connect(process.env.DATABASE_URL, function(err, client, done) {
	    return client.query(sql, function(err, result) {
	      done();
	      if (err) { 
				console.error(err); response.send("Error " + err); 
			}
	      else{ 
				process.stdout.write("Inside getCategoryList");
				var res = self.getCategoryListJSON(result);
				process.stdout.write("returning:\n"+res + "\n");

	  			callback(res);
			}
	    });
	  });
	}
*/


	getCategory(callback, cat_id){
	  var retval = pg.connect(process.env.DATABASE_URL, function(err, client, done) {
	    var sql = 'SELECT * FROM hssf_category'
		 if (cat_id != null && cat_id != "")
		    sql += ' where id=' + cat_id

	    return client.query(sql, function(err, result) {
	      done();
	      if (err) { 
				console.error(err); response.send("Error " + err); 
			}
	      else{ 
				process.stdout.write("Inside getCategoryList");
				var res = self.getCategoryListJSON(result);
				process.stdout.write("returning:\n"+res);

	  			callback(res);
			}
	    });
	  });
	}



	getCategoryListJSON(result){

		process.stdout.write("Inside getCategoryListJSON");
		var ut = new myutil();
		var alist="";

		alist += "[";

		for(var i=0; i<result.rows.length; ++i){
			var r=result.rows[i];

			alist += "{\n";

			//Actual program object fields
			alist += ut.addFieldToJSON("id", r.id);
			alist += ut.addFieldToJSON("name", r.name);
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
