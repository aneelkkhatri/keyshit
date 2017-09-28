
(function game() {

	var GAME_STATE = {
		NEW: 0,
		PLAYING: 1,
		OVER: 2,
		RESETING: 3,
		HELP: 4
	};

	var KEYS = {
		ENTER: 13
	};

	var K_S = {
		PRESS_ENTER: "PRESS ENTER",
		X: ""
	};

	var LTIMES = 5;
	var DELAY = 640 / LTIMES;

	var MIN = 2;
	// var valueHolder = document.getElementsByClassName("value-holder")[0];

	var score = 0;
	var gameContent = document.getElementById("game-content");
	var scoreText = document.getElementById("score-text");
	var bestScoreText = document.getElementById("best-score-text");
	var boxContainers = $("#key-containers .key-container").get();

	var gameState = GAME_STATE.NEW;
	var gameStateStack = [];
	var queue=[];

	var l = 0;

	var boxes = [];

	function resetBox(box) {
		container = boxContainers[box.idx];
		container.setAttribute('style','');

		var containerText = $(container).children(".container-text").get()[0];
		containerText.textContent = '';

		box.used = false;
	}
	function resetGame() {
		boxes.length = 0;
		queue.length = 0;
		updateGameScore(0);

		var count = boxContainers.length;

		for (var i = 0; i < count; i++) {

			boxes[i] = {
				used: false,
				idx: i
			}

			resetBox(boxes[i]);
		}
	}

	function getFreeBoxes() {
		var freeBoxes = [];
		var boxesCount = boxes.length;
		for(var i = 0; i < boxesCount; i++) {
			var box = boxes[i];
			if (!box.used) {
				freeBoxes.push(box);
			};
		}

		return freeBoxes;
	}

	function gameLoop(t) {
		var startTime = Date.now();
		
		switch(gameState) {
			case (GAME_STATE.NEW): {

				// valueHolder.textContent = K_S.X;
				break;
			}
			case (GAME_STATE.PLAYING): {

				if(l == 0) {
					// valueHolder.textContent = '';
				
					var box = getRandomFreeBox();

					if (box) {
						box.used = true;

						var randNum = parseInt(Math.random() * 36);
						var valueToPush, 
							textContent;

						if(randNum >= 10) {
							randNum -= 10;

							// var valueToPush = ( randNum >= 26 ? (randNum - 26 + 97) : (randNum + 65) );
							valueToPush = randNum + 97;
							textContent = String.fromCharCode(valueToPush);
						}
						else {
							valueToPush = randNum + 48;
							textContent = randNum;
						}
						// valueHolder.textContent = textContent;

						var container = getContainerFromBox(box);
						container.style.borderColor = KeyContainerColors.getRandomColor();

						var containerText = $(container).children(".container-text").get()[0];

						containerText.textContent = textContent;
						// console.log(containerText);
						queue.push({
							key: valueToPush,
							box: box
						});
					}

					if(queue.length == boxContainers.length) {
						updatePopupOverMessage("Overflown!");
				
						gameStateStack.push(GAME_STATE.OVER);
						updateGameState(GAME_STATE.RESETING);
					}

				}

				l = (l + 1) % 5;

				break;
			}
			case (GAME_STATE.RESETING): {
				updateGameLastScore(score);

				l = 0;
				// valueHolder.textContent = K_S.X;
				resetGame();
				updateGameState(gameStateStack.pop());

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


	}

	function updateGameState(newState) {
		gameState = newState;
		gameContent.setAttribute('class', "state-" + gameState);
	}

	function updateGameScore(newScore) {
		score = newScore;
		scoreText.textContent = score;

		if (typeof(Storage) != "undefined") {
			var bestScore = localStorage.getItem('best-score');
			if (typeof(bestScore) == "string") {
				bestScore = parseInt(bestScore);
				if (bestScore < score) {
					bestScore = score;

					localStorage.setItem('best-score', score);
				};
			}
			else {
				bestScore = score;
				localStorage.setItem('best-score', score);
			}
			bestScoreText.textContent = bestScore;
		}
		else {
			bestScoreText.textContent = newScore;
		}
	}

	function updateGameLastScore(newLastScore) {
		var popupScoreText = document.getElementById("popup-score-text");
		popupScoreText.textContent = newLastScore;
	}

	function updatePopupOverMessage(msg) {
		var popupOverMsg = document.getElementById("popup-over-msg");
		popupOverMsg.textContent = msg;
	}

	function getRandomIndex(count) {
		return parseInt(Math.random() * count);
	}

	function getRandomFreeBox() {
		var freeBoxes = getFreeBoxes();
		if (freeBoxes.length == 0) return;

		return freeBoxes[ getRandomIndex( freeBoxes.length ) ];
	}

	function getContainerFromBox(box) {
		var containers = $("#key-containers .key-container").get();
		var count = containers.length;

		var container = containers[box.idx];

		return container;
	}

	document.addEventListener('keypress', function(e) {
		var keyCode = e.keyCode;

		if (e.key) {
			if (e.key == 'Enter') {
				keyCode = KEYS.ENTER;
			}
			else {
				keyCode = e.key.charCodeAt(0)
			}
		}
		
		if(gameState == GAME_STATE.PLAYING) {

			if( queue.length > MIN && queue[0].key == keyCode) {
				resetBox(queue[0].box);
				queue.splice(0,1);

				updateGameScore(score+1);

			}
			else {
				if (queue.length <= MIN) {
					updatePopupOverMessage("You can hit a key only if there are atleast " + (MIN+1) + " key(s) on the screen!");
				}
				else {
					updatePopupOverMessage("Wrong key!");
				}
				gameStateStack.push(GAME_STATE.OVER);
				updateGameState(GAME_STATE.RESETING);
			}
		}
		else {
			
			if(keyCode == KEYS.ENTER) {
				gameStateStack.push(GAME_STATE.PLAYING);
				updateGameState( GAME_STATE.RESETING);
			}
		}
	});

	(function addListeners() {
		var startBtn = document.getElementById("start-button");
		startBtn.addEventListener('click', function startBtnHandler() {
			gameStateStack.push(GAME_STATE.PLAYING);
			updateGameState(GAME_STATE.RESETING);
		});

		var restartBtn = document.getElementById("restart-button");
		restartBtn.addEventListener('click', function restartBtnHandler() {
			gameStateStack.push(GAME_STATE.PLAYING);
			updateGameState(GAME_STATE.RESETING);
		});


		$(".how-to-play-button").on('click', function howToPlayHandler() {
			gameStateStack.push(gameState);
			updateGameState(GAME_STATE.HELP);
		});

		$(".pop-state-btn").on('click', function popStateHandler() {
			updateGameState(gameStateStack.pop());
		});

	})();
	

	resetGame();
	gameLoop(0);
})();
