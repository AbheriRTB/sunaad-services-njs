var myutil = require('./myutil');
var self;
const { response } = require('express');

module.exports = class prglist {
	constructor() {
		console.log("in getPrograms Constructor");
		self = this;
	}

	getProgramListOld(callback) {
		var retval = pg.connect(process.env.DATABASE_URL, function (err, client, done) {
			var query = 'SELECT * FROM program_view';
			return client.query(query, function (err, result) {
				done();
				if (err) {
					console.error(err);
					response.send("Error " + err);
				}
				else {
					process.stdout.write("Inside getProgramList");
					console.log("Inside getProgramList");
					var res = self.getProgramListJSON(result);
					process.stdout.write("returning:\n" + res);

					callback(res);
				}
			});
		});
	}

	getProgramList1(callback, isDebug) {
		console.log("Trying Connection : " + process.env.DATABASE_URL);
		var retval = pg.connect(process.env.DATABASE_URL, function (err, client, done) {
			var query = 'SELECT * FROM program_view';
			console.log("Connection done: " + process.env.DATABASE_URL);
			if (!isDebug) {
				query = query + " where event_date_org > (now() - '5 day'::INTERVAL)";
			}
			return client.query(query, function (err, result) {
				done();
				if (err) {
					console.log("error connecting to DB");
					console.error(err); response.send("Error " + err);
				}
				else {
					process.stdout.write("Inside getProgramList");
					var res = self.getProgramListJSON(result);
					process.stdout.write("returning:\n" + res);

					callback(res);
				}
			});
		});
	}

	getProgramList(callback, isDebug) {
		//console.log("Trying Connection : " + process.env.DATABASE_URL);
		var query = 'SELECT * FROM program_view';
		if (!isDebug) {
			query = query + " where event_date_org > (now() - '5 day'::INTERVAL)";
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

				//console.log("got Result:" + res);
				process.stdout.write("Inside getProgramList");
				var result = self.getProgramListJSON(res);
				//process.stdout.write("returning:\n" + result);

				console.log("Calling callback: " + callback);
				callback(result);
			});

		});
	}


	getProgramListJSON(result) {

		console.log("Inside getProgramListJSON");
		process.stdout.write("Inside getProgramListJSON");
		var ut = new myutil();
		var plist = "";

		plist += "[";

		for (var i = 0; i < result.rows.length; ++i) {
			var r = result.rows[i];

			plist += "{\n";

			//Actual program object fields
			plist += ut.addFieldToJSON("id", r.id);
			plist += ut.addFieldToJSON("title", r.title);
			plist += ut.addFieldToJSON("art_type", r.art_type);
			plist += ut.addFieldToJSON("event_type", r.event_type);
			plist += ut.addFieldToJSON("description", r.description);
			plist += ut.addFieldToJSON("entry_fee", r.entry_fee);
			plist += ut.addFieldToJSON("organizer_website", r.organizer_website);
			plist += ut.addFieldToJSON("event_date", r.event_date);
			plist += ut.addFieldToJSON("venue_name", r.venue_name);
			plist += ut.addFieldToJSON("organizer_name", r.organizer_name);
			plist += ut.addFieldToJSON("artiste_name", r.artiste_name);
			plist += ut.addFieldToJSON("accompanists", r.accompanists);
			plist += ut.addFieldToJSON("organizer_phone", r.organizer_phone);
			plist += ut.addFieldToJSON("event_start", r.event_start);
			plist += ut.addFieldToJSON("event_end", r.event_end);
			plist += ut.addFieldToJSON("duration", r.duration);
			plist += ut.addFieldToJSON("venue_address1", r.venue_address1);
			plist += ut.addFieldToJSON("venue_address2", r.venue_address2);
			plist += ut.addFieldToJSON("venue_city", r.venue_city);
			plist += ut.addFieldToJSON("venue_state", r.venue_state);
			plist += ut.addFieldToJSON("venue_country", r.venue_country);
			plist += ut.addFieldToJSON("venue_pincode", r.venue_pincode);
			plist += ut.addFieldToJSON("venue_mapcoords", r.venue_mapcoords);
			plist += ut.addFieldToJSON("venue_parking", r.venue_parking);
			plist += ut.addFieldToJSON("venue_eataries", r.venue_eataries);
			plist += ut.addFieldToJSON("artiste_image", r.artiste_image);
			plist += ut.addFieldToJSON("is_featured", r.is_featured);
			plist += ut.addFieldToJSON("splash_url", r.splash_url);
			plist += ut.addFieldToJSON("is_published", r.is_published, 'true');

			plist += "}";
			if (i < result.rows.length - 1) {
				plist += ",\n";
			}
		}
		plist += "]\n";

		process.stdout.write("PLIST:\n");
		process.stdout.write(plist);

		return plist;
	}

	getProgramListJSON_old(result) {

		process.stdout.write("Inside getProgramListJSON");
		var ut = new myutil();
		var plist = "";

		plist += "[";

		for (var i = 0; i < result.rows.length; ++i) {
			var r = result.rows[i];

			plist += "{\n";

			//Actual program object fields
			plist += ut.addFieldToJSON("id", r.id);
			plist += ut.addFieldToJSON("title", r.title);
			plist += ut.addFieldToJSON("event_type", r.event_type);
			plist += ut.addFieldToJSON("description", r.description);
			plist += ut.addFieldToJSON("entry_fee", r.entry_fee);
			plist += ut.addFieldToJSON("website", r.website);
			plist += ut.addFieldToJSON("event_date", r.event_date);
			plist += ut.addFieldToJSON("place", r.place);
			plist += ut.addFieldToJSON("organizer", r.organizer);
			plist += ut.addFieldToJSON("artiste", r.artiste);
			plist += ut.addFieldToJSON("accompanists", r.accompanists);
			plist += ut.addFieldToJSON("phone", r.phone);
			plist += ut.addFieldToJSON("event_start", r.event_start);
			plist += ut.addFieldToJSON("event_end", r.event_end);
			plist += ut.addFieldToJSON("duration", r.duration);
			plist += ut.addFieldToJSON("location_address1", r.location_address1);
			plist += ut.addFieldToJSON("location_address2", r.location_address2);
			plist += ut.addFieldToJSON("location_city", r.location_city);
			plist += ut.addFieldToJSON("location_state", r.location_state);
			plist += ut.addFieldToJSON("location_country", r.location_country);
			plist += ut.addFieldToJSON("location_pincode", r.location_pincode);
			plist += ut.addFieldToJSON("location_mapcoords", r.location_mapcoords);
			plist += ut.addFieldToJSON("location_parking", r.location_parking);
			plist += ut.addFieldToJSON("location_eataries", r.location_eataries);
			plist += ut.addFieldToJSON("artiste_image", r.artiste_image);
			plist += ut.addFieldToJSON("is_featured", r.is_featured);
			plist += ut.addFieldToJSON("splash_url", r.splash_url);
			plist += ut.addFieldToJSON("is_published", r.is_published, 'true');

			plist += "}";
			if (i < result.rows.length - 1) {
				plist += ",\n";
			}
		}
		plist += "]\n";

		process.stdout.write("PLIST:\n");
		process.stdout.write(plist);

		return plist;
	}

};
