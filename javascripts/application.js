// =============  Harmonic logic ==================
var chords = {
	minor: [3, 7],
	major: [4, 7],
	diminished: [3, 6]
};

var scales= {
	major: { noteDistances: [2, 4, 5, 7, 9, 11], chordTypes: ["major", "minor", "minor", "major", "major", "minor", "diminished"] },
};

var nns = {
    "C" : 0 , 0 : "C" ,
    "C#": 1 , 1 : "C#",
    "D" : 2 , 2 : "D" ,
    "D#": 3 , 3 : "D#",
    "E" : 4 , 4 : "E" ,
    "F" : 5 , 5 : "F" ,
    "F#": 6 , 6 : "F#",
    "G" : 7 , 7 : "G" ,
    "G#": 8 , 8 : "G#",
    "A" : 9 , 9 : "A" ,
    "A#": 10, 10: "A#",
    "B" : 11, 11: "B"
};

var dns = {
    "I"  : 0 , 0 : "I" ,
    "II" : 1 , 1 : "II",
    "III": 2 , 2 : "III" ,
    "IV" : 3 , 3 : "IV",
    "V"  : 4 , 4 : "V" ,
    "VI" : 5 , 5 : "VI" ,
    "VII": 6 , 6 : "VII",
};

function getNotes(base, type) {
	var notes = [base];
	for (var i = 0; i < type.length; i++) {
		notes.push((base + type[i])%12);
	}
	return notes;
}

function getTriadByScale (base, scale) {
    var notes = [base];
    console.log("base", base);
    console.log("scale", scale);
    if (scale.indexOf(base) < 0) {
        console.log("Base not in scale");
        return;
    } else {
        for (var i = 1; i <= 2; i++) {
            notes.push(scale[(scale.indexOf(base) + i*2) % scale.length]);
        }
    }
    console.log("notes", notes);
    return notes;
}



// ===================== Sampler ==================================
var smpl = {
	piano: {},
	guitar: {},
	strings: {}
};

smpl.piano.notes = [];
for (var i = 0; i < 12; i++) {
	smpl.piano.notes[i] = new Audio("./samples/2mp/piano/mcg_f_0" + (60 + i) + ".ogg");
}

smpl.piano.cadence = [];
for (var i = 0; i < 12; i++) {
	smpl.piano.cadence[i] = new Audio("./samples/05mp/piano/mcg_f_0" + (60 + i) + ".ogg");
}

smpl.piano.bass = [];
for (var i = 0; i < 12; i++) {
	smpl.piano.bass[i] = new Audio("./samples/2mp/piano/mcg_f_0" + (48 + i) + ".ogg");
}

smpl.guitar.notes = [];
for (var i = 0; i < 12; i++) {
	smpl.guitar.notes[i] = new Audio("./samples/2mp/guitar/pwrchord_" + (1 + i) + ".ogg");
}

smpl.guitar.cadence = [];
for (var i = 0; i < 12; i++) {
	smpl.guitar.cadence[i] = new Audio("./samples/05mp/guitar/pwrchord_" + (1 + i) + ".ogg");
}

smpl.strings.notes = [];
for (var i = 0; i < 12; i++) {
	smpl.strings.notes[i] = new Audio("samples/2mp/strings/string_0" + (84 + i) + ".ogg");	
}

smpl.strings.bass = [];
for (var i = 0; i < 12; i++) {
	smpl.strings.bass[i] = new Audio("./samples/2mp/strings/string_0" + (72 + i) + ".ogg");
}

smpl.strings.cadence = [];
for (var i = 0; i < 12; i++) {
	smpl.strings.cadence[i] = new Audio("./samples/05mp/strings/string_0" + (72 + i) + ".ogg");
}

/**
* @param notes is an array of chromatic notes
*/

function playNotes (notes, instrument) {
    if (notes) {
    	if (smpl[instrument].bass) {
        	smpl[instrument].bass[notes[0]].currentTime = 0;
        	smpl[instrument].bass[notes[0]].play();
    	}
        for (var i = 0; i < notes.length; i++) {
            smpl[instrument].notes[notes[i]].currentTime = 0;
            smpl[instrument].notes[notes[i]].play();
        }
    } else {
        console.log("No notes were given");
    }
}

