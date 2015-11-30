// =================================================================================================================================================================
// ======================================================================     Sampler    ===========================================================================
// =================================================================================================================================================================

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

function stopAllPlaying() {
 	callOnAllSamples("pause");
} 

// =================================================================================================================================================================
// ======================================================================  Music Logic  ===========================================================================
// =================================================================================================================================================================

var chords = {
	major: {
		notes    : [4, 7],
		jazzNot  : "",
		classNot : ""
	},
	minor: {
		notes    : [3, 7],
		jazzNot  : "m",
		classNot : ""
	},
	diminished: {
		notes    : [3, 6],
		jazzNot  : "dim",
		classNot : "°"
	},
	dominant: {
		notes    : [4, 7, 10],
		jazzNot  : "7",
		classNot : "7"
	},
	sus2: {
		notes    : [2, 7],
		jazzNot  : "sus2",
		classNot : "sus2"
	},
	sus4: {
		notes    : [5, 7],
		jazzNot  : "sus4",
		classNot : "sus4"
	},
	major6: {
		notes    : [4, 7, 9],
		jazzNot  : "6",
		classNot : "6"
	},
	minor6: {
		notes    : [3, 7, 9],
		jazzNot  : "m6",
		classNot : "m6"
	}
};

var scales= {
	major: { 
		noteDistances : [2, 4, 5, 7, 9, 11],
		chordTypes    : ["major", "minor", "minor", "major", "major", "minor", "diminished"] },
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
    "I"  : 0  , 0  : "I" ,
    "II" : 2  , 2  : "II",
    "III": 4  , 4  : "III" ,
    "IV" : 5  , 5  : "IV",
    "V"  : 7  , 7  : "V" ,
    "VI" : 9  , 9  : "VI" ,
    "VII": 11 , 11 : "VII",
};

var extdns = {
    "I#"  : 1  , 1  : "I#" ,
    "II#" : 3  , 3  : "II#",
    "IV#" : 6  , 6  : "IV#",
    "V#"  : 8  , 8  : "V#" ,
    "VI#" : 10 , 10 : "VI#" ,
};

// Get chromatic notes based on a @base note, and a scale or chord @type
function getNotes(base, type) {
	var notes = [mod(base, 12)];
	for (var i = 0; i < type.length; i++) {
		notes.push( mod((base + type[i]), 12));
	}
	return notes;
}
// If given a @scale, count down 2 triads from @base 
// function getTriadByScale (base, scale) {
//     var notes = [base];
//     console.log("base", base);
//     console.log("scale", scale);
//     if (scale.indexOf(base) < 0) {
//         console.log("Base not in scale");
//         return;
//     } else {
//         for (var i = 1; i <= 2; i++) {
//             notes.push(scale[(scale.indexOf(base) + i*2) % scale.length]);
//         }
//     }
//     console.log("notes", notes);
//     return notes;
// }

// Get names based on chromatic @notes 
function getNames (notes) {
	var noteNames = [];
	for (var i = 0; i < notes.length; i++) {
		noteNames.push(nns[notes[i]]);
	}
	return noteNames;
}





// =================================================================================================================================================================
// ====================================================================== Main functions ===========================================================================
// =================================================================================================================================================================

var toutCadence;
var states = [stepPlay, stepShow];
var actState = 0;
var actChords = []; // Chords chosen
var actChord = 0; // actChords id
var actVolume = 1;
var selectedInstruments = ["piano"];
var actScaleBase = "C";
var actScaleType = "major";
var actScale;
var chordType2Colum = {};
var tableDegrees = ["I","I#","II","II#","III","IV","IV#","V","V#","VI","VI#","VII"];
var localData = localStorage && localStorage.chordplayer && JSON.parse(localStorage.chordplayer);
var chordmatrix;

var btnNext = document.getElementById("btnNext");
var btnRepeat = document.getElementById("btnRepeat");
var btnCadence = document.getElementById("btnCadence");
var btnInitExercise = document.getElementById("btnInitExercise");
var btsaveExercise = document.getElementById("btsaveExercise");
var lblChordName = document.getElementById("chordName");
var sctInstruments = document.getElementById("sctInstruments");
var cntrChord = document.getElementById("chord-container");
var rngeVolume = document.getElementById("rngeVolume");
var chordtable = document.getElementById("chordtable");
var sctScale = document.getElementById("sctScale");
var chordtableplay = document.getElementById("chordtableplay");



init();

