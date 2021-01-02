var START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
var _engine, _curmoves = [];
var _history = [[START]], _history2 = null, _historyindex = 0;
var _flip = false, _edit = false, _info = false, _play = null;
var _arrow = false, _menu = false;
var _dragElement = null, _dragActive = false, _startX, _startY, _dragCtrl, _dragLMB, _clickFrom, _clickFromElem;
var _tooltipState = false, _wantUpdateInfo = true;;
var _wname = "White", _bname = "Black", _color = 0, _bodyScale = 1;
var _nncache = null;
var moveAN = ""
const moveAudio = new Audio('sounds/Move.mp3');
var board,
  game = new Chess(),
  pgnEl = $('#pgn'),
  toggleEI = $('#toggle'),
  sdepth = 10,
  colorsEI = $('#col1');
  
  var elem = document.getElementById('col1');
  //console.log(elem.selectedIndex);
//document.getElementById("status").innerHTML = "this is new code";

// do not pick up pieces if the game is over
// only pick up pieces for the side to move
var SQUARES = {
           0:"a8",    1:"b8",    2:"c8",    3:"d8",    4:"e8",    5:"f8",    6:"g8",    7:"h8",
          16:"a7",   17:"b7",   18:"c7",   19:"d7",   20:"e7",   21:"f7",   22:"g7",   23:"h7",
          32:"a6",   33:"b6",   34:"c6",   35:"d6",   36:"e6",   37:"f6",   38:"g6",   39:"h6",
          48:"a5",   49:"b5",   50:"c5",   51:"d5",   52:"e5",   53:"f5",   54:"g5",   55:"h5",
          64:"a4",   65:"b4",   66:"c4",   67:"d4",   68:"e4",   69:"f4",   70:"g4",   71:"h4",
          80:"a3",   81:"b3",   82:"c3",   83:"d3",   84:"e3",   85:"f3",   86:"g3",   87:"h3",
          96:"a2",   97:"b2",   98:"c2",   99:"d2",  100:"e2",  101:"f2",  102:"g2",  103:"h2",
         112:"a1",  113:"b1",  114:"c1",  115:"d1",  116:"e1",  117:"f1",  118:"g1",  119:"h1"
    };
	var PIECES = {
		r: "Black Rook",
		n: "Black Knight",
		b: "Black Bishop",
		q: "Black Queen",
		k: "Black King",
		p: "Black Pawn",
		R: "White Rook",
		N: "White Knight",
		B: "White Bishop",
		Q: "White Queen",
		K: "White King",
		P: "White Pawn"
	};

function is_digit(c) {
        return '0123456789'.indexOf(c) !== -1;
    }
function describeBoard() {
	describe(game.fen())
}	
function describe(fen) {
        var tokens = fen.split(/\s+/);
        var position = tokens[0];
        var square = 0,
		whitePawns = [],
		  blackPawns = [],
		  whiteRooks = [],
		  blackRooks = [],
		  whiteBishops = [],
		  blackBishops = [],
		  whiteKnights = [],
		  blackKnights =[],
		  blackQueen = [],
		  whiteQueen = [],
		  blackKing = [],
		  whiteKing = []
		//console.log(fen)
		
        for (var i = 0; i < position.length; i++) {
            var piece = position.charAt(i);
			if (piece === '/') {
                square += 8;
            } else if (is_digit(piece)) {
                square += parseInt(piece);
				//alert(square)
            } else {
                //console.log(PIECES[piece] + " " + SQUARES[square] )
				
				if(piece == "p") {
					blackPawns.push(SQUARES[square])
				} else if(piece == "P") {
					whitePawns.push(SQUARES[square])
				} else if(piece == "r") {
					blackRooks.push(SQUARES[square])
				} else if(piece == "R") {
					whiteRooks.push(SQUARES[square])
				} else if(piece == "n") {
					blackKnights.push(SQUARES[square])
				} else if(piece == "N") {
					whiteKnights.push(SQUARES[square])
				} else if(piece == "b") {
					blackBishops.push(SQUARES[square])
				} else if(piece == "B") {
					whiteBishops.push(SQUARES[square])
				} else if(piece == "q") {
					blackQueen.push(SQUARES[square])
				} else if(piece == "Q") {
					whiteQueen.push(SQUARES[square])
				} else if(piece == "k") {
					blackKing.push(SQUARES[square])		
				} else if(piece == "K") {
					whiteKing.push(SQUARES[square])		
				} 
				
                square++;
            }
        }
		alert("White pawn(s): " + whitePawns + "\n" +
				"Black pawn(s): " + blackPawns + "\n" +
				"White Rook(s): " + whiteRooks + "\n" + 
				"Black Rook(s): " + blackRooks + "\n" +
				"White Knight(s): " + whiteKnights + "\n" +
				"Black Knight(s): " + blackKnights + "\n" +
				"White Bishop(s): " + whiteBishops + "\n" +
				"Black Bishop(s): " + blackBishops + "\n" +
				"White Queen: " + whiteQueen + "\n" +
				"Black Queen: " + blackQueen + "\n" +
				"White King: " + whiteKing + "\n" +
				"Black King: " + blackKing)
		return true
        
    }
