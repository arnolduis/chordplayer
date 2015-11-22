// =============  Harmonic logic ==================
var chords = {
	minor: [3, 7],
	major: [4, 7]
};

var scales = {
	major: [2, 4, 5, 7, 9, 11]
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

function getType () {
	// body...
}

// ===================== Sampler ==================================
// function playSegment(sample, startTime, endTime){
//     sample.currentTime = startTime || 0;
//     segmentEnd = endTime;
//     sample.play();
// }

var smpl = {
	piano: {},
	guitar: {}
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

/**
* @param notes is an array of chromatic notes
*/

function playNotes (notes) {
    if (notes) {
    	if (smpl[actInstrument].bass) {
        	smpl[actInstrument].bass[notes[0]].currentTime = 0;
        	smpl[actInstrument].bass[notes[0]].play();
    	}
        for (var i = 0; i < notes.length; i++) {
            smpl[actInstrument].notes[notes[i]].currentTime = 0;
            smpl[actInstrument].notes[notes[i]].play();
        }
    } else {
        console.log("No notes were given");
    }
}

function playCadenceNotes (notes) {
    if (notes) {
        for (var i = 0; i < notes.length; i++) {
            smpl[actInstrument].cadence[notes[i]].currentTime = 0;
            smpl[actInstrument].cadence[notes[i]].play();
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
 	for (var i = 0; i < 12; i++) {
 		smpl.piano.notes[i].pause();
 		smpl.piano.bass[i].pause();
 		smpl.piano.cadence[i].pause();
 		smpl.guitar.notes[i].pause();
 		smpl.guitar.cadence[i].pause();
 	}
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
var states = [stePlay, steShow];
var actState = 0;
var actNotes = [];
var actInstrument = "guitar";
var actScale = getNotes(nns.C, scales.major);
var random;

var allowedDegrees = [0, 1, 3, 4, 5, 6, 7];
// var allowedDegrees = [0, 3, 4];

var btnNext = document.getElementById("btnNext");
var btnRepeat = document.getElementById("btnRepeat");
var btnCadence = document.getElementById("btnCadence");
var lblChordName = document.getElementById("chordName");
btnNext.focus();

var ctrChord = document.getElementById("chord-container");
init();





// ==
function init (options) {
	while (ctrChord.firstChild) {
	    ctrChord.removeChild(ctrChord.firstChild);
	}

	for (var i = 0; i < actScale.length; i++) {
		var btnChord = document.createElement("div");
		btnChord.dataset.degree = i;
		btnChord.className = "btn chord";
		btnChord.innerHTML = nns[actScale[i]] + " " + dns[i];
		btnChord.addEventListener("click", function (event) {
			playChord(event.srcElement.dataset.degree);
		});
		ctrChord.appendChild(btnChord);
	}

	
}


function playChord (base) { 
		stopAllPlaying();
		clearTimeout(toutCadence);

		// Guitars only have whole chord samples, no need to get individual notes
		var notes = [];
		if (actInstrument !== "guitar") {
	    	notes = getTriadByScale(actScale[base], actScale);
		} else {
			notes = [actScale[base]];
		}

	    
	    console.log("Chord Played: ", getNames(actNotes));
	    console.log("");
	    playNotes(notes);	
}

function playCadence () {

	stopAllPlaying();
	clearTimeout(toutCadence);


	// Guitars only have whole chord samples, no need to get individual notes
	var ton = [];
	var sub = [];
	var dom = [];
	if (actInstrument !== "guitar") {
    	notes = getTriadByScale(actScale[base], actScale);
		ton = getTriadByScale(actScale[0], actScale);
		sub = getTriadByScale(actScale[3], actScale);
		dom = getTriadByScale(actScale[4], actScale);
	} else {
		ton = [actScale[0]];
		sub = [actScale[3]];
		dom = [actScale[4]];
	}

    playCadenceNotes(ton);
	toutCadence = setTimeout(function () {
		playCadenceNotes(sub);
		toutCadence = setTimeout(function () {
			playCadenceNotes(dom);
			toutCadence = setTimeout(function () {
				playCadenceNotes(ton);
				toutCadence = setTimeout(function () {
				},500);
			},500);
		},500);
	},500)
;}

function repeat () {
	stopAllPlaying();
	clearTimeout(toutCadence);
    
    console.log("Chord Played: ", getNames(actNotes));
    console.log("");
    playNotes(actNotes);

}

function stePlay () {
	console.log("NEW ROUND:");
	stopAllPlaying();
	clearTimeout(toutCadence);
    lblChordName.innerHTML = "?";
    
    var newRandom = Math.floor(Math.random()* 7 );
    while( (random === newRandom) || (allowedDegrees.indexOf(newRandom) < 0) ){
    	newRandom = Math.floor(Math.random()* 7 );
    }
    random = newRandom;

    // Guitar samples only have whole powerchords, so no need to get note series
    if (actInstrument !== "guitar") {
    	actNotes = getTriadByScale(actScale[random],actScale);
    } else {
    	actNotes = [actScale[random]];
    }
    
    console.log("Chord Played: ", getNames(actNotes));
    console.log("");
    playNotes(actNotes);

	actState = (actState +1) % states.length;
}

function steShow () {
    lblChordName.innerHTML = dns[random];
	actState = (actState +1) % states.length;
}

function next () {
	states[actState](actScale);
}


function changeScale (event) {
	actScale = getNotes(nns[event.value], scales.major);
	init();
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