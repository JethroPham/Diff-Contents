/*Licence VinhPN master*/
app.factory('readFileData', function($q) {
	var _return = {};
	_return.mergeWithBothFile = function(file) {
		var dfd = $q.defer();
		var obj = {};
		obj.dateTime = file.lastModifiedDate;
		reader = new FileReader();
		reader.onloadend = function(e){
			if(e) {
				var zip = new JSZip(e.target.result);
				var doc=new Docxtemplater().loadZip(zip);
				obj.getFullText = doc.getFullText();
				dfd.resolve(obj);	
			}else {
				dfd.reject("The error occur when read file");
			}
		}
		reader.readAsBinaryString(file);
		return dfd.promise;
	}
	return _return;
});
