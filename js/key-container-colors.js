
var KeyContainerColors = (function Colors(){
	var colors = ["#A7BF4E",
				  "#EDF25C",
				  "#A67B56",
				  "#F25A38",
				  "#8CC3F2",
				  "#F2B90F",
				  "#F2620F",
				  "#BF2633",
				  "#D9304F",
				  "#F24976",
				  "#8BC3D9",
				  "#D9AB73",
				  "#DEC26E",
				  "#423547",
				  "#F2D541",
				  "#F25270"];

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
