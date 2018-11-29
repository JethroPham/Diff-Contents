/*Tool compare document format .docx, etc*/
/*Licence VinhPN master*/
var app = angular.module("myApp", []);
app.controller("myCtrl",["$scope", "$q", "readFileData", function($scope, $q, $readFileData) {
	 
    var a = document.getElementById('a');
	var b = document.getElementById('b');
	var result = document.getElementById('result');
	var promises = [];

	$scope.fileNameChanged = function(files) {
	   console.log(files);
	   if(files.length == 2) {
		_.forEach(files, function(file) {
		   promises.push($readFileData.mergeWithBothFile(file));
		})
	   	$q.all(promises).then(function(data) {
			a.textContent = data[0].getFullText;
			$scope.dateFileOne = data[0].dateTime;
			b.textContent = data[1].getFullText;
			$scope.dateFileTwo = data[1].dateTime;
			console.log(data);
		}); 
	   }else {
		 alert("Please only select 2 files");   
	   }
	}

	function changed() {
		if(window.diffType == 'applyPatch') {
			b.textContent = JsDiff.applyPatch(a.textContent, result.textContent);
		} else if(window.diffType == 'createPatch') {
			result.textContent = JsDiff.createPatch('filename',a.textContent, b.textContent,'left','right');
		} else {
			var diff = JsDiff[window.diffType](a.textContent, b.textContent);
			var fragment = document.createDocumentFragment();
			for (var i=0; i < diff.length; i++) {

				if (diff[i].added && diff[i + 1] && diff[i + 1].removed) {
					var swap = diff[i];
					diff[i] = diff[i + 1];
					diff[i + 1] = swap;
				}

				var node;
				if (diff[i].removed) {
					node = document.createElement('del');
					node.appendChild(document.createTextNode(diff[i].value));
				} else if (diff[i].added) {
					node = document.createElement('ins');
					node.appendChild(document.createTextNode(diff[i].value));
				} else {
					node = document.createTextNode(diff[i].value);
				}
				fragment.appendChild(node);
			}

			result.textContent = '';
			result.appendChild(fragment);
		}
	}

	window.onload = function() {
		onDiffTypeChange(document.querySelector('#settings [name="diff_type"]:checked'));
		changed();
	};

	a.onpaste = a.onchange =
	b.onpaste = b.onchange =
	result.onpaste = result.onchange = changed;


	if ('oninput' in a) {
		a.oninput = b.oninput = result.oninput = changed;
	} else {
		a.onkeyup = b.onkeyup = result.onkeyup = changed;
	}

	function onDiffTypeChange(radio) {
		window.diffType = radio.value;
		document.title = "Different from " + radio.parentNode.innerText;
		if(window.diffType == "applyPatch") {
			b.removeAttribute('contenteditable');
			result.setAttribute('contenteditable','true');
		} else {
			result.removeAttribute('contenteditable');
			b.setAttribute('contenteditable','true');
		}
	}

	var radio = document.getElementsByName('diff_type');
	for (var i = 0; i < radio.length; i++) {
		radio[i].onchange = function(e) {
			onDiffTypeChange(e.target);
			changed();
		}
	}
}]);
