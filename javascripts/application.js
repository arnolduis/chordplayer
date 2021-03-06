// Generate note and scale numbers
var chords = {
	minor: [3, 7],
	major: [4, 7]
};

var scales = {
	major: [2, 4, 5, 7, 9, 11]
};

var degrees = ["I", "II", "III", "IV", "V", "VI", "VII"];

var nss = [];

for (var i = 0; i < 12; i++) {
	// console.log("./samples/mcg_f_0" + (60 + i) + ".ogg");
	nss[i] = new Audio("./samples/mcg_f_0" + (60 + i) + ".ogg");
}

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

// ===================== Play Audio
function playSegment(sample, startTime, endTime){
    sample.currentTime = startTime;
    segmentEnd = endTime;
    sample.play();
}

function playNotes (notes, startTime, endTime) {
    if (notes) {
        for (var i = 0; i < notes.length; i++) {
            playSegment(nss[notes[i]], startTime, endTime);
        }
    } else {
        console.log("No notes were given");
    }
}

function getNames (notes) {
	var noteNames = [];
	for (var i = 0; i < notes.length; i++) {
		noteNames.push(nns[notes[i]]);
	}
	return noteNames;
}

function fadeout(sample) {
	var orgVol = sample.volume;
	var vol = orgVol;
	var volDecr = 0.1;
	var interval = 100; // 200ms interval

	var fadeoutIvl = setInterval( function() {
	    // Reduce volume by 0.05 as long as it is above 0
	    // This works as long as you start with a multiple of 0.05!
	    if (vol > 0) {
	      vol -= volDecr;
	      sample.volume = vol;
	    }
	    else {
	      // Stop the setInterval when 0 is reached
	      clearInterval(fadeout);
	      sample.pause();
	      sample.volume = orgVol;
	    }
	}, interval);
} 

function stopAllPlaying(samples) {
 	for (var i = 0; i < samples.length; i++) {
 		samples[i].pause();
 	}
} 


// ========== Main functions ============
var pauseTimeout;
var cadenceTimeout;
var segmentEnd;
var startTime = 0.0;
var endTime = 10;
var states = [stePlay, steShow];
var actState = 0;
var actNotes = [];
var actScale = getNotes(nns.C, scales.major);
var random;

var btnNext = document.getElementById("btnNext");
var btnRepeat = document.getElementById("btnRepeat");
var btnCadence = document.getElementById("btnCadence");
var lblChordName = document.getElementById("chordName");
btnNext.focus();

function playCadence () {

	stopAllPlaying(nss);
	clearTimeout(pauseTimeout);
	clearTimeout(cadenceTimeout);

	var ton = getTriadByScale(actScale[0], actScale);
	var sub = getTriadByScale(actScale[3], actScale);
	var dom = getTriadByScale(actScale[4], actScale);

    playNotes(ton, 0.0, 0.5);
	cadenceTimeout = setTimeout(function () {
		stopAllPlaying(nss);
		playNotes(sub, 0.0, 0.5);
		cadenceTimeout = setTimeout(function () {
			stopAllPlaying(nss);
			playNotes(dom, 0.0, 0.5);
			cadenceTimeout = setTimeout(function () {
				stopAllPlaying(nss);
				playNotes(ton, 0.0, 0.5);
				cadenceTimeout = setTimeout(function () {
					stopAllPlaying(nss);
				},500);
			},500);
		},500);
	},500);
}

function repeat () {
	stopAllPlaying(nss);
	clearTimeout(cadenceTimeout);
	clearTimeout(pauseTimeout);
    
    console.log("Chord Played: ", getNames(actNotes));
    console.log("");
    playNotes(actNotes, startTime, endTime);

	pauseTimeout = setTimeout(function () {
		for (var i = 0; i < nss.length; i++) {
			nss[i].pause();
		}
	},2000);
}

function stePlay () {
	console.log("NEW ROUND:");
	stopAllPlaying(nss);
	clearTimeout(cadenceTimeout);
	clearTimeout(pauseTimeout);
    lblChordName.innerHTML = "?";
    
    var newRandom = Math.floor(Math.random()* 7 );
    while(random === newRandom){
    	newRandom = Math.floor(Math.random()* 7 );
    }
    random = newRandom;

    actNotes = getTriadByScale(actScale[random],actScale);
    
    console.log("Chord Played: ", getNames(actNotes));
    console.log("");
    playNotes(actNotes, startTime, endTime);


	pauseTimeout = setTimeout(function () {
		for (var i = 0; i < nss.length; i++) {
			nss[i].pause();
		}
	},2000);

	actState = (actState +1) % states.length;
}

function steShow () {
    lblChordName.innerHTML = degrees[random];
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