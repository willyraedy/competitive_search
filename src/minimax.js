
/*
 *
 *
The function "makeMove" is already written for you.
You do not need to modify it, but you should read it.

It will choose moves intelligently once minimax,
which it invokes, evaluates different board-states
correctly.  It is the ONLY function invoked when
you play against the computer after starting up
the server.

Input: A state object, representing the Connect 4 board.

Output: Returns an integer indicating the column
where the piece will be dropped.

*/

const makeMove = (state) => {

	// Find whose move it is; 'x' or 'o'
	const playerMoving = state.nextMovePlayer;

	// state.legalMoves returns an array of integer values,
	// which indicate the locations (0 through 6)
	// where one can currently legally drop a piece.
	const allLegalMoves = state.legalMoves();

	// To get a successor state following a move,
	// just call state.move(someMove).  This returns
	// the board state after that move has been made.
	// It autmatically switches the player whose
	// move it is, and so on and so forth
	//
	// Note that state is immutable; invoking state.move
	// does NOT change the original state, but
	// returns a new one.
	const newState = state.move(allLegalMoves[0]);


	// The following is the guts of the make-move function.
	// The function max(arr, func) returns the element
	// from the array "arr" which has the greatest value
	// according to the function "func"
	const depth = 4;

	let bestMoveIndex = null;
	let bestMoveValue = null;
	allLegalMoves.forEach( (legalMove, i) => {

		const potentialState = state.move(legalMove)

		const stateValue = minimax(potentialState, depth, playerMoving);
		//const stateValue = minimaxAlphaBetaWrapper(potentialState, depth, playerMoving)

		if (stateValue > bestMoveValue || bestMoveValue === null){
			bestMoveIndex = i;
			bestMoveValue = stateValue;
		}

	});
	return allLegalMoves[bestMoveIndex]

}


/*
The function "heuristic" is one you must (mostly)
write.

Input: state, maximizingPlayer.  The state will be 
a state object.  The maximizingPlayer will be either
an 'x' or an 'o', and is the player whose advantage 
is signified by positive numbers.

Output: A number evaluating how good the state is from
the perspective of the player who is maximizing.

A useful method on state here would be state.numLines.
This function takes an integer and a player
like this "state.numLines(2,'x')" and returns the 
number of lines of that length which that player
has.  That is, it returns the number of contiguous linear
pieces of that length that that player has.

This is useful because, generally speaking, it is better 
to have lots of lines that fewer lines, and much better
to have longer lines than shorter lines.

You'll want to pass the tests defined in minimax_specs.js.
*/
const heuristic = function(state, maximizingPlayer){

	//This is how you can retrieve the minimizing player.
    var minimizingPlayer = (maximizingPlayer == 'x') ? 'o' : 'x';

    var evalFor = function(player){

    	var linesTotal = 0;
    	for (var lineLength = 2; lineLength <= 4; lineLength++){
    		var lineNumber = state.numLines(lineLength, player);
    		var lineValueFactor = Math.pow(200,lineLength-1);
    		var linesValue = lineNumber * lineValueFactor;
    		linesTotal = linesTotal + linesValue;
    	}

    	var positionValue = 0;
    	var values = [0,1,2,3,3,2,1,0];
    	var rowNum = state.board.length;
    	var colNum = state.board[0].length;
    	for(var col = 0; col < colNum; col++){
    		for(var row = 0; row < rowNum; row++){
    			if (state.board[row][col] == player){
    				positionValue = positionValue + values[col];
    			}
    		}
    	}

    	return linesTotal + positionValue;
    }

    //Your code here.  Don't return random, obviously.
	return evalFor(maximizingPlayer) - evalFor(minimizingPlayer);
}



/*
The function "minimax" is one you must write.

Input: state, depth, maximizingPlayer.  The state is 
an instance of a state object.  The depth is an integer 
greater than zero; when it is zero, the minimax function
should return the value of the heuristic function.  

Output: Returns a number evaluating the state, just
like heuristic does.

You'll need to use state.nextStates(), which returns 
a list of possible successor states to the state passed in
as an argument.

You'll also probably need to use state.nextMovePlayer,
which returns whether the next moving player is 'x' or 'o',
to see if you are maximizing or minimizing.
*/
var minimax = function(state, depth, maximizingPlayer){
	var minimizingPlayer = (state.maximizingPlayer == 'x') ? 'o' : 'x';
	var possibleStates = state.nextStates();
	var currentPlayer = state.nextMovePlayer;
	
	if (depth == 0 || possibleStates.length == 0){
		return heuristic(state, maximizingPlayer)
	}else{

		var possibleStatesValues = possibleStates.map(nextState => {
			return minimax(nextState, depth-1, maximizingPlayer);
		});

		if (maximizingPlayer == currentPlayer){
			return Math.max.apply(null, possibleStatesValues);
		}else{
			return Math.min.apply(null, possibleStatesValues);
		}

	}

}



/* minimaxAlphaBetaWrapper is a pre-written function, but it will not work
   unless you fill in minimaxAB within it.

   It is called with the same values with which minimax itself is called.*/
var minimaxAlphaBetaWrapper = function(state, depth, maximizingPlayer){
	
    /*
    You will need to write minimaxAB for the extra credit.
    Input: state and depth are as they are before.  (Maximizing player
    is closed over from the parent function.)

    Alpha is the BEST value currently guaranteed to the maximizing
    player, if they play well, no matter what the minimizing player 
    does; this is why it is a very low number to start with.

    Beta is the BEST value currently guaranteed to the minimizing 
    player, if they play well, no matter what the maximizing player
    does; this is why it is a very high value to start with.
	*/
	var minimaxAB = function(state, depth, alpha, beta){

		var minimizingPlayer = (state.maximizingPlayer == 'x') ? 'o' : 'x';
		var possibleStates = state.nextStates();
		var currentPlayer = state.nextMovePlayer;
		
		if (depth == 0 || possibleStates.length == 0){
			return heuristic(state, maximizingPlayer)
		}else{

			if (maximizingPlayer == currentPlayer){
			
				var bestMoveSoFar = -10000000;
				for(var x = 0; x < possibleStates.length; x++){
					var nextState = possibleStates[x];
					var valueOfState = minimaxAB(nextState, depth-1, alpha, beta)
					alpha = Math.max(alpha, valueOfState);
					bestMoveSoFar = Math.max(bestMoveSoFar, valueOfState);
					if (alpha > beta){
						return bestMoveSoFar;
					}
				}
				return bestMoveSoFar;

			}else{

				var bestMoveSoFar = 10000000;
				for(var x = 0; x < possibleStates.length; x++){
					var nextState = possibleStates[x];
					var valueOfState = minimaxAB(nextState, depth-1, alpha, beta)
					beta = Math.min(beta, valueOfState);
					bestMoveSoFar = Math.min(bestMoveSoFar, valueOfState);
					if (alpha > beta){
						return bestMoveSoFar;
					}
				}
				return bestMoveSoFar;
			

			}

		}

	}

	return minimaxAB(state, depth, -10000000,10000000)
}	

//ecxport default {makeMove, minimax, heuristic};
module.exports = {makeMove, minimax, heuristic};
