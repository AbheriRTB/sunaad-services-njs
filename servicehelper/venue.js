var pg = require('pg');
var myutil = require('./myutil');
var self;

module.exports = class venue{
	constructor(){
		self=this;
	}

	getVenueList(callback, isDebug){
	  var retval = pg.connect(process.env.DATABASE_URL, function(err, client, done) {
	   	var query='SELECT * FROM venue';
		 	if(!isDebug){
		  		query = query + " where venue_is_published='Yes'";
		  }
	    return client.query(query +' order by venue_name', function(err, result) {
	      done();
	      if (err) { 
				console.error(err); response.send("Error " + err); 
			}
	      else{ 
				process.stdout.write("Inside getVenueList");
				var res = self.getVenueListJSON(result);
				process.stdout.write("returning:\n"+res);

	  			callback(res);
			}
	    });
	  });
	}



	getVenueListJSON(result){

		process.stdout.write("Inside getVenueListJSON");
		var ut = new myutil();
		var alist="";

		alist += "[";

		for(var i=0; i<result.rows.length; ++i){
			var r=result.rows[i];

			alist += "{\n";

			//Actual program object fields
			alist += ut.addFieldToJSON("venue_id", r.venue_id);
			alist += ut.addFieldToJSON("venue_name", r.venue_name);
			alist += ut.addFieldToJSON("venue_desc", r.venue_desc);
			alist += ut.addFieldToJSON("venue_image", r.venue_image);
			alist += ut.addFieldToJSON("venue_phone", r.venue_phone);
			alist += ut.addFieldToJSON("venue_email", r.venue_email);
			alist += ut.addFieldToJSON("venue_website", r.venue_website);
			alist += ut.addFieldToJSON("venue_address1", r.venue_address1);
			alist += ut.addFieldToJSON("venue_address2", r.venue_address2);
			alist += ut.addFieldToJSON("venue_city", r.venue_city);
			alist += ut.addFieldToJSON("venue_state", r.venue_state);
			alist += ut.addFieldToJSON("venue_country", r.venue_country);
			alist += ut.addFieldToJSON("venue_pincode", r.venue_pincode);
			alist += ut.addFieldToJSON("venue_mapcoords", r.venue_mapcoords);
			alist += ut.addFieldToJSON("venue_parking", r.venue_parking);
			alist += ut.addFieldToJSON("venue_eateries", r.venue_eateries);
			alist += ut.addFieldToJSON("venue_is_published", r.venue_is_published, true);

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