function init () {
	var i;
	// Init instrument select box
	for (i in smpl) {
		var optInstrument = document.createElement("option");
		optInstrument.value = i;
		optInstrument.innerHTML = i;
		sctInstruments.appendChild(optInstrument);
	}

	// Load selected chords from localStorage, or default;
	if (localData) {
		chordmatrix = localData.chordmatrix;
		actScaleBase = localData.actScaleBase || "C";
		actScaleType = localData.actScaleType || "major";
	} else {
		chordmatrix = [];
		for (i = 0; i < 12; i++) {
			var chordsLength = Object.keys(chords).length;
			chordmatrix[i] = [];
			for (var j = 0; j < chordsLength; j++) {
				chordmatrix[i].push(0);
			}
		}
		chordmatrix[0][0]  = 1;
		chordmatrix[2][1]  = 1;
		chordmatrix[4][1]  = 1;
		chordmatrix[5][0]  = 1;
		chordmatrix[7][0]  = 1;
		chordmatrix[9][1]  = 1;
		chordmatrix[11][2] = 1;
	}
	actScale = getNotes(nns[actScaleBase], scales[actScaleType].noteDistances);

	initChordtable();
	initExercise();
	
		
	// Preselect <select> elements and prepare ui
	
	rngeVolume.value = actVolume * 100;
	setOnAllSamples("volume", actVolume);
	sctScale.options[nns[actScaleBase]].selected = "selected";
	sctInstruments.options[0].selected = "selected";
	btnNext.focus();
	
}


function initExercise (options) {
	var i;

	saveChordMatrix();

	// Fill up actChords, based on cordtable
	actChords = [];
	for (i = 0; i < chordmatrix.length; i++) {
		for (var j = 0; j < chordmatrix[i].length; j++) {
			if (chordmatrix[i][j]) {
				var base = mod(actScale[0] + i,12);
				actChords.push({
					degree: i,
					base: base,
					type: chordtable.rows[i+1].cells[j + 1].dataset.type,
					notes: getNotes(base, chords[chordType2Colum[j]].notes),
				});
			}
		}
	}

	actChords.sort(actChords);

	// Build buttons
	 while (cntrChord.firstChild) {
	    cntrChord.removeChild(cntrChord.firstChild);
	}

	function evlrPlayChord (event) {
		var notes = actChords[parseInt(event.srcElement.dataset.i)].notes;
		stopAllPlaying();
		mainPlayNotes(notes);

	}
	for (i = 0; i < actChords.length; i++) {
		var btnChord = document.createElement("div");
		var label = generateLabel(actChords[i]);
		btnChord.dataset.i = i;
		btnChord.className = "btn chord" + label.class;
		btnChord.innerHTML = label.label;
		btnChord.addEventListener("click", evlrPlayChord);
		cntrChord.appendChild(btnChord);
	}
}

function initChordtable () {
	// Prepare chordtable
	chordtable.innerHTML = "";
	var theader = chordtable.createTHead();
	var tbody = chordtable.createTBody();
	var row = theader.insertRow(0);    
	var cell = row.insertCell(0);
	var rowLength = 0;

	// Head
	for (var j in chords) {
		chordType2Colum[rowLength] = j;
		cell = row.insertCell(-1);
		cell.innerHTML = j;
		rowLength++;
	}
	// Body
	for (i = 0; i < 12; i++) {
		row = tbody.insertRow(-1);
		cell = row.insertCell(-1);
		cell.innerHTML = tableDegrees[i];

		for (j = 0; j < rowLength; j++) {
			cell = row.insertCell(-1);
			cell.dataset.type = theader.rows[0].cells[j+1].innerHTML;
			if (chordmatrix[i][j]) {
				cell.dataset.selected = 1;
				cell.style.backgroundColor = "red";
			} else {
				cell.dataset.selected = 0;
			}
			cell.dataset.degree = i;
			cell.dataset.cmxcol = j;
			cell.onclick = evlrChordTable;
			cell.innerHTML = nns[mod(i + actScale[0], 12)] + chords[theader.rows[0].cells[j+1].innerHTML].jazzNot;	
		}
	}

	function evlrChordTable () {
		if (chordtableplay.checked) {
			stopAllPlaying();
			var notes = getNotes(parseInt(this.dataset.degree + actScale[0]), chords[this.dataset.type].notes);
			mainPlayNotes(notes);
		} else {
			var selectedInt = mod(parseInt(this.dataset.selected) + 1, 2);
			chordmatrix[this.dataset.degree][this.dataset.cmxcol] = selectedInt;
			if (selectedInt) {
				this.style.backgroundColor = "red";
			} else {
				this.style.backgroundColor = "white";
			}
			this.dataset.selected = selectedInt;
		}
	}
}

function generateLabel (chord) {
	var out = getDegree(chord);
	var lbelDegree = out.label;
	var lbelBase = nns[chord.base];
	var lbelJazz = chords[chord.type].jazzNot;
	var lbelClass = chords[chord.type].classNot;
	return { 
		class: out.class, 
		label: lbelDegree + lbelClass + "<br>" + lbelBase + lbelJazz
	};
}

