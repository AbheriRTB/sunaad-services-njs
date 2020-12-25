var pg = require('pg');
var myutil = require('./myutil');
var self;

module.exports = class organizer{
	constructor(){
		self=this;
	}

	putRequirements(callback, input_data){
	var sql = "INSERT INTO hssf_requirements (ngo_id, category_id, description, is_active, volunteer_id) values('" + input_data.ngo_id + "','" + input_data.category_id + "','" + input_data.description +"','" + input_data.is_active +"','" + input_data.volunteer_id + "') RETURNING *" ;
	  process.stdout.write(sql);
	  console.log(sql);
	  var retval = pg.connect(process.env.DATABASE_URL, function(err, client, done) {
	    return client.query(sql, function(err, result) {
	      done();
	      if (err) { 
				console.error(err); response.send("Error " + err); 
			}
	      else{ 
				process.stdout.write("Inside getRequirementsList");
				var res = self.getRequirementsListJSON(result);
				process.stdout.write("returning:\n"+res + "\n");

	  			callback(res);
			}
	    });
	  });
	}


	getRequirements(callback, ngo_id){
	  var retval = pg.connect(process.env.DATABASE_URL, function(err, client, done) {
	    var sql = 'SELECT * FROM hssf_requirements'
		 if (ngo_id != null && ngo_id != "")
		    sql += ' where ngo_id=' + ngo_id

	    return client.query(sql, function(err, result) {
	      done();
	      if (err) { 
				console.error(err); response.send("Error " + err); 
			}
	      else{ 
				process.stdout.write("Inside getRequirementsList");
				var res = self.getRequirementsListJSON(result);
				process.stdout.write("returning:\n"+res);

	  			callback(res);
			}
	    });
	  });
	}

	getNgoForCategory(callback, cat_id){
	  var retval = pg.connect(process.env.DATABASE_URL, function(err, client, done) {
	    var sql = 'SELECT b.id, b.name, b.description from hssf_requirements a, hssf_ngo b'
		 if (cat_id != null && cat_id != "")
		    sql += ' where a.category_id=' + cat_id

	    return client.query(sql, function(err, result) {
	      done();
	      if (err) { 
				console.error(err); response.send("Error " + err); 
			}
	      else{ 
				process.stdout.write("Inside getRequirementsList");
				var res = self.getNgoListJSON(result);
				process.stdout.write("returning:\n"+res);

	  			callback(res);
			}
	    });
	  });
	}



	getRequirementsListJSON(result){

		process.stdout.write("Inside getRequirementsListJSON");
		var ut = new myutil();
		var alist="";

		alist += "[";

		for(var i=0; i<result.rows.length; ++i){
			var r=result.rows[i];

			alist += "{\n";

			//Actual program object fields
			alist += ut.addFieldToJSON("id", r.id);
			alist += ut.addFieldToJSON("ngo_id", r.ngo_id);
			alist += ut.addFieldToJSON("category_id", r.category_id);
			alist += ut.addFieldToJSON("description", r.description);
			alist += ut.addFieldToJSON("is_active", r.is_active);
			alist += ut.addFieldToJSON("volunteer_id", r.volunteer_id, true);

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

	getNgoListJSON(result){

		process.stdout.write("Inside getNgoListJSON");
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