function playCadenceNotes (notes, instrument) {
    if (notes) {
        for (var i = 0; i < notes.length; i++) {
            smpl[instrument].cadence[notes[i]].currentTime = 0;
            smpl[instrument].cadence[notes[i]].play();
        }
    } else {
        console.log("No notes were given");
    }
}

// function stopNotes (notes) {
// 	if (notes.constructor !== Array) {
// 		notes = [notes];
// 	}
// 	for (var i = 0; i < notes.length; i++) {
// 		smpl.piano[notes[i]].pause();
// 	}
// }

function stopAllPlaying() {
 	callOnAllSamples("pause");
} 

function getNames (notes) {
	var noteNames = [];
	for (var i = 0; i < notes.length; i++) {
		noteNames.push(nns[notes[i]]);
	}
	return noteNames;
}



// ========== Main functions ============
var toutCadence;
var states = [stepPlay, stepShow];
var actState = 0;
var actNotes = [];
var actChords = [];
var actVolume = 0.3;
var selectedInstruments = ["piano"];
var actScale = getNotes(nns.C, scales.major.noteDistances);
var random;

// var allowedDegrees = [0, 1, 3, 4, 5, 6, 7];
// var allowedDegrees = [0, 3, 4];

var btnNext = document.getElementById("btnNext");
var btnRepeat = document.getElementById("btnRepeat");
var btnCadence = document.getElementById("btnCadence");
var lblChordName = document.getElementById("chordName");
var sctInstruments = document.getElementById("sctInstruments");
var ctrChord = document.getElementById("chord-container");
var rngeVolume = document.getElementById("rngeVolume");

for (i in smpl) {
	var optInstrument = document.createElement("option");
	optInstrument.value = i;
	optInstrument.innerHTML = i;
	sctInstruments.appendChild(optInstrument);
}

btnNext.focus();
init();
rngeVolume.value = actVolume * 100;




// ==
function init (options) {
	var i;

	while (ctrChord.firstChild) {
	    ctrChord.removeChild(ctrChord.firstChild);
	}

	function evlrPlayChord (event) {
		playChord(event.srcElement.dataset.degree);
	}

	for (i = 0; i < actScale.length; i++) {
		var btnChord = document.createElement("div");
		btnChord.dataset.degree = i;
		btnChord.className = "btn chord";
		btnChord.innerHTML = nns[actScale[i]] + " " + dns[i];
		btnChord.addEventListener("click", evlrPlayChord);
		ctrChord.appendChild(btnChord);
	}

	setOnAllSamples("volume", actVolume);



	sctInstruments.options[0].selected = "selected";
}

/**
 * Plays a chord based on a diatonic scale degree
 * @param  {number} base diatonic degree
 */
function playChord (base) { 
		stopAllPlaying();
		clearTimeout(toutCadence);

		var notes = getTriadByScale(actScale[base], actScale);
	    
	    console.log("Chord Played: ", getNames(actNotes));
	    console.log("");
	    for (var i = 0; i < selectedInstruments.length; i++) {
	    	if (selectedInstruments[i] === "guitar") {
	    		playNotes([notes[0]],  selectedInstruments[i]);	
	    	} else {
			    playNotes(notes, selectedInstruments[i]);	
	    	}
	    }
}

function playCadence () {

	stopAllPlaying();
	clearTimeout(toutCadence);


	// Guitars only have whole chord samples, no need to get individual notes
	var tons = getTriadByScale(actScale[0], actScale);
	var subs = getTriadByScale(actScale[3], actScale);
	var doms = getTriadByScale(actScale[4], actScale);

	for (var i = 0; i < selectedInstruments.length; i++) {
    	if (selectedInstruments[i] === "guitar") {
    		playCadenceNotes([tons[0]],  selectedInstruments[i]);	
    	} else {
		    playCadenceNotes(tons, selectedInstruments[i]);	
    	}
    }
	toutCadence = setTimeout(function () {
		stopAllPlaying();
		for (var i = 0; i < selectedInstruments.length; i++) {
	    	if (selectedInstruments[i] === "guitar") {
	    		playCadenceNotes([subs[0]],  selectedInstruments[i]);	
	    	} else {
			    playCadenceNotes(subs, selectedInstruments[i]);	
	    	}
	    }
		toutCadence = setTimeout(function () {
			stopAllPlaying();
			for (var i = 0; i < selectedInstruments.length; i++) {
		    	if (selectedInstruments[i] === "guitar") {
		    		playCadenceNotes([doms[0]],  selectedInstruments[i]);	
		    	} else {
				    playCadenceNotes(doms, selectedInstruments[i]);	
		    	}
		    }
			toutCadence = setTimeout(function () {
				stopAllPlaying();
				for (var i = 0; i < selectedInstruments.length; i++) {
			    	if (selectedInstruments[i] === "guitar") {
			    		playCadenceNotes([tons[0]],  selectedInstruments[i]);	
			    	} else {
					    playCadenceNotes(tons, selectedInstruments[i]);	
			    	}
			    }
				toutCadence = setTimeout(function () {
					stopAllPlaying();
				},510);
			},510);
		},510);
	},510)
;}

