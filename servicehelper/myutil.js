var self;

module.exports = class myutil{
	constructor(){
		self=this;
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
