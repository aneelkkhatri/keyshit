
var KeyContainerColors = (function Colors(){
	var colors = ["#A7BF4E",
				  "#EDF25C",
				  "#A67B56",
				  "#F25A38",
				  "#F23030"];

	return {
		getCount: function() {
			return colors.length;
		},
		getColor: function(idx) {
			return colors[idx];
		},
		getRandomColor: function() {
			var idx = parseInt(Math.random() * colors.length);
			return colors[idx];
		}
	}
})();
