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

var smplPiano = [];
for (var i = 0; i < 12; i++) {
	// console.log("./samples/mcg_f_0" + (60 + i) + ".ogg");
	smplPiano[i] = new Audio("./samples/2mp/piano/mcg_f_0" + (60 + i) + ".ogg");
}

var smplPianoCadence = [];
for (var i = 0; i < 12; i++) {
	smplPianoCadence[i] = new Audio("./samples/05mp/piano/mcg_f_0" + (60 + i) + ".ogg");
}

var smplPianoBass = [];
for (var i = 0; i < 12; i++) {
	smplPianoBass[i] = new Audio("./samples/2mp/piano/mcg_f_0" + (48 + i) + ".ogg");
}

var smplGuitar = [];
for (var i = 0; i < 12; i++) {
	smplGuitar[i] = new Audio("./samples/2mp/guitar/pwrchord_" + (1 + i) + ".ogg");
}

var smplGuitarCadence = [];
for (var i = 0; i < 12; i++) {
	smplGuitarCadence[i] = new Audio("./samples/05mp/guitar/pwrchord_" + (1 + i) + ".ogg");
}

function playNotes (notes) {
    if (notes) {
        smplPianoBass[notes[0]].currentTime = 0;
        smplPianoBass[notes[0]].play();
        for (var i = 0; i < notes.length; i++) {
            // playSegment(smplPiano[notes[i]], startTime, endTime);
            smplPiano[notes[i]].currentTime = 0;
            smplPiano[notes[i]].play();
        }
    } else {
        console.log("No notes were given");
    }
}

function playCadenceNotes (notes, startTime, endTime) {
    if (notes) {
        for (var i = 0; i < notes.length; i++) {
            smplPianoCadence[notes[i]].currentTime = 0;
            smplPianoCadence[notes[i]].play();
        }
    } else {
        console.log("No notes were given");
    }
}

function stopNotes (notes) {
	if (notes.constructor !== Array) {
		notes = [notes];
	}
	for (var i = 0; i < notes.length; i++) {
		smplPiano[notes[i]].pause();
	}
}

function stopAllPlaying(samples) {
 	for (var i = 0; i < samples.length; i++) {
 		smplPianoBass[i].pause();
 		samples[i].pause();
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
var tmtPause;
var tmtCadence;
var segmentEnd;
var startTime = 0.0;
var endTime = 10;
var states = [stePlay, steShow];
var actState = 0;
var actNotes = [];
var actInstrument = "Piano";
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

function changeScale (event) {
	console.log(event.value);
	actScale = getNotes(nns[event.value], scales.major);
	init();
}

function playChord (base) { //ttt
		stopAllPlaying(smplPiano);
		clearTimeout(tmtCadence);
		clearTimeout(tmtPause);

	    var notes = getTriadByScale(actScale[base], actScale);
	    
	    console.log("Chord Played: ", getNames(actNotes));
	    console.log("");
	    playNotes(notes);	
}

function playCadence () {//ttt

	stopAllPlaying(smplPiano);
	clearTimeout(tmtPause);
	clearTimeout(tmtCadence);

	var ton = getTriadByScale(actScale[0], actScale);
	var sub = getTriadByScale(actScale[3], actScale);
	var dom = getTriadByScale(actScale[4], actScale);

    playCadenceNotes(ton);
	tmtCadence = setTimeout(function () {
		playCadenceNotes(sub);
		tmtCadence = setTimeout(function () {
			playCadenceNotes(dom);
			tmtCadence = setTimeout(function () {
				playCadenceNotes(ton);
				tmtCadence = setTimeout(function () {
				},500);
			},500);
		},500);
	},500)
;}

function repeat () {//ttt
	stopAllPlaying(smplPiano);
	clearTimeout(tmtCadence);
	clearTimeout(tmtPause);
    
    console.log("Chord Played: ", getNames(actNotes));
    console.log("");
    playNotes(actNotes, startTime, endTime);

	tmtPause = setTimeout(function () {
		for (var i = 0; i < smplPiano.length; i++) {
			smplPiano[i].pause();
		}
	},2000);
}

function stePlay () {//ttt
	console.log("NEW ROUND:");
	stopAllPlaying(smplPiano);
	clearTimeout(tmtCadence);
	clearTimeout(tmtPause);
    lblChordName.innerHTML = "?";
    
    var newRandom = Math.floor(Math.random()* 7 );
    while( (random === newRandom) || (allowedDegrees.indexOf(newRandom) < 0) ){
    	newRandom = Math.floor(Math.random()* 7 );
    }
    random = newRandom;

    actNotes = getTriadByScale(actScale[random],actScale);
    
    console.log("Chord Played: ", getNames(actNotes));
    console.log("");
    playNotes(actNotes, startTime, endTime);

	actState = (actState +1) % states.length;
}

function steShow () {
    lblChordName.innerHTML = dns[random];
	actState = (actState +1) % states.length;
}

function next () {
	states[actState](actScale);
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