// Generates the classical notation degree basd eon a chord object !!!Also sets the external class if neededttt
function getDegree (chord) {
	var out = {};
	// Normalize
	var baseNorm = mod(chord.base - actScale[0], 12);
	var degree = actScale.indexOf(chord.base);

	// Count stuff
	if (dns[baseNorm]) {
		out.label = dns[baseNorm];
		out.class = "";
		if (scales[actScaleType].chordTypes[degree] !== chord.type) {
			out.class = " external";
		}
	} else if (extdns[baseNorm]){
		out.label = extdns[baseNorm];
		out.class = " external";
	} else {
		return console.log("Something wrong in the getDegree function");
	}
	if ("minor" ===	 chord.type || "diminished" === chord.type) {
		out.label = out.label.toLowerCase();
	}
	return out;
}


/**
 * Plays a chord based on a diatonic scale degree
 * @param  {number} base diatonic degree
 */
function playChord (notes) { 
		stopAllPlaying();
		clearTimeout(toutCadence);
	    
	    console.log("Chord Played: ", getNames(notes));
	    console.log("");
		mainPlayNotes(notes);
}

function playCadence () {

	stopAllPlaying();
	clearTimeout(toutCadence);


	// Guitars only have whole chord samples, no need to get individual notes
	var tons = getNotes(actScale[0], chords[scales[actScaleType].chordTypes[0]].notes);
	var subs = getNotes(actScale[3], chords[scales[actScaleType].chordTypes[3]].notes);
	var doms = getNotes(actScale[4], chords[scales[actScaleType].chordTypes[4]].notes);

	mainPlayNotes(tons);
	toutCadence = setTimeout(function () {
		stopAllPlaying();
		mainPlayNotes(subs);
		toutCadence = setTimeout(function () {
			stopAllPlaying();
			mainPlayNotes(doms);
			toutCadence = setTimeout(function () {
				stopAllPlaying();
				mainPlayNotes(tons);
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
    var notes = actChords[actChord].notes;
	mainPlayNotes(notes);

}

function stepPlay () {
	console.log("NEW ROUND:");
	stopAllPlaying();
	clearTimeout(toutCadence);
    lblChordName.innerHTML = "	?	";

    // if (allowedDegrees.length === 1) {
    	// random = allowedDegrees[0];
    // } else {
	    var newRandom = Math.floor(Math.random() * actChords.length );
	    // while( (random === newRandom) || (allowedDegrees.indexOf(newRandom) < 0)  ){
	    while( (actChord === newRandom)  ){
	    	newRandom = Math.floor(Math.random() * actChords.length );
	    }
	    actChord = newRandom;
    // }
    

    // Guitar samples only have whole powerchords, so no need to get note series
   	actNotes = actChords[actChord].notes;
    
    console.log("Chord Played: ", getNames(actNotes));
    console.log("");

    mainPlayNotes(actNotes);

	actState = (actState +1) % states.length;
}

function stepShow () {
	var label = generateLabel(actChords[actChord]);
	var labelSplit = label.label.split("<br>");
    lblChordName.innerHTML = labelSplit[1] + " " + labelSplit[0];
	actState = (actState +1) % states.length;
}

function next () {
	states[actState](actScale);
}

// Nyeh.....................ttt

function mainPlayNotes (notes) {
	for (var i = 0; i < selectedInstruments.length; i++) {
    	if (selectedInstruments[i] === "guitar") {
    		playNotes([notes[0]],  selectedInstruments[i]);	
    	} else {
		    playNotes(notes, selectedInstruments[i]);	
    	}
    }
}

function saveChordMatrix() {
	if (localStorage) {
		var cm2bSaved = {};
		if (localStorage.chordplayer) {
			cm2bSaved = JSON.parse(localStorage.chordplayer);
		}
		cm2bSaved.chordmatrix = chordmatrix;
		localStorage.chordplayer = JSON.stringify(cm2bSaved);
	}
}


function sortChords(a, b) {
    if (a.base === b.base) {
        return 0;
    }
    else {
        return (a.base < b.base) ? -1 : 1;
    }
}

function mod (x, m) {
	return (x + m) % m;
}

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



function selectInstruments (sel) {
	var opts = [];

	for (var i = 0; i < sel.options.length; i++) {
		if (sel.options[i].selected) {
			opts.push(sel.options[i].value);
		}
	}

	selectedInstruments = opts;
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
btnInitExercise.onclick = function () {
	initExercise();
};

sctScale.onchange = function changeScale() {
	actScaleBase = this.value;
	var data2bSaved;
	if (localStorage) {
		if (localStorage.chordplayer) {
			data2bSaved = JSON.parse(localStorage.chordplayer);
		} else {
			data2bSaved = {};
		}
		data2bSaved.actScaleBase = actScaleBase;
		localStorage.chordplayer = JSON.stringify(data2bSaved);
	}

	actScale = getNotes(nns[actScaleBase], scales.major.noteDistances);
	initChordtable();
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

