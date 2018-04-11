function playAI(game) {
	var timeStart = new Date().getTime();
	// Find the best move and play it
	var move = bestMove(game);
	game.move(move);
	var timeEnd = new Date().getTime();
	
	var totalTime = timeEnd - timeStart;
	
	movesE1.html(movesEvaluated);
	timeE1.html(totalTime + "ms");
	
	// Update the board position on screen and update game status at the bottom of the page
	board.position(game.fen());
	updateStatus();
	
	if (game.game_over()) {
		alert('Game Over');
	}
}