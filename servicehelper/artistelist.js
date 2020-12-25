var pg = require('pg');
var myutil = require('./myutil');
var self;

module.exports = class artistelist{
	constructor(){
		self=this;
	}

	getArtisteList(callback, isDebug){
	  var retval = pg.connect(process.env.DATABASE_URL, function(err, client, done) {
	    var query='SELECT * FROM artiste_view';
		 if(!isDebug){
		    query = query + " where artiste_is_published='Yes'";
		 }
	    return client.query(query, function(err, result) {
	      done();
	      if (err) { 
				console.error(err); response.send("Error " + err); 
			}
	      else{ 
				process.stdout.write("Inside getAristeList");
				var res = self.getAristeListJSON(result);
				process.stdout.write("returning:\n"+res);

	  			callback(res);
			}
	    });
	  });
	}



	getAristeListJSON(result){

		process.stdout.write("Inside getAristeListJSON");
		var ut = new myutil();
		var alist="";

		alist += "[";

		for(var i=0; i<result.rows.length; ++i){
			var r=result.rows[i];

			alist += "{\n";

			//Actual program object fields
			alist += ut.addFieldToJSON("artiste_id", r.artiste_id);
			alist += ut.addFieldToJSON("artiste_name", r.artiste_name);
			alist += ut.addFieldToJSON("artiste_desc", r.artiste_desc);
			alist += ut.addFieldToJSON("artiste_phone", r.artiste_phone);
			alist += ut.addFieldToJSON("artiste_website", r.artiste_website);
			alist += ut.addFieldToJSON("art_type", r.art_type);
			alist += ut.addFieldToJSON("audio_clip", r.audio_clip);
			alist += ut.addFieldToJSON("artiste_instrument", r.artiste_instrument);
			alist += ut.addFieldToJSON("artiste_address1", r.artiste_address1);
			alist += ut.addFieldToJSON("artiste_address2", r.artiste_address2);
			alist += ut.addFieldToJSON("artiste_city", r.artiste_city);
			alist += ut.addFieldToJSON("artiste_state", r.artiste_state);
			alist += ut.addFieldToJSON("artiste_country", r.artiste_country);
			alist += ut.addFieldToJSON("artiste_pincode", r.artiste_pincode);
			alist += ut.addFieldToJSON("artiste_mapcoords", r.artiste_mapcoords);
			alist += ut.addFieldToJSON("artiste_image", r.artiste_image);
			alist += ut.addFieldToJSON("artiste_gender", r.artiste_gender);
			alist += ut.addFieldToJSON("artiste_email", r.artiste_email);
			alist += ut.addFieldToJSON("artiste_dob", r.artiste_dob);
			alist += ut.addFieldToJSON("artiste_is_published", r.artiste_is_published, 'true');


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