function repeat () {
	stopAllPlaying();
	clearTimeout(toutCadence);
    
    console.log("Chord Played: ", getNames(actNotes));
    console.log("");
	for (var i = 0; i < selectedInstruments.length; i++) {
    	if (selectedInstruments[i] === "guitar") {
    		playNotes([actNotes[0]],  selectedInstruments[i]);	
    	} else {
		    playNotes(actNotes, selectedInstruments[i]);	
    	}
    }

}

function stepPlay () {
	console.log("NEW ROUND:");
	stopAllPlaying();
	clearTimeout(toutCadence);
    lblChordName.innerHTML = "?";

    if (allowedDegrees.length === 1) {
    	random = allowedDegrees[0];
    } else {
	    var newRandom = Math.floor(Math.random()* 7 );
	    while( (random === newRandom) || (allowedDegrees.indexOf(newRandom) < 0)  ){
	    	newRandom = Math.floor(Math.random()* 7 );
	    }
	    random = newRandom;
    }
    

    // Guitar samples only have whole powerchords, so no need to get note series
   	actNotes = getTriadByScale(actScale[random],actScale);
    
    console.log("Chord Played: ", getNames(actNotes));
    console.log("");

    for (var i = 0; i < selectedInstruments.length; i++) {
    	if (selectedInstruments[i] === "guitar") {
    		playNotes([actNotes[0]],  selectedInstruments[i]);	
    	} else {
		    playNotes(actNotes, selectedInstruments[i]);	
    	}
    }

	actState = (actState +1) % states.length;
}

function stepShow () {
    lblChordName.innerHTML = dns[random];
	actState = (actState +1) % states.length;
}

function next () {
	states[actState](actScale);
}

// Nyeh.....................ttt

function setOnAllSamples (myVariable, arg1) {
	 for (var i in smpl) {
 		for (var j in smpl[i]) {
 			for (var k = 0; k < smpl[i][j].length; k++) {
 				smpl[i][j][k][myVariable] = arg1;
 			}
 		}
 	}
}

function callOnAllSamples (myFunc, arg1, arg2, arg3, arg4) {
	 for (var i in smpl) {
 		for (var j in smpl[i]) {
 			for (var k = 0; k < smpl[i][j].length; k++) {
 				smpl[i][j][k][myFunc](arg1, arg2, arg3, arg4);
 			}
 		}
 	}
}

function changeScale (event) {
	actScale = getNotes(nns[event.value], scales.major.noteDistances);
	init();
}

function selectInstruments (sel) {
	var opts = [];

	for (var i = 0; i < sel.options.length; i++) {
		if (sel.options[i].selected) {
			opts.push(sel.options[i].value);
		}
	}

	selectedInstruments = opts;
}

function selectDegrees (sel) {
	var opts = [];

	for (var i = 0; i < sel.options.length; i++) {
		if (sel.options[i].selected) {
			opts.push(parseInt(sel.options[i].value));
		}
	}

	allowedDegrees = opts;
}

function setVolume (event) {
	console.log(event.value);
	setOnAllSamples("volume", event.value/100);
}

// =============  Bindings

btnNext.onclick = function () {
	next();
};
btnRepeat.onclick = function () {
	repeat();
};
btnCadence.onclick = function () {
	playCadence();
};

var allBtn = document.getElementsByClassName("btn");
for (var i = 0; i < allBtn.length; i++) {
	allBtn[i].onkeyup = listenKybd;
}

function listenKybd (event) {
	if ([13, 32].indexOf(event.keyCode) > -1) {
		this.click();
	}
}

document.body.onkeydown = function (event) {
	var key = event.keyCode || event.which;
	if (key < 56) {
		playChord(key-49);
	}
};

