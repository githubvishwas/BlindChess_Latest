var START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
var _engine, _curmoves = [];
var _history = [[START]], _history2 = null, _historyindex = 0;
var _flip = false, _edit = false, _info = false, _play = null;
var _arrow = false, _menu = false;
var _dragElement = null, _dragActive = false, _startX, _startY, _dragCtrl, _dragLMB, _clickFrom, _clickFromElem;
var _tooltipState = false, _wantUpdateInfo = true;;
var _wname = "White", _bname = "Black", _color = 0, _bodyScale = 1;
var _nncache = null;

var board,
  game = new Chess(),
  statusEl = $('#status'),
  //fenEl = $('#fen'),
  pgnEl = $('#pgn'),
  toggleEI = $('#toggle'),
  colorsEI = $('#col1');
  console.log("this is new code10");
  var elem = document.getElementById('col1');
  console.log(elem.selectedIndex);
//document.getElementById("status").innerHTML = "this is new code";

// do not pick up pieces if the game is over
// only pick up pieces for the side to move









var getMove = function () {
	
    window.setTimeout(makeBestMove, 250);
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

    window.setTimeout(makeBestMove, 250);
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
    status = 'Game over, ' + moveColor + ' is in checkmate.';
  }

  // draw?
  else if (game.in_draw() === true) {
    status = 'Game over, drawn position';
  }

  // game still on
  else {
    status = moveColor + ' to move';

    // check?
    if (game.in_check() === true) {
      status += ', ' + moveColor + ' is in check';
    }
  }

  setStatus(status);
  
  //createTable();
  //updateScroll();

  statusEl.html(status);
  //fenEl.html(game.fen());
  
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
setTimeout(function() {

    board = ChessBoard('board', cfg);
//    updateStatus();
}, 0);




var createTable = function() {

    var pgn = game.pgn().split(" ");

    var data = [];

    for (i = 0; i < pgn.length; i += 3) {
        var index = i / 3;
        data[index] = {};
        for (j = 0; j < 3; j++) {
            var label = "";
            if (j === 0) {
                label = "moveNumber";
            } else if (j === 1) {
                label = "whiteMove";
            } else if (j === 2) {
                label = "blackMove";
            }
            if (pgn.length > i + j) {
                data[index][label] = pgn[i + j];
            } else {
                data[index][label] = "";
            }
        }
    }
    //console.log(data)
    $('#pgn tr').not(':first').remove();
    var html = '';
    for (var i = 0; i < data.length; i++) {
                html += '<tr><td>' + data[i].moveNumber + '</td><td>'
                + data[i].whiteMove + '</td><td>'
                + data[i].blackMove + '</td></tr>';
    }
    //console.log(html)
    $('#pgn tr').first().after(html);
}

var updateScroll = function() {
    $('#moveTable').scrollTop($('#moveTable')[0].scrollHeight);
}

var setStatus = function(status) {
  //document.getElementById("status").innerHTML = status;
}



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
  var engine = {ready: false, kill: false, waiting: true, depth: 10, lastnodes: 0};
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
        if(depth == 10) {
			console.log(score)
			//document.getElementById("cpscore").innerHTML = " CP score: " + score/100;
		}
      });
	
	
}
_engine = loadEngine();