function Undo() {
		game.undo();
		game.undo();
		updateStatus();
	}
 function MakeMove() {
	var m = document.getElementById("move");
	var ret = game.move(m.value)
	//console.log(ret)
	if (ret === null) {
		alert("Illegal move!");
		ClearMove()
		return
	}
	updateStatus();
	//moveAudio.play()
	//getResponseMove();
	getMove()
	ClearMove()
	moveAudio.play()
	
	//console.log(m.value)
 }
function changeLevel() {
		newGame()
		if (this.options[this.selectedIndex].value > 4) {

			alert("Above high difficulty, things will get real slow on phones or low powered devices!")
		}
		var x = document.getElementById("col1");
		if (x.options[x.selectedIndex].value == 'black') {

			getMove()
		}
	}
function changeBoard() {
		newGame()
		if (this.options[this.selectedIndex].value == 'black') {

			getMove()
		}
	}
function toggleBoard() {
	var x = document.getElementById("toggle");

	if (x.innerHTML === "Show Board") {
		x.innerHTML = "Hide Board";
		var b = document.getElementById("board");
		b.style.display = "block"
		var c = document.getElementById("chesskeyboard");
		c.style.display = "none"
	} else {
		x.innerHTML = "Show Board";
		var b = document.getElementById("board");
		b.style.display = "none"
		var c = document.getElementById("chesskeyboard");
		c.style.display = "block"
	}
}
function ClearMove () {
	moveAN = ""
	var m = document.getElementById("move");
	m.value = moveAN
}
function ButtonSingleClick (buttonobj) {
	
	
	if(buttonobj.innerHTML == "Rook") {
		moveAN+="R"
	} else if(buttonobj.innerHTML == "Knight") {
		moveAN+="N"
	} else if(buttonobj.innerHTML == "Bishop") {
		moveAN+="B"
	} else if(buttonobj.innerHTML == "Queen") {
		moveAN+="Q"
	} else if(buttonobj.innerHTML == "King") {
		moveAN+="K"
	} else if(buttonobj.innerHTML == "Takes") {
		moveAN+="x"
	} else if(buttonobj.innerHTML == "Long Castle") {
		moveAN="O-O-O"
	} else if(buttonobj.innerHTML == "Short Castle") {
		moveAN="O-O"
	} else if(buttonobj.innerHTML == "Promote") {
		moveAN+="="
	} else {
		moveAN+=buttonobj.innerHTML
	}

	var m = document.getElementById("move");
	m.value = moveAN
	
	
}
var getMove = function () {
	makeBestMove()
    //window.setTimeout(makeBestMove, 250);
};
var onDragStart = function(source, piece, position, orientation) {
  if (game.game_over() === true ||
      (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false;
  }
};

var onDrop = function(source, target) {
  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  });

  // illegal move
  if (move === null) return 'snapback';

  updateStatus();
	makeBestMove();
	moveAudio.play();
    //window.setTimeout(makeBestMove, 250);
};
var makeWhiteFirstRandomMove = function () {
    var moves = game.moves();
	var move = moves[Math.floor(Math.random() * moves.length)];
	game.move(move);
    board.position(game.fen());
	updateStatus();
   
    if (game.game_over()) {
        alert('Game over');
    }
};
var makeBestMove = function () {
    if (game.game_over()) {
        alert('Game over');
    }

    positionCount = 0;
    //var depth = parseInt($('#search-depth').find(':selected').text());
	
	
	makeEngineMove(1)
    board.position(game.fen());
	updateStatus();
   
    if (game.game_over()) {
        alert('Game over');
    }
};



// update the board position after the piece snap
// for castling, en passant, pawn promotion
var onSnapEnd = function() {
    board.position(game.fen());
};

var updateStatus = function() {
  var status = '';

  var moveColor = 'White';
  if (game.turn() === 'b') {
    moveColor = 'Black';
  }

  // checkmate?
  if (game.in_checkmate() === true) {
    alert('Game over, ' + moveColor + ' is in checkmate.')
  }

  // draw?
  else if (game.in_draw() === true) {
    alert('Game over, drawn position')
  }

  // game still on
  else {
    status = moveColor + ' to move';

    // check?
    if (game.in_check() === true) {
      status += ', ' + moveColor + ' is in check';
    }
  }

  pgnEl.html(game.pgn());
  board.position(game.fen());
};

