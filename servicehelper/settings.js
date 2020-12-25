var pg = require('pg');
var myutil = require('./myutil');
var self;

module.exports = class settings{
	constructor(){
		self=this;
	}

	getIsModified(callback, field, timestamp){
	  var retval = pg.connect(process.env.DATABASE_URL, function(err, client, done) {
	    process.stdout.write("Executing: SELECT * FROM settings where " + field + " >'"+timestamp+"'");
	    return client.query("SELECT * FROM settings where " + field + " >'"+timestamp+"'", function(err, result) {
	      done();
	      if (err) { 
				console.error(err); response.send("Error " + err); 
			}
	      else{ 
				process.stdout.write("Inside getIsModifed\n");
				var res = self.isTableModified(result);
				process.stdout.write("returning:\n"+res);

	  			callback(res);
			}
	    });
	  });
	}



	isTableModified(result){

		process.stdout.write("Inside isTableModified\n");
		var ut = new myutil();
		var retval="";

		if(result.rows.length > 0){
		  retval = "{\"isModified\":\"true\"}";
		}else{
		  retval = "{\"isModified\":\"false\"}";
		}

		process.stdout.write(retval);

		return retval;
	}

};
