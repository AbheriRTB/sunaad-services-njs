var self;
const { Client } = require('pg');

module.exports = class myutil{
	constructor(){
		self=this;
	}


	getDBClient() {
		const client = new Client({
			connectionString: 'postgres://fmqmngfeeeisnp:e83807cc9fed72c07a0fc8948c51dcba7898827253de49c13e12a2c41f25ba70@ec2-3-233-206-99.compute-1.amazonaws.com:5432/d8plt8j7utocht',
			ssl: {
				rejectUnauthorized: false
			}
		})

		return client;
	}

/*
	addFieldToJSON(field, value){
			var valueTmp = value + "";
			var str="";

			if(value == null)
				valueTmp = "";

			str += "\"" + field + "\":";
			if(typeof value != 'undefined' && typeof value == 'number'){
				str += valueTmp.trim();
			}else{
				str += "\"" + valueTmp.trim() + "\"";
			}
			str += ",\n";

			return str;
	}
	*/

	addFieldToJSON(field, value, suppress_comma){
			var valueTmp = value + "";
			var str="";

			if(value == null)
				valueTmp = "";

			str += "\"" + field + "\":";
			if(typeof value != 'undefined' && typeof value == 'number'){
				str += valueTmp.trim();
			}else{
				str += "\"" + valueTmp.trim() + "\"";
			}
			if(suppress_comma == undefined ||  suppress_comma == 'false'){
				str += ",\n";
			}

			return str;
	}

};
