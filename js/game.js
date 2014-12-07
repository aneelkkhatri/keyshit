
(function game() {

	var GAME_STATE = {
		NEW: 0,
		PLAYING: 1,
		OVER: 2,
		RESETING: 3
	};

	var KEYS = {
		ENTER: 13
	};

	var K_S = {
		PRESS_ENTER: "PRESS ENTER",
		X: ""
	};

	var DELAY = 500;
	var MIN = 1;
	var valueHolder = document.getElementsByClassName("value-holder")[0];

	var gameState = GAME_STATE.NEW;
	var gameStateStack = [];
	var queue=[];

	var l = 1;
	function gameLoop(t) {
		var startTime = Date.now();
		
		switch(gameState) {
			case (GAME_STATE.NEW): {

				valueHolder.textContent = K_S.X;
				break;
			}
			case (GAME_STATE.PLAYING): {

				if(l == 0) {
					valueHolder.textContent = '';
				}
				else {
					var randNum = parseInt(Math.random() * 62);
					if(randNum >= 10) {
						randNum -= 10;

						var valueToPush = ( randNum >= 26 ? (randNum - 26 + 97) : (randNum + 65) );
						valueHolder.textContent = String.fromCharCode(valueToPush);

						queue.push(valueToPush);
					}
					else {
						valueHolder.textContent = randNum;
						queue.push(randNum + 48);
					}
				}

				l = (l + 1) % 2;

				break;
			}
			case (GAME_STATE.RESETING): {

				queue.length = 0;
				l = 1;
				valueHolder.textContent = K_S.X;
				gameState = gameStateStack.pop();

				break;
			}
			case (GAME_STATE.OVER): {

				break;
			}

		}
		
		var now = Date.now();
		var delay = DELAY - (now - startTime);
		startTime = now;

		setTimeout(gameLoop, delay);

		
		var container = getRandomFreeKeyContainer();
		container.style.backgroundColor = KeyContainerColors.getRandomColor();
		container.dataset.used = 1;
	}

	function getRandomIndex(count) {
		return parseInt(Math.random() * count);
	}

	function getRandomFreeKeyContainer() {
		var containers = $("#key-containers .key-container").get();
		var count = containers.length;

		var container = containers[ getRandomIndex(count) ];
		var dataset = container.dataset;

		if (dataset.used == 1) {
			console.log(getRandomIndex(count));
			for (var i = 0; i < count; i++) {
				container = containers[i];
				dataset = container.dataset;

				if( dataset.used == 1) {

				}
				else {
					console.log("FOUND");
					while(dataset.used) {
						var idx = getRandomIndex(count);
						console.log(idx);
						container = containers[ idx ];
						dataset = container.dataset;
					}
					break;
				}
			};
		}

		if (container.dataset.used == 0) return container;
	}

	document.addEventListener('keypress', function(e) {
		var keyCode = e.keyCode;
		console.log(keyCode);
		console.log(queue);
		if(gameState == GAME_STATE.PLAYING) {

			if( queue.length > MIN && queue[0] == keyCode) {
				queue.splice(0,1);

				console.log("CORRECT");
			}
			else {
				console.log("WRONG");
				gameStateStack.push(GAME_STATE.OVER);
				gameState = GAME_STATE.RESETING;
			}
		}
		else {
			
			if(keyCode == KEYS.ENTER) {
				gameStateStack.push(GAME_STATE.PLAYING);
				gameState = GAME_STATE.RESETING;
			}
		}

	});

	gameLoop(0);
})();
