var pg = require('pg');
var myutil = require('./myutil');
var self;

module.exports = class organizer{
	constructor(){
		self=this;
	}

	getOrganizerListOld(callback, isDebug){
	  var retval = pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        var query='SELECT * FROM organizer';
 			if(!isDebug){
 				query = query + " where organizer_is_published='Yes'";
 			}
	    return client.query(query+' order by organizer_name', function(err, result) {
	      done();
	      if (err) { 
				console.error(err); response.send("Error " + err); 
			}
	      else{ 
				process.stdout.write("Inside getOrganizerList");
				var res = self.getOrganizerListJSON(result);
				process.stdout.write("returning:\n"+res);

	  			callback(res);
			}
	    });
	  });
	}

	getOrganizerList(callback, isDebug) {

		var query = 'SELECT * FROM organizer';
		if (!isDebug) {
			query = query + " where organizer_is_published='Yes'";
		}
		var ut = new myutil();
		const client = ut.getDBClient();

		console.log("Connecting to DB ->" + client);
		client.connect(cerr => {
			if (cerr) {
				console.log('connection error', cerr.stack);
				throw cerr;
			}
			console.log('**** connected');
			console.log("Query: " + query);
			client.query(query, (err, res) => {
				if (err) {
					throw err;
				}
				client.end();

				process.stdout.write("Inside getOrganizerList");
				var result = self.getOrganizerListJSON(res);
				process.stdout.write("returning:\n" + result);

				console.log("Calling callback: " + callback);
				callback(result);
			});

		});
	}



	getOrganizerListJSON(result){

		process.stdout.write("Inside getOrganizerListJSON");
		var ut = new myutil();
		var alist="";

		alist += "[";

		for(var i=0; i<result.rows.length; ++i){
			var r=result.rows[i];

			alist += "{\n";

			//Actual program object fields
			alist += ut.addFieldToJSON("organizer_id", r.organizer_id);
			alist += ut.addFieldToJSON("organizer_name", r.organizer_name);
			alist += ut.addFieldToJSON("organizer_desc", r.organizer_desc);
			alist += ut.addFieldToJSON("organizer_website", r.organizer_website);
			alist += ut.addFieldToJSON("organizer_email", r.organizer_email);
			alist += ut.addFieldToJSON("organizer_logo", r.organizer_logo);
			alist += ut.addFieldToJSON("organizer_phone", r.organizer_phone);
			alist += ut.addFieldToJSON("organizer_address1", r.organizer_address1);
			alist += ut.addFieldToJSON("organizer_address2", r.organizer_address2);
			alist += ut.addFieldToJSON("organizer_city", r.organizer_city);
			alist += ut.addFieldToJSON("organizer_state", r.organizer_state);
			alist += ut.addFieldToJSON("organizer_country", r.organizer_country);
			alist += ut.addFieldToJSON("organizer_pincode", r.organizer_pincode);
			alist += ut.addFieldToJSON("organizer_mapcoords", r.organizer_mapcoords);
			alist += ut.addFieldToJSON("organizer_is_published", r.organizer_is_published, true);

			alist += "}";
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
