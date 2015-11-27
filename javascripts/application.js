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
	minor: {
		notes    : [3, 7],
		jazzNot  : "min",
		classNot : ""
	},
	major: {
		notes    : [4, 7],
		jazzNot  : "",
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
var selectedInstruments = ["guitar", "strings"];
var actScaleBase = "C";
var actScaleType = "major";
var actScale = getNotes(nns[actScaleBase], scales[actScaleType].noteDistances);

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
setOnAllSamples("volume", actVolume);




var random;
// ==
function init (options) {
	var i;

	// Define plus chords that will be added to the basic set
	// We will move it into the choosing matrix sometime
	var plusChords = [
		{
			base:  mod(nns[actScaleBase] - 1, 12),
			notes: getNotes(mod(nns[actScaleBase] - 1, 12), chords.major.notes), 
			type: "major"
		},
		{
			base: mod(nns[actScaleBase] + 4, 12),
			notes: getNotes(mod(nns[actScaleBase] + 4, 12), chords.dominant.notes),
			type: "dominant"
		}
	];

	// Fill up actChords, based on Scale, and ush in plusChords and sort
	actChords = [];
	for (i = 0; i < actScale.length; i++) {
		actChords.push({
			notes: getNotes(actScale[i], chords[scales[actScaleType].chordTypes[i]].notes),
			base: actScale[i],
			type: scales[actScaleType].chordTypes[i],
		});
	}
	for (i = 0; i < plusChords.length; i++) {
		actChords.push(plusChords[i]);
	}
	actChords.sort(actChords);
	// Build buttons
	 while (ctrChord.firstChild) {
	    ctrChord.removeChild(ctrChord.firstChild);
	}

	function evlrPlayChord (event) {
		var notes = actChords[parseInt(event.srcElement.dataset.i)].notes;
		stopAllPlaying();
	    for (var i = 0; i < selectedInstruments.length; i++) {
	    	if (selectedInstruments[i] === "guitar") {
	    		playNotes([notes[0]],  selectedInstruments[i]);	
	    	} else {
			    playNotes(notes, selectedInstruments[i]);	
	    	}
	    }

	}
	for (i = 0; i < actChords.length; i++) {
		var btnChord = document.createElement("div");
		btnChord.dataset.i = i;
		btnChord.className = "btn chord";
		var lbelBase = nns[actChords[i].base];
		var lbelJazz = chords[actChords[i].type].jazzNot;
		var out = getLbelDegree(actChords[i]);
		btnChord.className += out.class;
		var lbelDegree = out.label;
		var lbelClass = chords[actChords[i].type].classNot;
		btnChord.innerHTML = lbelBase + lbelJazz + "&#13;&#10;" + lbelDegree + lbelClass ;
		btnChord.addEventListener("click", evlrPlayChord);
		ctrChord.appendChild(btnChord);
	}
	// Preselect <select> elements
	sctInstruments.options[0].selected = "selected";
}

function getLbelDegree (x) {
	var out = {};


	// Normalize
	var base = x.base; 
	var baseNorm = mod(x.base - actScale[0], 12);
	var degree = actScale.indexOf(base);

	// Count stuff
	if (dns[baseNorm]) {
		out.label = dns[baseNorm];
		out.class = "";
		if (scales[actScaleType].chordTypes[degree] !== x.type) {
			out.class = " external";
		}
	} else if (extdns[baseNorm]){
		out.label = extdns[baseNorm];
		out.class = " external";
	} else {
		return console.log("Something wrong in the getLbelDegree function");
	}
	if ("minor" ===	 x.type || "diminished" === x.type) {
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
					stopAllPlaying()
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

function changeScale (event) {
	actScaleBase = event.value;
	actScale = getNotes(nns[actScaleBase], scales.major.noteDistances);
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

