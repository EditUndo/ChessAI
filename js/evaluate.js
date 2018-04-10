// Finds the best move of the current position by searching possible moves the AI could take
function bestMove(game) {
	if (game.game_over()) {
		alert("Game Over");
	}
	
	var possibleMoves = game.moves();
	var bestMove;
	var bestValue = -9999;
	var values = ""; // For debugging
	
	console.log("Current Value " + evaluateBoard(game));
	
	// For each move the AI can take, evaluate the board position after
	for (var i = 0; i < possibleMoves.length; i++) {
		
		var testMove = possibleMoves[i];
		game.move(testMove); // Make a move via the current move we are evaluating
		
		var testValue = evaluateBoard(game); // Evaluate the board as a number value based on the move we just made
		
		// If we can checkmate in one move, then that is the best possible move
		if (game.in_checkmate() === true) {
			bestValue = 9999;
			bestMove = testMove;
			break;
		}
		
		// If moves are equal, give preference to the ones that put the opponent in check and limits the moves they can take
		if (game.in_check() === true) {
			testValue = testValue + 0.5;
		}
		
		values = values + testValue + "\n"; // For debugging
		
		game.undo(); // Undo the move we just made so we can check another one
		
		// Set the best move and best board value for that move
		if (testValue > bestValue) {
			bestMove = testMove;
			bestValue = testValue;
		}
	}
	console.log(values); // For debugging
	console.log("New Value " + bestValue);
	
	return bestMove;
	
}

function evaluateBoard(game) {
	
	var score = 0;
	
	// Iterate through the board and calculate a score for the positions of each piece
	for (var i = 0; i < 8; i++) {
		for (var j = 0; j < 8; j++) {
			
			var piece = game.board()[i][j]; // The board is represented as a 2D array
			var tempScore = 0;
			if (piece === null) {break;} // If there is no piece on this square, don't change the score at all
			
			// White pieces should reduce the score and black pieces should increase it. A starting position should have a value of 0
			// Evaluation is by the points of the piece + the rating of its position
			if (piece.color === 'w') {
				if (piece.type === 'p') {tempScore = -10 - pawnEvalWhite[i][j];}
				else if (piece.type === 'r') {tempScore = -50 - rookEvalWhite[i][j];}
				else if (piece.type === 'n') {tempScore = -30 - knightEval[i][j];}
				else if (piece.type === 'b') {tempScore = -30 - bishopEvalWhite[i][j];}
				else if (piece.type === 'q') {tempScore = -90 - queenEval[i][j];}
				else if (piece.type === 'k') {tempScore = -900 - kingEvalWhite[i][j];}
				//if (game.attacked(game.WHITE, i)) {tempScore = tempScore / 10.0} // Will be added back in later, do not remove
				if (!isNaN(tempScore)) {score = score + tempScore;} // If for some reason we have a NaN, don't add that (Happened during testing and debugging is preferred over a broken AI)
			}
			else {
				if (piece.type === 'p') {tempScore = 10 + pawnEvalBlack[i][j];}
				else if (piece.type === 'r') {tempScore = 50 + rookEvalBlack[i][j];}
				else if (piece.type === 'n') {tempScore = 30 + knightEval[i][j];}
				else if (piece.type === 'b') {tempScore = 30 + bishopEvalBlack[i][j];}
				else if (piece.type === 'q') {tempScore = 90 + queenEval[i][j];}
				else if (piece.type === 'k') {tempScore = 900 + kingEvalBlack[i][j];}
				//if (game.attacked(game.BLACK, i)) {tempScore =  temspScore / 10.0} // Will be added back in later, do not remove
				if (!isNaN(tempScore)) {score = score + tempScore;} // If for some reason we have a NaN, don't add that
			}
		}
	}
	
	return score;
	
}

// Reverse the array for black pieces because they are looking from the other side of the board (some pieces are the same no matter what, so don't reverse those)
var reverseArray = function(array) {
    return array.slice().reverse();
};

//// Piece ratings based on their position on the board ////
var pawnEvalWhite =
    [
        [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
        [5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0],
        [1.0,  1.0,  2.0,  3.0,  3.0,  2.0,  1.0,  1.0],
        [0.5,  0.5,  1.0,  2.5,  2.5,  1.0,  0.5,  0.5],
        [0.0,  0.0,  0.0,  2.0,  2.0,  0.0,  0.0,  0.0],
        [0.5, -0.5, -1.0,  0.0,  0.0, -1.0, -0.5,  0.5],
        [0.5,  1.0, 1.0,  -2.0, -2.0,  1.0,  1.0,  0.5],
        [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0]
    ];

var pawnEvalBlack = reverseArray(pawnEvalWhite);

var knightEval =
    [
        [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
        [-4.0, -2.0,  0.0,  0.0,  0.0,  0.0, -2.0, -4.0],
        [-3.0,  0.0,  1.0,  1.5,  1.5,  1.0,  0.0, -3.0],
        [-3.0,  0.5,  1.5,  2.0,  2.0,  1.5,  0.5, -3.0],
        [-3.0,  0.0,  1.5,  2.0,  2.0,  1.5,  0.0, -3.0],
        [-3.0,  0.5,  1.0,  1.5,  1.5,  1.0,  0.5, -3.0],
        [-4.0, -2.0,  0.0,  0.5,  0.5,  0.0, -2.0, -4.0],
        [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0]
    ];

var bishopEvalWhite = [
    [ -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
    [ -1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
    [ -1.0,  0.0,  0.5,  1.0,  1.0,  0.5,  0.0, -1.0],
    [ -1.0,  0.5,  0.5,  1.0,  1.0,  0.5,  0.5, -1.0],
    [ -1.0,  0.0,  1.0,  1.0,  1.0,  1.0,  0.0, -1.0],
    [ -1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0, -1.0],
    [ -1.0,  0.5,  0.0,  0.0,  0.0,  0.0,  0.5, -1.0],
    [ -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0]
];

var bishopEvalBlack = reverseArray(bishopEvalWhite);

var rookEvalWhite = [
    [  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
    [  0.5,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [  0.0,   0.0, 0.0,  0.5,  0.5,  0.0,  0.0,  0.0]
];

var rookEvalBlack = reverseArray(rookEvalWhite);

var queenEval = [
    [ -2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
    [ -1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
    [ -1.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
    [ -0.5,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
    [  0.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
    [ -1.0,  0.5,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
    [ -1.0,  0.0,  0.5,  0.0,  0.0,  0.0,  0.0, -1.0],
    [ -2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0]
];

var kingEvalWhite = [

    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
    [ -1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
    [  2.0,  2.0,  0.0,  0.0,  0.0,  0.0,  2.0,  2.0],
    [  2.0,  3.0,  1.0,  0.0,  0.0,  1.0,  3.0,  2.0]
];

var kingEvalBlack = reverseArray(kingEvalWhite);
//// End piece ratings ////