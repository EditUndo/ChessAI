function playAI(game) {
	// Find the best move and play it
	var move = bestMove(game);
	game.move(move);
	
	// Update the board position on screen and update game status at the bottom of the page
	board.position(game.fen());
	updateStatus();
	
	if (game.game_over()) {
		alert('Game Over');
	}
}