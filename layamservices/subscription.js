var pg = require('pg');
var myutil = require('../servicehelper/myutil');
var self;

module.exports = class subscription{
	constructor(){
		self=this;
	}

	getLayamSubscriptionList(callback, isDebug){
	  var retval = pg.connect(process.env.DATABASE_URL, function(err, client, done) {
	    var query="SELECT * FROM layamsubscription where is_active='Yes'";
		  
	    return client.query(query, function(err, result) {
	      done();
	      if (err) { 
				console.error(err); response.send("Error " + err); 
			}
	      else{ 
				process.stdout.write("Inside getSubscriptionList");
				var res = self.getLayamSubscriptionListJSON(result);
				process.stdout.write("returning:\n"+res);

	  			callback(res);
			}
	    });
	  });
	}



	getLayamSubscriptionListJSON(result){

		process.stdout.write("Inside getVenueListJSON");
		var ut = new myutil();
		var alist="";

		alist += "[";

		for(var i=0; i<result.rows.length; ++i){
			var r=result.rows[i];

			alist += "{\n";

			//Actual program object fields
			alist += ut.addFieldToJSON("subscription_sku", r.subscription_sku);
			alist += ut.addFieldToJSON("is_active", r.is_active);
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