var cfg = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd,
  orientation: elem.options[elem.selectedIndex].value
};






// did this based on a stackoverflow answer
// http://stackoverflow.com/questions/29493624/cant-display-board-whereas-the-id-is-same-when-i-use-chessboard-js
// setTimeout(function() {

    // board = ChessBoard('board', cfg);
// //    updateStatus();
// }, 0);





var takeBack = function() {
    game.undo();
    if (game.turn() != "w") {
        game.undo();
    }
    board.position(game.fen());
    updateStatus();
}

var newGame = function() {
    game.reset();
    var cfg = {
      draggable: true,
      position: 'start',
      onDragStart: onDragStart,
      onDrop: onDrop,
      onSnapEnd: onSnapEnd,
      orientation: elem.options[elem.selectedIndex].value
    };
    board = ChessBoard('board', cfg);
    updateStatus();
}


function loadEngine() {
  var engine = {ready: false, kill: false, waiting: true, depth: sdepth, lastnodes: 0};
  var wasmSupported = typeof WebAssembly === 'object' && WebAssembly.validate(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));
  if (typeof(Worker) === "undefined") return engine;
  var workerData = new Blob([atob(wasmSupported ? sfWasm : sf)], { type: "text/javascript" });
  try { var worker = new Worker(window.URL.createObjectURL(workerData )); }
  catch(err) { return engine; }
  worker.onmessage = function (e) { if (engine.messagefunc) engine.messagefunc(e.data); }
  engine.send = function send(cmd, message) {
    cmd = String(cmd).trim();
    engine.messagefunc = message;
    worker.postMessage(cmd);
  };
  engine.eval = function eval(fen, done, info) {
    engine.send("position fen " + fen);
    engine.send("go depth "+ engine.depth, function message(str) {
      var matches = str.match(/depth (\d+) .*score (cp|mate) ([-\d]+) .*nodes (\d+) .*pv (.+)/);
      if (!matches) matches = str.match(/depth (\d+) .*score (cp|mate) ([-\d]+).*/);
      if (matches) {
        if (engine.lastnodes == 0) engine.fen = fen;
        if (matches.length > 4) {
          var nodes = Number(matches[4]);
          if (nodes < engine.lastnodes) engine.fen = fen;
          engine.lastnodes = nodes;
        }
        var depth = Number(matches[1]);
        var type = matches[2];
        var score = Number(matches[3]);
        if (type == "mate") score = (1000000 - Math.abs(score)) * (score <= 0 ? -1 : 1);
        engine.score = score;
        if (matches.length > 5) {
          var pv = matches[5].split(" ");
          if (info != null && engine.fen == fen) info(depth, score, pv);
        }
      }
      if (str.indexOf("bestmove") >= 0 || str.indexOf("mate 0") >= 0 || str == "info depth 0 score cp 0") {
        if (engine.fen == fen) done(str);
        engine.lastnodes = 0;
      }
    });
  };
  engine.send("uci", function onuci(str) {
    if (str === "uciok") {
      engine.send("isready", function onready(str) {
        if (str === "readyok") engine.ready = true;
      });
    }
  });
  return engine;
}
function makeEngineMove (makeMove) {
	_engine.kill = false;
	_engine.waiting = false;
	_engine.send("stop");
	_engine.send("ucinewgame");
	var e = document.getElementById("sel1");
	var level = e.options[e.selectedIndex].value;
	_engine.send("setoption name Skill Level value " + level); 
	_engine.score = null;
	_engine.eval(game.fen(), function done(str) {
	  _engine.waiting = true;
	  
	  var matches = str.match(/^bestmove\s(\S+)(?:\sponder\s(\S+))?/);
	  if (matches && matches.length > 1) {
		var source  = matches[1][0] + matches[1][1] 
		var target  = matches[1][2] + matches[1][3]  
		//console.log(source)
		//console.log(target)
		if(makeMove == 1) {
			var move = game.move({
			from: source,
			to: target,
			promotion: 'q' // NOTE: always promote to a queen for example simplicity
		  })

		  // illegal move
		  if (move === null) return 'snapback'
		  board.position(game.fen())
		  updateStatus()
		  //console.log(getStaticEvalList(game.fen()))
		}
		
	  }
	},function info(depth, score, pv) {
        if(depth == sdepth) {
			console.log(score)
			//document.getElementById("cpscore").innerHTML = " CP score: " + score/100;
		}
      });
	
	
}


var input = document.getElementById("move");
    input.addEventListener("keypress", function(event) {
      if (event.keyCode === 13) {
       event.preventDefault();
       document.getElementById("submit").click();
      }
    });

let myLink = document.getElementById('meta')
myLink.addEventListener('auxclick', function(e) {
  if (e.button == 1) {
    MakeMove()
  }
})
_engine = loadEngine();
newGame()