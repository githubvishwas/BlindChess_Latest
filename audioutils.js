var audioSupport = 1;

try {
  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  var recognition = new SpeechRecognition();
}
catch(e) {
  console.error(e);
  audioSupport = 0
  var b1 = document.getElementById("start-record-btn");
  b1.style.display = 'none'
}
if (audioSupport == 1) {
	
	var audio_move_map = new Map(
		[
			["knight", "N"],
			["night", "N"], 
			["bishop", "B"],
			["bisup", "B"],
			["queen","Q"],
			["king","K"],
			["rook","R"],
			["ruk","R"],
			["mi","e"],
			["takes","x"],
			["shortcastle","O-O"],
			["longcastle","O-O-O"],
			["83","a3"],
			["bp","b5"],
			["dp","d5"],
			["depot","d4"],
			["before","b4"],
			["befur","b4"],
			["text","x"],
			["the","d"],
			["intex","Kx"],
			["apple","a"],
			["ball","b"],
			["cat","c"],
			["dog","d"],
			["elephant","e"],
			["fish","f"],
			["grapes","g"],
			["hen","h"],
			["beeffry","Bf5"],
			["take","x"],
			["ate","8"],
			["de","d"],
			["fy","5"],
			["fi","5"],
			["file","5"],
			["define","d5"],
			["defile","d5"],
			["defy","d5"],
			["pi","5"],
			["date","d8"],
			["fight","5"],
			["to","2"],
			["tex","x"],
			["b-tex","bx"],
			["bi","b"],
			["be","b"],
			["for","4"],
			["anna","a"],
			["belia","b"],
			["ceasar","c"],
			["david","d"],
			["eva","e"],
			["felix","f"],
			["gustav","g"],
			["hector","h"],
			["eins","1"],
			["zwei","2"],
			["drei","3"],
			["vier","4"],
			["fnf","5"],
			["sechs","6"],
			["sieben ","7"],
			["acht","8"],
			["detects","dx"]
		]
	);
	var moves = [ 'knight' , 
	'bishop' , 
	'queen', 
	'king', 
	'side', 
	'shortcastle', 
	'longcastle', 
	'takes', 
	'check', 
	'checkmate', 
	'a', 
	'b', 
	'c', 
	'd', 
	'e', 
	'f', 
	'g', 
	'h', 
	'1', 
	'2', 
	'3', 
	'4', 
	'5', 
	'6', 
	'7', 
	'8',
	'anna',
	'belia',
	'ceasar',
	'david',
	'eva',
	'felix',
	'gustav',
	'hector',
	'eins',
	'zwei',
	'drei',
	'vier',
	'fnf',
	'sechs',
	'sieben',
	'acht',
	'a1',
	'a2',
	'a3',
	'a4',
	'a5',
	'a6',
	'a7',
	'a8',
	'b1',
	'b2',
	'b3',
	'b4',
	'b5',
	'b6',
	'b7',
	'b8',
	'c1',
	'c2',
	'c3',
	'c4',
	'c5',
	'c6',
	'c7',
	'c8',
	'd1',
	'd2',
	'd3',
	'd4',
	'd5',
	'd6',
	'd7',
	'd8',
	'e1',
	'e2',
	'e3',
	'e4',
	'e5',
	'e6',
	'e7',
	'e8',
	'f1',
	'f2',
	'f3',
	'f4',
	'f5',
	'f6',
	'f7',
	'f8',
	'g1',
	'g2',
	'g3',
	'g4',
	'g5',
	'g6',
	'g7',
	'g8',
	'h1',
	'h2',
	'h3',
	'h4',
	'h5',
	'h6',
	'h7',
	'h8'];
	
	
	
	
	
	

	
	
	
	
	var grammar = '#JSGF V1.0; grammar moves; public <move> = ' + moves.join(' | ') + ' ;'

	var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
	var speechRecognitionList = new SpeechGrammarList();
	speechRecognitionList.addFromString(grammar, 1);
	recognition.grammars = speechRecognitionList;
	recognition.lang = navigator.languages[0];
	recognition.interimResults = false;
	recognition.maxAlternatives = 10;
	
	audio_keys = Array.from( audio_move_map.keys() );
	// If false, the recording will stop after a few seconds of silence.
	// When true, the silence period is longer (about 15 seconds),
	// allowing us to keep recording even when the user pauses. 
	recognition.continuous = true;
	// Fired when an error happens with the speech recognition
	recognition.onerror = function(event) {
		return;
	};
	// This block is called every time the Speech APi captures a line. 
	recognition.onresult = function(event) {

		// event is a SpeechRecognitionEvent object.
		// It holds all the lines we have captured so far. 
		// We only need the current one.
		var current = event.resultIndex;

		// Get a transcript of what was said.

		var transcript = event.results[current][0].transcript;
		
		var all_transcripts = []	
		// Add the current transcript to the contents of our Note.
		// There is a weird bug on mobile, where everything is repeated twice.
		// There is no official solution so far so we have to handle an edge case.
		var mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);
		//mobileRepeatBug = 0;
		if(mobileRepeatBug) {
			return
		}

		
		for (let i = 0, len = event.results.length; i < len; i++) {
			for (let j = 0, len = event.results[i].length; j < len; j++) {
				let transcript1 = event.results[i][j].transcript;
				all_transcripts.push(transcript1)
			}
		}
		
		var movefound = 0
		var options_tried = []
		for (index = 0; index < all_transcripts.length; index++) { 
			
			mv = all_transcripts[index].toLowerCase().replace(/\s/g, '');
			var ret = game.move(mv);
			if (ret === null) {
				options_tried.push(mv)
				var arrayLength = audio_keys.length;
				mv1 = mv;
				for (var i = 0; i < arrayLength; i++) {
					if (mv1 == audio_keys[i]) {
						mv = audio_move_map.get(audio_keys[i]);
						break;
					} else if (mv1.includes(audio_keys[i])) {
						mv = mv.replace(audio_keys[i],audio_move_map.get(audio_keys[i]));
					} 
				}
				var ret1 = game.move(mv);
				if (ret1 === null) {
					options_tried.push(mv)
					moveFound = 0;
				} else {
					moveFound = 1;
					break;
				}
				
			} else {
				moveFound = 1;
				break;
			}
		} 
		if (moveFound == 0) {
			var arrayLength = audio_keys.length;
			mv1 = mv;
			for (var i = 0; i < arrayLength; i++) {
				if (soundex(mv1) == soundex(audio_keys[i])) {
					mv = audio_move_map.get(audio_keys[i]);
					var ret1 = game.move(mv);
					if (ret1 === null) {
						options_tried.push(mv)
						moveFound = 0;
					} else {
						moveFound = 1;
						updateStatus();
						getMove();
						ClearMove()
						moveAudio.play()
						if (!isTouchDevice()) {
							document.getElementById("move").focus();
						}
						return
					}
				} 
			}
			var possibleMoves = game.moves()
			for (let i = 0, len = options_tried.length; i < len; i++) {
				for (let j = 0, len = possibleMoves.length; j < len; j++) {
					if (options_tried[i].includes(possibleMoves[j]) || possibleMoves[j].includes(options_tried[i])) {
						mv = possibleMoves[j];
						var ret1 = game.move(mv);
						if (ret1 === null) {
							options_tried.push(mv)
							moveFound = 0;
						} else {
							moveFound = 1;
							updateStatus();
							getMove();
							ClearMove()
							moveAudio.play()
							if (!isTouchDevice()) {
								document.getElementById("move").focus();
							}
							return
						}
					} 
				}
			}
			alert("Illegal move! We tried " + options_tried + "\nBest confidence level was " + event.results[0][0].confidence);
			ClearMove()
			if (!isTouchDevice()) {
				document.getElementById("move").focus();
			}
			return;
		}
		updateStatus();

		getMove();
		ClearMove()
		moveAudio.play()
		if (!isTouchDevice()) {
			document.getElementById("move").focus();
		}

	};
		
	recognition.onstart = function() { 
	  var b1 = document.getElementById("start-record-btn");
	   b1.style.color = 'green'
	}

	recognition.onend = function() {
	  var b1 = document.getElementById("start-record-btn");
				 b1.style.color = 'red'
	}
	document.body.ondblclick = function() {
  
	  recognition.start();
	}
	$('#start-record-btn').on('click', function(e) {
		
	  recognition.start();
	});
}